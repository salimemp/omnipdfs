import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { documentType, specifications, style } = await req.json();

    let prompt = '';
    
    switch (documentType) {
      case 'business_proposal':
        prompt = `Generate a professional business proposal with the following specifications:
${JSON.stringify(specifications, null, 2)}

Style: ${style || 'professional'}

Include:
- Executive Summary
- Problem Statement
- Proposed Solution
- Implementation Timeline
- Budget Overview
- Expected Outcomes
- Call to Action

Format as a well-structured document ready for presentation.`;
        break;

      case 'contract':
        prompt = `Generate a legal contract document with these details:
${JSON.stringify(specifications, null, 2)}

Style: ${style || 'formal legal'}

Include standard contract sections:
- Parties Involved
- Terms and Conditions
- Payment Terms
- Duration
- Termination Clauses
- Signatures Section

Use proper legal language and formatting.`;
        break;

      case 'report':
        prompt = `Create a comprehensive report based on:
${JSON.stringify(specifications, null, 2)}

Style: ${style || 'analytical'}

Structure:
- Executive Summary
- Introduction
- Methodology
- Findings
- Analysis
- Recommendations
- Conclusion

Include data visualizations descriptions where relevant.`;
        break;

      case 'marketing_content':
        prompt = `Generate engaging marketing content:
${JSON.stringify(specifications, null, 2)}

Style: ${style || 'persuasive'}

Create:
- Headline
- Body Copy
- Key Benefits
- Call to Action
- Social Media Snippets

Make it compelling and audience-focused.`;
        break;

      default:
        prompt = `Generate a ${documentType} document based on:
${JSON.stringify(specifications, null, 2)}

Style: ${style || 'professional'}

Create a well-structured, comprehensive document.`;
    }

    const response = await base44.integrations.Core.InvokeLLM({
      prompt,
      add_context_from_internet: specifications.researchRequired || false
    });

    const documentContent = response;

    const document = await base44.entities.Document.create({
      name: specifications.title || `${documentType}_${Date.now()}`,
      file_type: 'txt',
      status: 'ready',
      tags: ['ai_generated', documentType]
    });

    await base44.entities.ActivityLog.create({
      action: 'upload',
      document_id: document.id,
      document_name: document.name,
      details: {
        type: 'ai_document_generation',
        document_type: documentType
      }
    });

    return Response.json({
      success: true,
      document,
      content: documentContent
    });

  } catch (error) {
    console.error('Document generation error:', error);
    return Response.json({ 
      error: error.message || 'Generation failed' 
    }, { status: 500 });
  }
});