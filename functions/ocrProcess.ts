import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { documentId, options } = await req.json();

    const document = await base44.entities.Document.get(documentId);
    if (!document) {
      return Response.json({ error: 'Document not found' }, { status: 404 });
    }

    const job = await base44.entities.OCRJob.create({
      document_id: documentId,
      source_url: document.file_url,
      status: 'processing',
      language: options.language || 'en',
      options: options
    });

    const prompt = `Extract all text from this document with high accuracy. 
Language: ${options.language}
${options.preserve_layout ? 'Preserve the original layout and formatting.' : ''}
${options.detect_tables ? 'Identify and structure any tables found.' : ''}
${options.detect_handwriting ? 'Include handwritten text if present.' : ''}

Return the extracted text with confidence score.`;

    const response = await base44.integrations.Core.InvokeLLM({
      prompt,
      file_urls: [document.file_url],
      response_json_schema: {
        type: "object",
        properties: {
          text: { type: "string" },
          confidence: { type: "number" },
          page_count: { type: "number" },
          tables: { type: "array", items: { type: "object" } },
          handwriting_detected: { type: "boolean" }
        }
      }
    });

    await base44.entities.OCRJob.update(job.id, {
      status: 'completed',
      extracted_text: response.text,
      confidence_score: response.confidence,
      page_count: response.page_count,
      processing_time: 3500
    });

    await base44.entities.ActivityLog.create({
      action: 'convert',
      document_id: documentId,
      document_name: document.name,
      details: { 
        type: 'ocr_completed',
        confidence: response.confidence,
        pages: response.page_count
      }
    });

    return Response.json({
      success: true,
      extracted_text: response.text,
      confidence: response.confidence,
      page_count: response.page_count,
      tables: response.tables,
      handwriting_detected: response.handwriting_detected
    });

  } catch (error) {
    console.error('OCR error:', error);
    return Response.json({ 
      error: error.message || 'OCR processing failed' 
    }, { status: 500 });
  }
});