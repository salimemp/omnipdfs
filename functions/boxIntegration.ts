import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, fileId, fileName, fileUrl } = await req.json();

    const clientId = Deno.env.get('BOX_CLIENT_ID');
    const clientSecret = Deno.env.get('BOX_CLIENT_SECRET');
    
    if (!clientId || !clientSecret) {
      return Response.json({ error: 'Box credentials not configured' }, { status: 500 });
    }

    const accessToken = user.box_access_token;
    
    if (!accessToken) {
      return Response.json({ 
        error: 'Box not connected. Please authorize in Settings.' 
      }, { status: 401 });
    }

    if (action === 'list') {
      const response = await fetch(
        'https://api.box.com/2.0/folders/0/items?limit=50',
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to list Box files');
      }

      const data = await response.json();
      return Response.json({ success: true, files: data.entries });
    }

    if (action === 'download' && fileId) {
      const response = await fetch(
        `https://api.box.com/2.0/files/${fileId}/content`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to download from Box');
      }

      const fileBlob = await response.blob();
      const uploadResult = await base44.integrations.Core.UploadFile({ file: fileBlob });
      
      return Response.json({ 
        success: true, 
        fileUrl: uploadResult.file_url 
      });
    }

    if (action === 'upload' && fileName && fileUrl) {
      const fileResponse = await fetch(fileUrl);
      const fileBlob = await fileResponse.blob();

      const formData = new FormData();
      formData.append('attributes', JSON.stringify({
        name: fileName,
        parent: { id: '0' }
      }));
      formData.append('file', fileBlob);

      const uploadResponse = await fetch(
        'https://upload.box.com/api/2.0/files/content',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
          body: formData,
        }
      );

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload to Box');
      }

      const result = await uploadResponse.json();
      return Response.json({ success: true, fileId: result.entries[0].id });
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('Box error:', error);
    return Response.json({ 
      error: error.message || 'Box operation failed' 
    }, { status: 500 });
  }
});