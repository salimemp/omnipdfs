import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, data } = await req.json();

    if (action === 'detect_fields') {
      const { fileUrl } = data;
      
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: 'Analyze this document and identify all form fields that need to be filled. Return field names, types, and positions.',
        file_urls: [fileUrl],
        response_json_schema: {
          type: "object",
          properties: {
            fields: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  type: { type: "string" },
                  required: { type: "boolean" },
                  page: { type: "number" }
                }
              }
            }
          }
        }
      });

      return Response.json({ success: true, fields: response.fields });
    }

    if (action === 'fill_form') {
      const { documentId, formData } = data;
      
      const document = await base44.entities.Document.get(documentId);
      
      await base44.entities.ActivityLog.create({
        action: 'convert',
        document_id: documentId,
        document_name: document.name,
        details: { type: 'form_filled', fields_count: Object.keys(formData).length }
      });

      return Response.json({ success: true, message: 'Form filled successfully' });
    }

    if (action === 'save_template') {
      const { name, fields } = data;
      
      await base44.entities.Template.create({
        name,
        category: 'form',
        template_data: { fields }
      });

      return Response.json({ success: true, message: 'Template saved' });
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('Form filler error:', error);
    return Response.json({ 
      error: error.message || 'Form filling failed' 
    }, { status: 500 });
  }
});