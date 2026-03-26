import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { documentId, deepAnalysisType } = await req.json();

    const document = await base44.entities.Document.get(documentId);
    if (!document) {
      return Response.json({ error: 'Document not found' }, { status: 404 });
    }

    let prompt = '';
    let schema = {};

    switch (deepAnalysisType) {
      case 'entity_extraction':
        prompt = `Perform deep entity extraction from this document. Identify and extract:
- People (names, roles, titles)
- Organizations (companies, institutions)
- Locations (addresses, cities, countries)
- Dates and times
- Financial information (amounts, currencies)
- Products and services mentioned
- Key events and milestones
- Contact information`;
        
        schema = {
          type: "object",
          properties: {
            people: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  role: { type: "string" },
                  context: { type: "string" }
                }
              }
            },
            organizations: { type: "array", items: { type: "string" } },
            locations: { type: "array", items: { type: "string" } },
            dates: { type: "array", items: { type: "string" } },
            financial_info: { type: "array", items: { type: "string" } },
            products: { type: "array", items: { type: "string" } },
            events: { type: "array", items: { type: "string" } },
            contacts: { type: "array", items: { type: "string" } }
          }
        };
        break;

      case 'relationship_mapping':
        prompt = `Analyze relationships and connections in this document:
- How different entities relate to each other
- Hierarchy and organizational structure
- Dependencies and workflows
- Timeline of events and interactions
- Cause-and-effect relationships`;
        
        schema = {
          type: "object",
          properties: {
            relationships: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  entity1: { type: "string" },
                  relationship_type: { type: "string" },
                  entity2: { type: "string" },
                  strength: { type: "string" }
                }
              }
            },
            hierarchy: { type: "object" },
            timeline: { type: "array", items: { type: "object" } }
          }
        };
        break;

      case 'intent_analysis':
        prompt = `Analyze the intent and purpose of this document:
- Primary objective
- Target audience
- Desired outcomes
- Action items and next steps
- Urgency and priority level
- Communication tone and style`;
        
        schema = {
          type: "object",
          properties: {
            primary_intent: { type: "string" },
            target_audience: { type: "string" },
            desired_outcomes: { type: "array", items: { type: "string" } },
            action_items: { type: "array", items: { type: "string" } },
            urgency: { type: "string" },
            tone: { type: "string" }
          }
        };
        break;

      case 'quality_metrics':
        prompt = `Provide detailed quality metrics for this document:
- Grammar and spelling accuracy
- Consistency in formatting and style
- Completeness of information
- Professional presentation score
- Technical accuracy
- Logical flow and structure`;
        
        schema = {
          type: "object",
          properties: {
            grammar_score: { type: "number" },
            consistency_score: { type: "number" },
            completeness_score: { type: "number" },
            presentation_score: { type: "number" },
            technical_accuracy: { type: "number" },
            flow_score: { type: "number" },
            issues: { type: "array", items: { type: "string" } },
            suggestions: { type: "array", items: { type: "string" } }
          }
        };
        break;

      case 'predictive_insights':
        prompt = `Generate predictive insights based on this document:
- Likely next actions
- Potential risks and challenges
- Opportunities for improvement
- Future implications
- Recommended follow-ups`;
        
        schema = {
          type: "object",
          properties: {
            next_actions: { type: "array", items: { type: "string" } },
            risks: { type: "array", items: { type: "string" } },
            opportunities: { type: "array", items: { type: "string" } },
            implications: { type: "array", items: { type: "string" } },
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
        type: 'deep_ai_analysis',
        analysis_type: deepAnalysisType
      }
    });

    return Response.json({
      success: true,
      analysis: response
    });

  } catch (error) {
    console.error('Deep AI analysis error:', error);
    return Response.json({ 
      error: error.message || 'Analysis failed' 
    }, { status: 500 });
  }
});