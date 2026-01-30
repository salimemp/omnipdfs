import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { documentId, settings } = await req.json();

    const document = await base44.entities.Document.get(documentId);
    if (!document) {
      return Response.json({ error: 'Document not found' }, { status: 404 });
    }

    const focusText = settings.focus?.length > 0 
      ? `Focus specifically on: ${settings.focus.join(', ')}`
      : '';

    const prompt = `Create a ${settings.style} summary of this document. 
Target length: approximately ${settings.length} words.
${focusText}
${settings.customInstructions ? `Additional instructions: ${settings.customInstructions}` : ''}
${settings.includeCitations ? 'Include page/section references where applicable.' : ''}

Provide the summary in a structured format with:
- Main summary text
- Key takeaways (3-5 points)
- Confidence score (0-100)
- Reading time estimate
${settings.focus?.includes('action_items') ? '- Actionable items list' : ''}
${settings.focus?.includes('dates') ? '- Important dates timeline' : ''}`;

    const response = await base44.integrations.Core.InvokeLLM({
      prompt,
      add_context_from_internet: false,
      file_urls: [document.file_url],
      response_json_schema: {
        type: "object",
        properties: {
          summary: { type: "string" },
          key_takeaways: { type: "array", items: { type: "string" } },
          confidence_score: { type: "number" },
          reading_time: { type: "string" },
          word_count: { type: "number" },
          action_items: { type: "array", items: { type: "string" } },
          important_dates: { type: "array", items: { 
            type: "object",
            properties: {
              date: { type: "string" },
              description: { type: "string" }
            }
          }}
        }
      }
    });

    await base44.entities.ActivityLog.create({
      action: 'convert',
      document_id: documentId,
      document_name: document.name,
      details: { 
        type: 'advanced_summary',
        style: settings.style,
        length: settings.length,
        focus: settings.focus
      }
    });

    return Response.json({
      success: true,
      summary: response
    });

  } catch (error) {
    console.error('Summarization error:', error);
    return Response.json({ 
      error: error.message || 'Summarization failed' 
    }, { status: 500 });
  }
});