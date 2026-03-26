import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file');
    
    if (!file) {
      return Response.json({ error: 'No file provided' }, { status: 400 });
    }

    const uploadResult = await base44.integrations.Core.UploadFile({
      file: file
    });

    return Response.json({
      file_url: uploadResult.file_url,
      name: file.name,
      file_type: file.name.split('.').pop().toLowerCase(),
      file_size: file.size
    });

  } catch (error) {
    console.error('Upload error:', error);
    return Response.json({ 
      error: error.message || 'Upload failed' 
    }, { status: 500 });
  }
});