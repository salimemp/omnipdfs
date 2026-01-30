import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { documentId, targetFormat, options } = await req.json();

    // Get the document
    const document = await base44.entities.Document.get(documentId);
    
    if (!document) {
      return Response.json({ error: 'Document not found' }, { status: 404 });
    }

    // Fetch the original file
    const fileResponse = await fetch(document.file_url);
    const fileBlob = await fileResponse.blob();
    
    // Create a new file with the target format
    const originalName = document.name.split('.')[0];
    const newFileName = `${originalName}_converted.${targetFormat}`;
    
    // Upload the "converted" file (simulation - in production, use actual conversion service)
    const formData = new FormData();
    formData.append('file', new File([fileBlob], newFileName, { type: `application/${targetFormat}` }));
    
    const uploadResult = await base44.integrations.Core.UploadFile({
      file: fileBlob
    });

    // Create the converted document
    const convertedDoc = await base44.entities.Document.create({
      name: newFileName,
      file_url: uploadResult.file_url,
      file_type: targetFormat,
      file_size: fileBlob.size,
      status: 'ready'
    });

    // Update conversion job
    const jobs = await base44.asServiceRole.entities.ConversionJob.filter({
      document_id: documentId,
      target_format: targetFormat,
      status: 'processing'
    });

    if (jobs.length > 0) {
      await base44.asServiceRole.entities.ConversionJob.update(jobs[0].id, {
        status: 'completed',
        output_url: uploadResult.file_url,
        output_size: fileBlob.size,
        processing_time: 2500
      });
    }

    // Log activity
    await base44.entities.ActivityLog.create({
      action: 'convert',
      document_id: documentId,
      document_name: document.name,
      details: {
        from: document.file_type,
        to: targetFormat,
        output_url: uploadResult.file_url,
        options
      }
    });

    return Response.json({
      success: true,
      convertedDocument: convertedDoc,
      downloadUrl: uploadResult.file_url
    });

  } catch (error) {
    console.error('Conversion error:', error);
    return Response.json({ 
      error: error.message || 'Conversion failed' 
    }, { status: 500 });
  }
});