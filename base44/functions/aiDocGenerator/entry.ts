import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { type, prompt, options } = await req.json();

    const systemPrompt = `Generate a professional ${type} document based on the user's requirements. 
Include all necessary sections, proper formatting, and professional language.
${options?.tone ? `Tone: ${options.tone}` : ''}
${options?.length ? `Length: ${options.length} pages` : ''}
${options?.includeImages ? 'Include image placeholders where appropriate.' : ''}`;

    const response = await base44.integrations.Core.InvokeLLM({
      prompt: `${systemPrompt}\n\nUser requirements: ${prompt}`,
      add_context_from_internet: options?.research || false,
      response_json_schema: {
        type: "object",
        properties: {
          title: { type: "string" },
          content: { type: "string" },
          sections: { 
            type: "array", 
            items: {
              type: "object",
              properties: {
                heading: { type: "string" },
                content: { type: "string" }
              }
            }
          },
          metadata: {
            type: "object",
            properties: {
              word_count: { type: "number" },
              page_estimate: { type: "number" },
              reading_time: { type: "string" }
            }
          }
        }
      }
    });

    await base44.entities.ActivityLog.create({
      action: 'convert',
      document_name: response.title,
      details: { 
        type: 'ai_document_generated',
        document_type: type,
        word_count: response.metadata.word_count
      }
    });

    return Response.json({
      success: true,
      document: response
    });

  } catch (error) {
    console.error('AI document generator error:', error);
    return Response.json({ 
      error: error.message || 'Document generation failed' 
    }, { status: 500 });
  }
});