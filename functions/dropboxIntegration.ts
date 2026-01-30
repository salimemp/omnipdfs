import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, path } = await req.json();

    // Get Dropbox access token from user metadata
    const accessToken = user.dropbox_access_token;
    
    if (!accessToken) {
      return Response.json({ 
        error: 'Dropbox not connected. Please authorize in Settings.' 
      }, { status: 401 });
    }

    if (action === 'list') {
      const response = await fetch(
        'https://api.dropboxapi.com/2/files/list_folder',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            path: path || '',
            limit: 50,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to list Dropbox files');
      }

      const data = await response.json();
      return Response.json({ success: true, files: data.entries });
    }

    if (action === 'download') {
      const response = await fetch(
        'https://content.dropboxapi.com/2/files/download',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Dropbox-API-Arg': JSON.stringify({ path }),
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to download from Dropbox');
      }

      const fileBlob = await response.blob();
      const uploadResult = await base44.integrations.Core.UploadFile({ file: fileBlob });
      
      return Response.json({ 
        success: true, 
        fileUrl: uploadResult.file_url 
      });
    }

    if (action === 'upload') {
      const { fileName, fileUrl } = await req.json();
      
      const fileResponse = await fetch(fileUrl);
      const fileBuffer = await fileResponse.arrayBuffer();

      const uploadResponse = await fetch(
        'https://content.dropboxapi.com/2/files/upload',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/octet-stream',
            'Dropbox-API-Arg': JSON.stringify({
              path: `/${fileName}`,
              mode: 'add',
              autorename: true,
            }),
          },
          body: fileBuffer,
        }
      );

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload to Dropbox');
      }

      const result = await uploadResponse.json();
      return Response.json({ success: true, dropboxPath: result.path_display });
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('Dropbox error:', error);
    return Response.json({ 
      error: error.message || 'Dropbox operation failed' 
    }, { status: 500 });
  }
});