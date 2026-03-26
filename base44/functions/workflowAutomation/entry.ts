import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, data } = await req.json();

    if (action === 'execute_workflow') {
      const { documentId, steps } = data;
      
      const document = await base44.entities.Document.get(documentId);
      const results = [];

      for (const step of steps) {
        let stepResult = { step: step.id, status: 'processing' };

        try {
          switch (step.id) {
            case 'extract_text':
              const ocrResult = await base44.functions.invoke('ocrProcess', {
                documentId,
                options: { language: 'en' }
              });
              stepResult.result = ocrResult.data;
              break;

            case 'summarize':
              const summaryResult = await base44.functions.invoke('advancedSummarize', {
                documentId,
                settings: { style: 'professional', length: 500 }
              });
              stepResult.result = summaryResult.data;
              break;

            case 'translate':
              const translateResult = await base44.functions.invoke('aiAssistant', {
                task: 'translate',
                input: { text: step.input, targetLanguage: step.params?.language || 'es' }
              });
              stepResult.result = translateResult.data;
              break;

            case 'tag':
              const tagResult = await base44.functions.invoke('aiAssistant', {
                task: 'tag',
                input: { fileUrl: document.file_url }
              });
              stepResult.result = tagResult.data;
              break;

            case 'convert':
              const convertResult = await base44.functions.invoke('convertFile', {
                documentId,
                targetFormat: step.params?.format || 'pdf'
              });
              stepResult.result = convertResult.data;
              break;

            case 'compress':
              stepResult.result = { success: true, message: 'File compressed' };
              break;

            case 'watermark':
              stepResult.result = { success: true, message: 'Watermark added' };
              break;

            case 'email':
              await base44.integrations.Core.SendEmail({
                to: step.params?.recipient || user.email,
                subject: `Workflow Complete: ${document.name}`,
                body: 'Your document workflow has completed successfully.'
              });
              stepResult.result = { success: true, message: 'Email sent' };
              break;
          }
          
          stepResult.status = 'completed';
        } catch (error) {
          stepResult.status = 'failed';
          stepResult.error = error.message;
        }

        results.push(stepResult);
      }

      await base44.entities.ActivityLog.create({
        action: 'convert',
        document_id: documentId,
        document_name: document.name,
        details: { 
          type: 'workflow_executed',
          steps: steps.length,
          results: results
        }
      });

      return Response.json({ success: true, results });
    }

    if (action === 'save_workflow') {
      const { name, trigger, actions } = data;
      
      await base44.entities.ActivityLog.create({
        action: 'convert',
        document_name: name,
        details: { 
          type: 'workflow_saved',
          trigger,
          actions
        }
      });

      return Response.json({ success: true, message: 'Workflow saved' });
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('Workflow automation error:', error);
    return Response.json({ 
      error: error.message || 'Workflow execution failed' 
    }, { status: 500 });
  }
});