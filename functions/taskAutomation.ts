import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, data } = await req.json();

    if (action === 'create_task') {
      const { taskType, trigger, actions, schedule } = data;

      const taskConfig = {
        type: taskType,
        trigger,
        actions,
        schedule,
        created_by: user.email,
        status: 'active'
      };

      await base44.entities.ActivityLog.create({
        action: 'convert',
        details: {
          type: 'ai_task_created',
          task_type: taskType,
          trigger
        }
      });

      return Response.json({ success: true, task: taskConfig });
    }

    if (action === 'execute_task') {
      const { taskId, documentId } = data;
      const document = documentId ? await base44.entities.Document.get(documentId) : null;

      const executionResults = [];

      for (const taskAction of data.actions) {
        try {
          let result;

          switch (taskAction.type) {
            case 'ai_summarize':
              result = await base44.functions.invoke('advancedSummarize', {
                documentId,
                options: taskAction.params
              });
              break;

            case 'convert_format':
              result = await base44.functions.invoke('convertFile', {
                documentId,
                targetFormat: taskAction.params.format,
                options: taskAction.params.options
              });
              break;

            case 'extract_data':
              result = await base44.functions.invoke('ocrProcess', {
                documentId,
                options: taskAction.params
              });
              break;

            case 'send_notification':
              await base44.integrations.Core.SendEmail({
                to: taskAction.params.recipient || user.email,
                subject: taskAction.params.subject,
                body: taskAction.params.body
              });
              result = { sent: true };
              break;

            case 'tag_document':
              if (document) {
                await base44.entities.Document.update(documentId, {
                  tags: [...(document.tags || []), ...taskAction.params.tags]
                });
                result = { tagged: true };
              }
              break;

            case 'share_document':
              result = await base44.functions.invoke('shareDocument', {
                documentId,
                action: 'add_user',
                data: taskAction.params
              });
              break;

            case 'ai_analysis':
              result = await base44.functions.invoke('deepAIAnalysis', {
                documentId,
                deepAnalysisType: taskAction.params.analysisType
              });
              break;
          }

          executionResults.push({
            action: taskAction.type,
            status: 'completed',
            result
          });
        } catch (error) {
          executionResults.push({
            action: taskAction.type,
            status: 'failed',
            error: error.message
          });
        }
      }

      await base44.entities.ActivityLog.create({
        action: 'convert',
        document_id: documentId,
        details: {
          type: 'ai_task_executed',
          task_id: taskId,
          results: executionResults
        }
      });

      return Response.json({ success: true, results: executionResults });
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('Task automation error:', error);
    return Response.json({ 
      error: error.message || 'Task automation failed' 
    }, { status: 500 });
  }
});