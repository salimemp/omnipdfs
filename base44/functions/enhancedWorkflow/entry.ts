import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, data } = await req.json();

    if (action === 'execute_advanced') {
      const { documentId, workflow } = data;
      const document = await base44.entities.Document.get(documentId);
      
      const executionLog = [];
      let currentData = { document, context: {} };

      for (const step of workflow.steps) {
        const stepStart = Date.now();
        let stepResult = { step: step.name, status: 'processing' };

        try {
          switch (step.type) {
            case 'ai_analysis':
              const analysisResult = await base44.functions.invoke('aiDocumentAnalysis', {
                documentId,
                analysisType: step.params.analysisType || 'comprehensive',
                options: step.params.options
              });
              stepResult.output = analysisResult.data.analysis;
              currentData.context.analysis = analysisResult.data.analysis;
              break;

            case 'conversion':
              const conversionResult = await base44.functions.invoke('convertFile', {
                documentId,
                targetFormat: step.params.targetFormat,
                options: step.params.conversionOptions
              });
              stepResult.output = conversionResult.data;
              currentData.context.converted = conversionResult.data;
              break;

            case 'ocr':
              const ocrResult = await base44.functions.invoke('ocrProcess', {
                documentId,
                options: step.params.ocrOptions || {}
              });
              stepResult.output = ocrResult.data;
              currentData.context.extracted_text = ocrResult.data.extracted_text;
              break;

            case 'collaboration':
              if (step.params.action === 'share') {
                await base44.functions.invoke('shareDocument', {
                  documentId,
                  action: 'add_user',
                  data: step.params.shareData
                });
              } else if (step.params.action === 'comment') {
                await base44.functions.invoke('collaborationManager', {
                  documentId,
                  action: 'add_comment',
                  data: step.params.commentData
                });
              }
              stepResult.output = { success: true };
              break;

            case 'notification':
              await base44.integrations.Core.SendEmail({
                to: step.params.recipient || user.email,
                subject: step.params.subject || `Workflow Update: ${document.name}`,
                body: step.params.body || `Step "${step.name}" completed successfully.`
              });
              stepResult.output = { sent: true };
              break;

            case 'conditional':
              const condition = eval(step.params.condition);
              if (condition) {
                stepResult.output = { branch: 'true', executed: true };
              } else {
                stepResult.output = { branch: 'false', skipped: true };
              }
              break;

            case 'cloud_sync':
              await base44.functions.invoke('cloudFilePicker', {
                provider: step.params.provider,
                action: 'upload',
                data: { fileUrl: document.file_url, fileName: document.name }
              });
              stepResult.output = { synced: true };
              break;
          }

          stepResult.status = 'completed';
          stepResult.duration = Date.now() - stepStart;
        } catch (error) {
          stepResult.status = 'failed';
          stepResult.error = error.message;
          stepResult.duration = Date.now() - stepStart;
        }

        executionLog.push(stepResult);
      }

      await base44.entities.ActivityLog.create({
        action: 'convert',
        document_id: documentId,
        document_name: document.name,
        details: {
          type: 'advanced_workflow',
          workflow_name: workflow.name,
          steps_executed: executionLog.length,
          execution_log: executionLog
        }
      });

      return Response.json({ success: true, executionLog });
    }

    if (action === 'schedule_workflow') {
      const { workflow, schedule } = data;
      
      await base44.entities.ActivityLog.create({
        action: 'convert',
        details: {
          type: 'workflow_scheduled',
          workflow_name: workflow.name,
          schedule: schedule
        }
      });

      return Response.json({ success: true, message: 'Workflow scheduled' });
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('Enhanced workflow error:', error);
    return Response.json({ 
      error: error.message || 'Workflow execution failed' 
    }, { status: 500 });
  }
});