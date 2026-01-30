import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { task, input, options } = await req.json();

    let prompt = '';
    let fileUrls = [];
    let schema = {};

    switch (task) {
      case 'summarize':
        prompt = `Summarize this document: ${input.text || ''}`;
        fileUrls = input.fileUrl ? [input.fileUrl] : [];
        schema = {
          type: "object",
          properties: {
            summary: { type: "string" },
            key_points: { type: "array", items: { type: "string" } }
          }
        };
        break;

      case 'translate':
        prompt = `Translate this text to ${input.targetLanguage}: ${input.text}`;
        fileUrls = input.fileUrl ? [input.fileUrl] : [];
        schema = {
          type: "object",
          properties: {
            translated_text: { type: "string" },
            source_language: { type: "string" },
            confidence: { type: "number" }
          }
        };
        break;

      case 'tag':
        prompt = `Analyze this content and suggest relevant tags/categories: ${input.text || ''}`;
        fileUrls = input.fileUrl ? [input.fileUrl] : [];
        schema = {
          type: "object",
          properties: {
            tags: { type: "array", items: { type: "string" } },
            categories: { type: "array", items: { type: "string" } }
          }
        };
        break;

      case 'suggestions':
        prompt = `Provide actionable suggestions to improve this document: ${input.text || ''}`;
        fileUrls = input.fileUrl ? [input.fileUrl] : [];
        schema = {
          type: "object",
          properties: {
            suggestions: { 
              type: "array", 
              items: {
                type: "object",
                properties: {
                  type: { type: "string" },
                  suggestion: { type: "string" },
                  priority: { type: "string" }
                }
              }
            }
          }
        };
        break;

      case 'chat':
        prompt = input.message;
        fileUrls = input.context?.fileUrls || [];
        schema = {
          type: "object",
          properties: {
            response: { type: "string" },
            suggestions: { type: "array", items: { type: "string" } }
          }
        };
        break;

      default:
        return Response.json({ error: 'Invalid task' }, { status: 400 });
    }

    const response = await base44.integrations.Core.InvokeLLM({
      prompt,
      file_urls: fileUrls,
      add_context_from_internet: options?.useInternet || false,
      response_json_schema: schema
    });

    await base44.entities.ActivityLog.create({
      action: 'convert',
      details: { 
        type: 'ai_assistant',
        task: task
      }
    });

    return Response.json({
      success: true,
      result: response
    });

  } catch (error) {
    console.error('AI assistant error:', error);
    return Response.json({ 
      error: error.message || 'AI processing failed' 
    }, { status: 500 });
  }
});