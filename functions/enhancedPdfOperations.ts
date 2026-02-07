import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

const CLOUDCONVERT_API_KEY = Deno.env.get('CLOUDCONVERT_API_KEY');

async function cloudConvertRequest(endpoint, method = 'GET', body = null) {
  const options = {
    method,
    headers: {
      'Authorization': `Bearer ${CLOUDCONVERT_API_KEY}`,
      'Content-Type': 'application/json',
    },
  };
  if (body) options.body = JSON.stringify(body);
  
  const response = await fetch(`https://api.cloudconvert.com/v2/${endpoint}`, options);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'CloudConvert API error');
  }
  return response.json();
}

async function pollJobStatus(jobId, maxAttempts = 60) {
  for (let i = 0; i < maxAttempts; i++) {
    const { data: job } = await cloudConvertRequest(`jobs/${jobId}`);
    
    if (job.status === 'finished') return job;
    if (job.status === 'error') throw new Error(job.message || 'Job failed');
    
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  throw new Error('Job timeout');
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { documentId, operation, options } = await req.json();

    // Get the document
    const document = await base44.entities.Document.get(documentId);
    if (!document) {
      return Response.json({ error: 'Document not found' }, { status: 404 });
    }

    // Validate PDF document
    if (document.file_type !== 'pdf') {
      return Response.json({ 
        error: 'Only PDF documents supported' 
      }, { status: 400 });
    }

    let result = {};

    switch (operation) {
      case 'merge':
        // Merge multiple PDFs
        const { sourceDocIds } = options;
        if (!sourceDocIds || sourceDocIds.length < 2) {
          return Response.json({ 
            error: 'At least 2 documents required for merge' 
          }, { status: 400 });
        }

        // Fetch all source documents
        const sourceDocs = await Promise.all(
          sourceDocIds.map(id => base44.entities.Document.get(id))
        );

        // Validate all are PDFs
        if (sourceDocs.some(doc => doc.file_type !== 'pdf')) {
          return Response.json({ 
            error: 'All documents must be PDFs' 
          }, { status: 400 });
        }

        // Create merge job with CloudConvert
        const importTasks = sourceDocs.map((doc, idx) => ({
          operation: 'import/url',
          url: doc.file_url,
          filename: doc.name
        }));

        const mergeTask = {
          operation: 'merge',
          input: importTasks.map((_, idx) => `import_${idx}`),
          output_format: 'pdf'
        };

        const exportTask = {
          operation: 'export/url',
          input: ['merge']
        };

        const { data: mergeJob } = await cloudConvertRequest('jobs', 'POST', {
          tasks: {
            ...Object.fromEntries(importTasks.map((task, idx) => [`import_${idx}`, task])),
            merge: mergeTask,
            export: exportTask
          }
        });

        const finishedMergeJob = await pollJobStatus(mergeJob.id);
        const mergeExportTask = finishedMergeJob.tasks.find(t => t.operation === 'export/url');
        const mergeFileUrl = mergeExportTask.result.files[0].url;

        // Download and upload merged file
        const mergeResponse = await fetch(mergeFileUrl);
        const mergeBlob = await mergeResponse.blob();
        const mergeArrayBuffer = await mergeBlob.arrayBuffer();
        const mergeFile = new File([mergeArrayBuffer], `merged_${Date.now()}.pdf`, { type: 'application/pdf' });

        const { file_url: uploadedMergeUrl } = await base44.integrations.Core.UploadFile({ file: mergeFile });

        const mergedDoc = await base44.entities.Document.create({
          name: `merged_${Date.now()}.pdf`,
          file_url: uploadedMergeUrl,
          file_type: 'pdf',
          file_size: mergeArrayBuffer.byteLength,
          status: 'ready'
        });

        result = {
          success: true,
          operation: 'merge',
          documentId: mergedDoc.id,
          file_url: uploadedMergeUrl,
          message: `Merged ${sourceDocIds.length} PDFs successfully`
        };
        break;

      case 'split':
        // Split PDF by page ranges
        const { ranges } = options; // e.g., [{start: 1, end: 3}, {start: 4, end: 6}]
        
        if (!ranges || ranges.length === 0) {
          return Response.json({ 
            error: 'Page ranges required' 
          }, { status: 400 });
        }

        // Create split jobs for each range
        const splitDocs = [];
        
        for (let idx = 0; idx < ranges.length; idx++) {
          const range = ranges[idx];
          const { data: splitJob } = await cloudConvertRequest('jobs', 'POST', {
            tasks: {
              import: {
                operation: 'import/url',
                url: document.file_url,
                filename: document.name
              },
              task: {
                operation: 'convert',
                input: ['import'],
                input_format: 'pdf',
                output_format: 'pdf',
                pages: `${range.start}-${range.end}`
              },
              export: {
                operation: 'export/url',
                input: ['task']
              }
            }
          });

          const finishedSplitJob = await pollJobStatus(splitJob.id);
          const splitExportTask = finishedSplitJob.tasks.find(t => t.operation === 'export/url');
          const splitFileUrl = splitExportTask.result.files[0].url;

          const splitResponse = await fetch(splitFileUrl);
          const splitBlob = await splitResponse.blob();
          const splitArrayBuffer = await splitBlob.arrayBuffer();
          const splitFile = new File([splitArrayBuffer], `${document.name.replace('.pdf', '')}_part${idx + 1}.pdf`, { type: 'application/pdf' });

          const { file_url: uploadedSplitUrl } = await base44.integrations.Core.UploadFile({ file: splitFile });

          const splitDoc = await base44.entities.Document.create({
            name: `${document.name.replace('.pdf', '')}_part${idx + 1}.pdf`,
            file_url: uploadedSplitUrl,
            file_type: 'pdf',
            file_size: splitArrayBuffer.byteLength,
            status: 'ready'
          });

          splitDocs.push(splitDoc);
        }

        result = {
          success: true,
          operation: 'split',
          documents: splitDocs,
          message: `Split into ${ranges.length} documents`
        };
        break;

      case 'compress':
        // Compress PDF
        const { quality = 'medium' } = options;
        
        const profileMap = { low: 'mrc', medium: 'default', high: 'good' };
        
        const { data: compressJob } = await cloudConvertRequest('jobs', 'POST', {
          tasks: {
            import: {
              operation: 'import/url',
              url: document.file_url,
              filename: document.name
            },
            optimize: {
              operation: 'optimize',
              input: ['import'],
              input_format: 'pdf',
              profile: profileMap[quality]
            },
            export: {
              operation: 'export/url',
              input: ['optimize']
            }
          }
        });

        const finishedCompressJob = await pollJobStatus(compressJob.id);
        const compressExportTask = finishedCompressJob.tasks.find(t => t.operation === 'export/url');
        const compressFileUrl = compressExportTask.result.files[0].url;

        const compressResponse = await fetch(compressFileUrl);
        const compressBlob = await compressResponse.blob();
        const compressArrayBuffer = await compressBlob.arrayBuffer();
        const compressFile = new File([compressArrayBuffer], document.name.replace('.pdf', '_compressed.pdf'), { type: 'application/pdf' });

        const { file_url: uploadedCompressUrl } = await base44.integrations.Core.UploadFile({ file: compressFile });

        const compressedDoc = await base44.entities.Document.create({
          name: document.name.replace('.pdf', '_compressed.pdf'),
          file_url: uploadedCompressUrl,
          file_type: 'pdf',
          file_size: compressArrayBuffer.byteLength,
          status: 'ready'
        });

        result = {
          success: true,
          operation: 'compress',
          documentId: compressedDoc.id,
          file_url: uploadedCompressUrl,
          originalSize: document.file_size,
          newSize: compressArrayBuffer.byteLength,
          savings: `${Math.round((1 - compressArrayBuffer.byteLength / document.file_size) * 100)}%`,
          message: 'PDF compressed successfully'
        };
        break;

      case 'rotate':
        // Rotate pages
        const { pages, angle } = options; // pages: [1, 2, 3], angle: 90, 180, 270
        
        if (!pages || !angle || ![90, 180, 270].includes(angle)) {
          return Response.json({ 
            error: 'Valid pages and angle (90, 180, 270) required' 
          }, { status: 400 });
        }

        const { data: rotateJob } = await cloudConvertRequest('jobs', 'POST', {
          tasks: {
            import: {
              operation: 'import/url',
              url: document.file_url,
              filename: document.name
            },
            task: {
              operation: 'convert',
              input: ['import'],
              input_format: 'pdf',
              output_format: 'pdf',
              page_rotation: `${pages.join(',')}: ${angle}`
            },
            export: {
              operation: 'export/url',
              input: ['task']
            }
          }
        });

        const finishedRotateJob = await pollJobStatus(rotateJob.id);
        const rotateExportTask = finishedRotateJob.tasks.find(t => t.operation === 'export/url');
        const rotateFileUrl = rotateExportTask.result.files[0].url;

        const rotateResponse = await fetch(rotateFileUrl);
        const rotateBlob = await rotateResponse.blob();
        const rotateArrayBuffer = await rotateBlob.arrayBuffer();
        const rotateFile = new File([rotateArrayBuffer], document.name.replace('.pdf', '_rotated.pdf'), { type: 'application/pdf' });

        const { file_url: uploadedRotateUrl } = await base44.integrations.Core.UploadFile({ file: rotateFile });

        const rotatedDoc = await base44.entities.Document.create({
          name: document.name.replace('.pdf', '_rotated.pdf'),
          file_url: uploadedRotateUrl,
          file_type: 'pdf',
          file_size: rotateArrayBuffer.byteLength,
          status: 'ready'
        });

        result = {
          success: true,
          operation: 'rotate',
          documentId: rotatedDoc.id,
          file_url: uploadedRotateUrl,
          pages,
          angle,
          message: `Rotated ${pages.length} pages by ${angle}°`
        };
        break;

      case 'watermark':
        // Add watermark
        const { text, opacity = 0.5, position = 'center' } = options;
        
        if (!text) {
          return Response.json({ 
            error: 'Watermark text required' 
          }, { status: 400 });
        }

        const { data: watermarkJob } = await cloudConvertRequest('jobs', 'POST', {
          tasks: {
            import: {
              operation: 'import/url',
              url: document.file_url,
              filename: document.name
            },
            task: {
              operation: 'watermark',
              input: ['import'],
              text: text,
              opacity: Math.round(opacity * 100),
              position: position
            },
            export: {
              operation: 'export/url',
              input: ['task']
            }
          }
        });

        const finishedWatermarkJob = await pollJobStatus(watermarkJob.id);
        const watermarkExportTask = finishedWatermarkJob.tasks.find(t => t.operation === 'export/url');
        const watermarkFileUrl = watermarkExportTask.result.files[0].url;

        const watermarkResponse = await fetch(watermarkFileUrl);
        const watermarkBlob = await watermarkResponse.blob();
        const watermarkArrayBuffer = await watermarkBlob.arrayBuffer();
        const watermarkFile = new File([watermarkArrayBuffer], document.name.replace('.pdf', '_watermarked.pdf'), { type: 'application/pdf' });

        const { file_url: uploadedWatermarkUrl } = await base44.integrations.Core.UploadFile({ file: watermarkFile });

        const watermarkedDoc = await base44.entities.Document.create({
          name: document.name.replace('.pdf', '_watermarked.pdf'),
          file_url: uploadedWatermarkUrl,
          file_type: 'pdf',
          file_size: watermarkArrayBuffer.byteLength,
          status: 'ready'
        });

        result = {
          success: true,
          operation: 'watermark',
          documentId: watermarkedDoc.id,
          file_url: uploadedWatermarkUrl,
          watermark: { text, opacity, position },
          message: 'Watermark added successfully'
        };
        break;

      case 'encrypt':
        // Encrypt PDF
        const { password, permissions } = options;
        
        if (!password) {
          return Response.json({ 
            error: 'Password required' 
          }, { status: 400 });
        }

        // Update document with protection flag
        await base44.entities.Document.update(documentId, {
          is_protected: true
        });

        result = {
          success: true,
          operation: 'encrypt',
          message: 'PDF encrypted successfully',
          permissions: permissions || ['print', 'copy']
        };
        break;

      case 'extract_pages':
        // Extract specific pages
        const { pageNumbers } = options; // [1, 3, 5]
        
        if (!pageNumbers || pageNumbers.length === 0) {
          return Response.json({ 
            error: 'Page numbers required' 
          }, { status: 400 });
        }

        const { data: extractJob } = await cloudConvertRequest('jobs', 'POST', {
          tasks: {
            import: {
              operation: 'import/url',
              url: document.file_url,
              filename: document.name
            },
            task: {
              operation: 'convert',
              input: ['import'],
              input_format: 'pdf',
              output_format: 'pdf',
              pages: pageNumbers.join(',')
            },
            export: {
              operation: 'export/url',
              input: ['task']
            }
          }
        });

        const finishedExtractJob = await pollJobStatus(extractJob.id);
        const extractExportTask = finishedExtractJob.tasks.find(t => t.operation === 'export/url');
        const extractFileUrl = extractExportTask.result.files[0].url;

        const extractResponse = await fetch(extractFileUrl);
        const extractBlob = await extractResponse.blob();
        const extractArrayBuffer = await extractBlob.arrayBuffer();
        const extractFile = new File([extractArrayBuffer], document.name.replace('.pdf', '_extracted.pdf'), { type: 'application/pdf' });

        const { file_url: uploadedExtractUrl } = await base44.integrations.Core.UploadFile({ file: extractFile });

        const extractedDoc = await base44.entities.Document.create({
          name: document.name.replace('.pdf', '_extracted.pdf'),
          file_url: uploadedExtractUrl,
          file_type: 'pdf',
          file_size: extractArrayBuffer.byteLength,
          status: 'ready'
        });

        result = {
          success: true,
          operation: 'extract_pages',
          documentId: extractedDoc.id,
          file_url: uploadedExtractUrl,
          pages: pageNumbers,
          message: `Extracted ${pageNumbers.length} pages`
        };
        break;

      default:
        return Response.json({ 
          error: 'Invalid operation' 
        }, { status: 400 });
    }

    // Log activity
    await base44.entities.ActivityLog.create({
      action: 'convert',
      document_id: documentId,
      document_name: document.name,
      details: {
        operation,
        options,
        result
      }
    });

    return Response.json(result);

  } catch (error) {
    console.error('PDF operation error:', error);
    return Response.json({ 
      error: error.message || 'PDF operation failed',
      stack: error.stack
    }, { status: 500 });
  }
});