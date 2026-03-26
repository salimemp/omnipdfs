import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, fileId } = await req.json();

    // Get Google Drive access token from app connector
    const accessToken = await base44.asServiceRole.connectors.getAccessToken('googledrive');
    
    if (!accessToken) {
      return Response.json({ 
        error: 'Google Drive not connected. Please authorize in Settings.' 
      }, { status: 401 });
    }

    if (action === 'list') {
      // List files from Google Drive
      const response = await fetch(
        'https://www.googleapis.com/drive/v3/files?pageSize=50&fields=files(id,name,mimeType,size,createdTime,modifiedTime,thumbnailLink)',
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch files from Google Drive');
      }

      const data = await response.json();
      return Response.json({ success: true, files: data.files });
    }

    if (action === 'download' && fileId) {
      // Download a specific file
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to download file from Google Drive');
      }

      // Upload to Base44 storage
      const fileBlob = await response.blob();
      const formData = new FormData();
      formData.append('file', fileBlob);

      const uploadResult = await base44.integrations.Core.UploadFile({ file: fileBlob });
      
      return Response.json({ 
        success: true, 
        fileUrl: uploadResult.file_url 
      });
    }

    if (action === 'upload') {
      const { fileName, fileUrl } = await req.json();
      
      // Fetch file from our storage
      const fileResponse = await fetch(fileUrl);
      const fileBlob = await fileResponse.blob();

      // Upload to Google Drive
      const metadata = {
        name: fileName,
      };

      const form = new FormData();
      form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
      form.append('file', fileBlob);

      const uploadResponse = await fetch(
        'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
          body: form,
        }
      );

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file to Google Drive');
      }

      const result = await uploadResponse.json();
      return Response.json({ success: true, driveFileId: result.id });
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('Google Drive error:', error);
    return Response.json({ 
      error: error.message || 'Google Drive operation failed' 
    }, { status: 500 });
  }
});