import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, itemId, fileName, fileUrl } = await req.json();

    const clientId = Deno.env.get('ONEDRIVE_CLIENT_ID');
    const clientSecret = Deno.env.get('ONEDRIVE_CLIENT_SECRET');
    
    if (!clientId || !clientSecret) {
      return Response.json({ error: 'OneDrive credentials not configured' }, { status: 500 });
    }

    const accessToken = user.onedrive_access_token;
    
    if (!accessToken) {
      return Response.json({ 
        error: 'OneDrive not connected. Please authorize in Settings.' 
      }, { status: 401 });
    }

    if (action === 'list') {
      const response = await fetch(
        'https://graph.microsoft.com/v1.0/me/drive/root/children?$top=50',
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to list OneDrive files');
      }

      const data = await response.json();
      return Response.json({ success: true, files: data.value });
    }

    if (action === 'download' && itemId) {
      const response = await fetch(
        `https://graph.microsoft.com/v1.0/me/drive/items/${itemId}/content`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to download from OneDrive');
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
      const fileBuffer = await fileResponse.arrayBuffer();

      const uploadResponse = await fetch(
        `https://graph.microsoft.com/v1.0/me/drive/root:/${fileName}:/content`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/octet-stream',
          },
          body: fileBuffer,
        }
      );

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload to OneDrive');
      }

      const result = await uploadResponse.json();
      return Response.json({ success: true, itemId: result.id });
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('OneDrive error:', error);
    return Response.json({ 
      error: error.message || 'OneDrive operation failed' 
    }, { status: 500 });
  }
});