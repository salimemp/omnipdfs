import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, service, data } = await req.json();

    if (action === 'sync_to_service') {
      const { documentId } = data;
      const document = await base44.entities.Document.get(documentId);

      if (!document) {
        return Response.json({ error: 'Document not found' }, { status: 404 });
      }

      let result;
      
      if (service === 'googledrive') {
        const accessToken = await base44.asServiceRole.connectors.getAccessToken('googledrive');
        
        // Upload to Google Drive
        const fileBlob = await fetch(document.file_url).then(r => r.blob());
        
        const metadata = {
          name: document.name,
          mimeType: 'application/octet-stream'
        };

        const form = new FormData();
        form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
        form.append('file', fileBlob);

        const uploadResponse = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`
          },
          body: form
        });

        result = await uploadResponse.json();
      } else if (service === 'dropbox') {
        // Dropbox integration
        const response = await base44.functions.invoke('dropboxIntegration', {
          action: 'upload',
          documentId
        });
        result = response.data;
      } else if (service === 'onedrive') {
        // OneDrive integration
        const response = await base44.functions.invoke('oneDriveIntegration', {
          action: 'upload',
          documentId
        });
        result = response.data;
      } else if (service === 'box') {
        // Box integration
        const response = await base44.functions.invoke('boxIntegration', {
          action: 'upload',
          documentId
        });
        result = response.data;
      }

      await base44.entities.ActivityLog.create({
        action: 'share',
        document_id: documentId,
        details: {
          type: 'synced_to_service',
          service,
          result
        }
      });

      return Response.json({ success: true, result });
    }

    if (action === 'import_from_service') {
      const { fileId, fileName } = data;
      
      let fileUrl;
      let fileBlob;

      if (service === 'googledrive') {
        const accessToken = await base44.asServiceRole.connectors.getAccessToken('googledrive');
        
        const downloadResponse = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });

        fileBlob = await downloadResponse.blob();
        
        const uploadResult = await base44.integrations.Core.UploadFile({ file: fileBlob });
        fileUrl = uploadResult.file_url;
      }

      if (fileUrl) {
        const document = await base44.entities.Document.create({
          name: fileName,
          file_url: fileUrl,
          file_type: fileName.split('.').pop().toLowerCase(),
          file_size: fileBlob?.size || 0
        });

        return Response.json({ success: true, document });
      }

      return Response.json({ error: 'Import failed' }, { status: 400 });
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('External service integration error:', error);
    return Response.json({ 
      error: error.message || 'Integration failed' 
    }, { status: 500 });
  }
});