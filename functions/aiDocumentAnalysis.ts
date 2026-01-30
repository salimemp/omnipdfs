import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { documentId, analysisType, options } = await req.json();

    const document = await base44.entities.Document.get(documentId);
    if (!document) {
      return Response.json({ error: 'Document not found' }, { status: 404 });
    }

    let prompt = '';
    let schema = {};

    switch (analysisType) {
      case 'comprehensive':
        prompt = `Perform a comprehensive analysis of this document. Analyze:
- Document structure and organization
- Content quality and clarity
- Readability score
- Key themes and topics
- Sentiment analysis
- Compliance checks (GDPR, accessibility)
- Security concerns
- Recommendations for improvement`;
        
        schema = {
          type: "object",
          properties: {
            overall_score: { type: "number" },
            readability: { 
              type: "object",
              properties: {
                score: { type: "number" },
                grade_level: { type: "string" },
                avg_sentence_length: { type: "number" }
              }
            },
            structure: {
              type: "object",
              properties: {
                sections: { type: "number" },
                organization_score: { type: "number" },
                issues: { type: "array", items: { type: "string" } }
              }
            },
            content_quality: {
              type: "object",
              properties: {
                clarity_score: { type: "number" },
                completeness_score: { type: "number" },
                strengths: { type: "array", items: { type: "string" } },
                weaknesses: { type: "array", items: { type: "string" } }
              }
            },
            sentiment: {
              type: "object",
              properties: {
                overall: { type: "string" },
                confidence: { type: "number" }
              }
            },
            compliance: {
              type: "object",
              properties: {
                gdpr_compliant: { type: "boolean" },
                accessibility_score: { type: "number" },
                issues: { type: "array", items: { type: "string" } }
              }
            },
            recommendations: { type: "array", items: { type: "string" } }
          }
        };
        break;

      case 'sentiment':
        prompt = 'Analyze the sentiment and tone of this document.';
        schema = {
          type: "object",
          properties: {
            overall_sentiment: { type: "string" },
            confidence: { type: "number" },
            positive_aspects: { type: "array", items: { type: "string" } },
            negative_aspects: { type: "array", items: { type: "string" } },
            tone: { type: "string" }
          }
        };
        break;

      case 'readability':
        prompt = 'Analyze the readability and complexity of this document.';
        schema = {
          type: "object",
          properties: {
            readability_score: { type: "number" },
            grade_level: { type: "string" },
            avg_sentence_length: { type: "number" },
            avg_word_length: { type: "number" },
            complex_words: { type: "number" },
            suggestions: { type: "array", items: { type: "string" } }
          }
        };
        break;

      case 'security':
        prompt = 'Analyze this document for security and privacy concerns.';
        schema = {
          type: "object",
          properties: {
            risk_level: { type: "string" },
            pii_detected: { type: "boolean" },
            sensitive_data: { type: "array", items: { type: "string" } },
            security_recommendations: { type: "array", items: { type: "string" } }
          }
        };
        break;

      case 'compliance':
        prompt = `Check this document for compliance with: ${options?.standards?.join(', ') || 'GDPR, HIPAA, SOC2'}`;
        schema = {
          type: "object",
          properties: {
            compliant: { type: "boolean" },
            standards_checked: { type: "array", items: { type: "string" } },
            issues: { type: "array", items: { type: "string" } },
            recommendations: { type: "array", items: { type: "string" } }
          }
        };
        break;

      default:
        return Response.json({ error: 'Invalid analysis type' }, { status: 400 });
    }

    const response = await base44.integrations.Core.InvokeLLM({
      prompt,
      file_urls: [document.file_url],
      add_context_from_internet: false,
      response_json_schema: schema
    });

    await base44.entities.ActivityLog.create({
      action: 'convert',
      document_id: documentId,
      document_name: document.name,
      details: { 
        type: 'ai_analysis',
        analysis_type: analysisType
      }
    });

    return Response.json({
      success: true,
      analysis: response
    });

  } catch (error) {
    console.error('AI document analysis error:', error);
    return Response.json({ 
      error: error.message || 'Analysis failed' 
    }, { status: 500 });
  }
});