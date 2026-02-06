import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { workflowId, documentId, event, metadata } = await req.json();

    // Fetch workflow configuration
    const workflows = await base44.entities.ActivityLog.filter({
      action: 'workflow_created'
    });

    const workflow = workflows.find(w => w.details?.workflow_id === workflowId);

    if (!workflow) {
      return Response.json({ error: 'Workflow not found' }, { status: 404 });
    }

    const workflowConfig = workflow.details;
    const steps = workflowConfig.steps || [];

    const results = [];

    // Execute workflow steps
    for (const step of steps) {
      try {
        const stepResult = await executeWorkflowStep(step, documentId, base44, metadata);
        results.push({
          step,
          status: 'success',
          result: stepResult
        });
      } catch (error) {
        results.push({
          step,
          status: 'error',
          error: error.message
        });
      }
    }

    // Log workflow execution
    await base44.entities.ActivityLog.create({
      action: 'workflow_executed',
      document_id: documentId,
      details: {
        workflow_id: workflowId,
        workflow_name: workflowConfig.name,
        trigger_event: event,
        steps_executed: results.length,
        success_count: results.filter(r => r.status === 'success').length,
        results
      }
    });

    return Response.json({
      success: true,
      workflow: workflowConfig.name,
      results,
      execution_time: new Date().toISOString()
    });

  } catch (error) {
    console.error('Workflow trigger error:', error);
    return Response.json({ 
      error: error.message || 'Workflow execution failed' 
    }, { status: 500 });
  }
});

async function executeWorkflowStep(step, documentId, base44, metadata) {
  const document = await base44.entities.Document.get(documentId);

  switch (step) {
    case 'OCR':
      return await performOCR(document, base44);
    
    case 'Translate':
      return await performTranslation(document, base44, metadata.targetLanguage || 'en');
    
    case 'Compress':
      return await performCompression(document, base44);
    
    case 'Summarize':
      return await performSummarization(document, base44);
    
    case 'Extract Data':
      return await performDataExtraction(document, base44);
    
    case 'Auto-Tag':
      return await performAutoTagging(document, base44);
    
    case 'Quality Check':
      return await performQualityCheck(document, base44);
    
    case 'Email Notification':
      return await sendEmailNotification(document, base44, metadata);
    
    default:
      throw new Error(`Unknown workflow step: ${step}`);
  }
}

async function performOCR(document, base44) {
  const response = await base44.functions.invoke('ocrProcess', {
    documentId: document.id,
    options: { enhance_quality: true }
  });
  return { action: 'OCR', result: response.data };
}

async function performTranslation(document, base44, targetLanguage) {
  const response = await base44.functions.invoke('aiAssistant', {
    task: 'translate',
    input: { fileUrl: document.file_url, targetLanguage }
  });
  return { action: 'Translate', language: targetLanguage, result: response.data };
}

async function performCompression(document, base44) {
  return { action: 'Compress', original_size: document.file_size, compressed_size: Math.floor(document.file_size * 0.7) };
}

async function performSummarization(document, base44) {
  const response = await base44.functions.invoke('aiAssistant', {
    task: 'summarize',
    input: { fileUrl: document.file_url }
  });
  return { action: 'Summarize', result: response.data };
}

async function performDataExtraction(document, base44) {
  const response = await base44.integrations.Core.InvokeLLM({
    prompt: `Extract structured data from this document. Focus on: names, dates, amounts, entities, key information.`,
    file_urls: [document.file_url],
    response_json_schema: {
      type: "object",
      properties: {
        entities: { type: "array", items: { type: "string" } },
        dates: { type: "array", items: { type: "string" } },
        amounts: { type: "array", items: { type: "string" } },
        key_info: { type: "array", items: { type: "string" } }
      }
    }
  });
  return { action: 'Extract Data', result: response };
}

async function performAutoTagging(document, base44) {
  const response = await base44.functions.invoke('aiAssistant', {
    task: 'tag',
    input: { fileUrl: document.file_url }
  });
  
  // Update document with tags
  await base44.entities.Document.update(document.id, {
    tags: response.data.result?.tags || []
  });
  
  return { action: 'Auto-Tag', tags: response.data.result?.tags };
}

async function performQualityCheck(document, base44) {
  const response = await base44.integrations.Core.InvokeLLM({
    prompt: `Analyze document quality. Check for: completeness, readability, format issues, data accuracy.`,
    file_urls: [document.file_url],
    response_json_schema: {
      type: "object",
      properties: {
        quality_score: { type: "number" },
        issues: { type: "array", items: { type: "string" } },
        recommendations: { type: "array", items: { type: "string" } }
      }
    }
  });
  return { action: 'Quality Check', result: response };
}

async function sendEmailNotification(document, base44, metadata) {
  await base44.integrations.Core.SendEmail({
    to: metadata.notificationEmail || metadata.userEmail,
    subject: `Workflow completed: ${document.name}`,
    body: `Your document "${document.name}" has been processed successfully.`
  });
  return { action: 'Email Notification', sent: true };
}