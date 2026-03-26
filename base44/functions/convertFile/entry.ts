import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

const CLOUDCONVERT_API_KEY = Deno.env.get('CLOUDCONVERT_API_KEY');
const CLOUDCONVERT_API_URL = 'https://api.cloudconvert.com/v2';

async function cloudConvertRequest(endpoint, method = 'GET', body = null) {
  const options = {
    method,
    headers: {
      'Authorization': `Bearer ${CLOUDCONVERT_API_KEY}`,
      'Content-Type': 'application/json',
    },
  };
  
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  const response = await fetch(`${CLOUDCONVERT_API_URL}${endpoint}`, options);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || `CloudConvert API error: ${response.status}`);
  }
  
  return response.json();
}

async function waitForJob(jobId, maxWaitTime = 180000) {
  const startTime = Date.now();
  
  while (Date.now() - startTime < maxWaitTime) {
    const jobData = await cloudConvertRequest(`/jobs/${jobId}`);
    
    if (jobData.data.status === 'finished') {
      return jobData.data;
    }
    
    if (jobData.data.status === 'error') {
      throw new Error(`Conversion failed: ${jobData.data.message || 'Unknown error'}`);
    }
    
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  throw new Error('Conversion timeout');
}

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

    const startTime = Date.now();

    // Create CloudConvert job
    const jobData = await cloudConvertRequest('/jobs', 'POST', {
      tasks: {
        'import-file': {
          operation: 'import/url',
          url: document.file_url,
          filename: document.name
        },
        'convert-file': {
          operation: 'convert',
          input: 'import-file',
          output_format: targetFormat,
          ...(options?.quality && { quality: options.quality })
        },
        'export-file': {
          operation: 'export/url',
          input: 'convert-file'
        }
      }
    });

    // Wait for conversion to complete
    const completedJob = await waitForJob(jobData.data.id);
    
    // Get the export task result
    const exportTask = completedJob.tasks.find(t => t.operation === 'export/url' && t.status === 'finished');
    
    if (!exportTask || !exportTask.result?.files?.[0]?.url) {
      throw new Error('Conversion completed but no output file found');
    }

    const convertedFileUrl = exportTask.result.files[0].url;
    const convertedFileSize = exportTask.result.files[0].size;
    
    // Download the converted file from CloudConvert
    const convertedFileResponse = await fetch(convertedFileUrl);
    const convertedFileBlob = await convertedFileResponse.arrayBuffer();
    
    // Upload to our storage
    const originalName = document.name.split('.')[0];
    const newFileName = `${originalName}_converted.${targetFormat}`;
    
    const file = new File([convertedFileBlob], newFileName, { 
      type: 'application/octet-stream' 
    });
    
    const uploadResult = await base44.integrations.Core.UploadFile({ file });
    
    if (!uploadResult.file_url) {
      throw new Error('File upload failed');
    }

    // Create the converted document
    const convertedDoc = await base44.entities.Document.create({
      name: newFileName,
      file_url: uploadResult.file_url,
      file_type: targetFormat,
      file_size: convertedFileSize,
      status: 'ready'
    });

    const processingTime = Date.now() - startTime;

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
        output_size: convertedFileSize,
        processing_time: processingTime
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
        processing_time: processingTime,
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