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

      if (action === 'list_files') {
        const response = await fetch(
          'https://www.googleapis.com/drive/v3/files?pageSize=100&fields=files(id,name,mimeType,size,createdTime,modifiedTime,thumbnailLink)',
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch files from Google Drive');
        }

        const result = await response.json();
        return Response.json({ success: true, files: result.files });
      }

      if (action === 'download_file') {
        const { fileId } = data;
        
        const response = await fetch(
          `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          }
        );

        if (!response.ok) {
          throw new Error('Failed to download file');
        }

        const fileBlob = await response.blob();
        const uploadResult = await base44.integrations.Core.UploadFile({
          file: fileBlob
        });

        return Response.json({ success: true, file_url: uploadResult.file_url });
      }
    }

    if (provider === 'dropbox') {
      const { DROPBOX_CLIENT_ID, DROPBOX_CLIENT_SECRET } = Deno.env.toObject();
      
      if (action === 'list_files') {
        return Response.json({ 
          success: true, 
          files: [],
          message: 'Dropbox integration requires user authorization'
        });
      }
    }

    if (provider === 'box') {
      const { BOX_CLIENT_ID, BOX_CLIENT_SECRET } = Deno.env.toObject();
      
      if (action === 'list_files') {
        return Response.json({ 
          success: true, 
          files: [],
          message: 'Box integration requires user authorization'
        });
      }
    }

    if (provider === 'onedrive') {
      const { ONEDRIVE_CLIENT_ID, ONEDRIVE_CLIENT_SECRET } = Deno.env.toObject();
      
      if (action === 'list_files') {
        return Response.json({ 
          success: true, 
          files: [],
          message: 'OneDrive integration requires user authorization'
        });
      }
    }

    return Response.json({ error: 'Invalid provider or action' }, { status: 400 });

  } catch (error) {
    console.error('Cloud file picker error:', error);
    return Response.json({ 
      error: error.message || 'Cloud operation failed' 
    }, { status: 500 });
  }
});