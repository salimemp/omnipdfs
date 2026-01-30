import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, data } = await req.json();

    if (action === 'generate') {
      const { templateId, values } = data;
      
      const template = await base44.entities.Template.get(templateId);
      if (!template) {
        return Response.json({ error: 'Template not found' }, { status: 404 });
      }

      await base44.entities.Template.update(templateId, {
        usage_count: (template.usage_count || 0) + 1
      });

      await base44.entities.ActivityLog.create({
        action: 'convert',
        document_id: templateId,
        document_name: template.name,
        details: { type: 'template_generated', template_id: templateId }
      });

      return Response.json({ 
        success: true, 
        message: 'Document generated from template',
        template: template
      });
    }

    if (action === 'analyze') {
      const { templateId } = data;
      
      const template = await base44.entities.Template.get(templateId);
      
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze this template and provide insights about its structure, suggested improvements, and usage recommendations.`,
        response_json_schema: {
          type: "object",
          properties: {
            complexity: { type: "string" },
            suggestions: { type: "array", items: { type: "string" } },
            field_count: { type: "number" },
            estimated_time: { type: "string" }
          }
        }
      });

      return Response.json({ success: true, analysis: response });
    }

    if (action === 'create') {
      const { name, category, template_data } = data;
      
      const template = await base44.entities.Template.create({
        name,
        category,
        template_data,
        is_public: false,
        usage_count: 0
      });

      return Response.json({ success: true, template });
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('Template manager error:', error);
    return Response.json({ 
      error: error.message || 'Template operation failed' 
    }, { status: 500 });
  }
});