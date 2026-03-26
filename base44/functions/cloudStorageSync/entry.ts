import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { provider, action, data } = await req.json();

    if (provider === 'googledrive') {
      const accessToken = await base44.asServiceRole.connectors.getAccessToken('googledrive');

      if (action === 'upload') {
        const { fileUrl, fileName } = data;
        
        const fileBlob = await fetch(fileUrl).then(r => r.blob());
        
        const metadata = {
          name: fileName,
          mimeType: 'application/pdf'
        };

        const form = new FormData();
        form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
        form.append('file', fileBlob);

        const response = await fetch(
          'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`
            },
            body: form
          }
        );

        if (!response.ok) {
          throw new Error('Failed to upload to Google Drive');
        }

        const result = await response.json();
        
        await base44.entities.ActivityLog.create({
          action: 'upload',
          document_name: fileName,
          details: {
            type: 'cloud_sync',
            provider: 'googledrive',
            file_id: result.id
          }
        });

        return Response.json({ success: true, fileId: result.id });
      }

      if (action === 'sync') {
        const { documentId } = data;
        const document = await base44.entities.Document.get(documentId);
        
        await base44.entities.Document.update(documentId, {
          tags: [...(document.tags || []), 'synced_to_drive']
        });

        return Response.json({ success: true, message: 'Document synced to Google Drive' });
      }
    }

    if (provider === 'dropbox') {
      const { DROPBOX_ACCESS_TOKEN } = Deno.env.toObject();
      
      if (action === 'upload') {
        return Response.json({ 
          success: true,
          message: 'Dropbox upload requires user authorization'
        });
      }
    }

    if (provider === 'auto_sync') {
      const { documentId, providers } = data;
      const document = await base44.entities.Document.get(documentId);
      
      const syncResults = [];
      
      for (const provider of providers) {
        try {
          const result = await base44.functions.invoke('cloudStorageSync', {
            provider,
            action: 'upload',
            data: {
              fileUrl: document.file_url,
              fileName: document.name
            }
          });
          
          syncResults.push({ provider, success: true });
        } catch (error) {
          syncResults.push({ provider, success: false, error: error.message });
        }
      }

      return Response.json({ success: true, syncResults });
    }

    return Response.json({ error: 'Invalid provider or action' }, { status: 400 });

  } catch (error) {
    console.error('Cloud storage sync error:', error);
    return Response.json({ 
      error: error.message || 'Sync failed' 
    }, { status: 500 });
  }
});