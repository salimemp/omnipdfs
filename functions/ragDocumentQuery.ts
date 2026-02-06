import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { query, documents, mode, extractionType, customSchema } = await req.json();

    if (!documents || documents.length === 0) {
      return Response.json({ error: 'No documents provided' }, { status: 400 });
    }

    // Fetch document contents
    const documentContents = await Promise.all(
      documents.map(async (doc) => {
        try {
          const response = await fetch(doc.file_url);
          const text = await response.text();
          return { id: doc.id, name: doc.name, content: text };
        } catch (e) {
          return { id: doc.id, name: doc.name, content: null, error: e.message };
        }
      })
    );

    const validDocs = documentContents.filter(d => d.content);

    if (validDocs.length === 0) {
      return Response.json({ error: 'No valid document contents' }, { status: 400 });
    }

    // Build context for RAG
    const context = validDocs.map(d => `Document: ${d.name}\n${d.content}`).join('\n\n---\n\n');

    let prompt = '';
    let schema = {};

    switch (mode) {
      case 'semantic':
        prompt = `Given these documents:
${context}

Search semantically for: "${query}"

Rank results by relevance and provide context.`;
        schema = {
          type: "object",
          properties: {
            results: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  passage: { type: "string" },
                  relevance_score: { type: "number" },
                  document_reference: { type: "string" },
                  context: { type: "string" }
                }
              }
            },
            total_matches: { type: "number" }
          }
        };
        break;

      case 'extract':
        prompt = `Extract ${extractionType} from these documents:
${context}

Be comprehensive and accurate. Include confidence scores.`;
        schema = {
          type: "object",
          properties: {
            extracted_data: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  type: { type: "string" },
                  value: { type: "string" },
                  confidence: { type: "number" },
                  context: { type: "string" },
                  source_document: { type: "string" }
                }
              }
            },
            summary: { type: "string" },
            data_quality_score: { type: "number" }
          }
        };
        break;

      case 'analyze':
        prompt = `Perform comprehensive analysis of these documents:
${context}

Analyze:
1. Document types and structure
2. Main topics and themes
3. Key entities and relationships
4. Data quality and completeness
5. Actionable insights and recommendations`;
        schema = {
          type: "object",
          properties: {
            document_type: { type: "string" },
            structure_analysis: { type: "string" },
            main_topics: { type: "array", items: { type: "string" } },
            key_entities: { type: "array", items: { type: "string" } },
            relationships: { type: "array", items: { type: "string" } },
            data_completeness: { type: "number" },
            insights: { type: "array", items: { type: "string" } },
            recommendations: { type: "array", items: { type: "string" } }
          }
        };
        break;

      case 'keyword':
        prompt = `Find exact keyword matches for "${query}" in these documents:
${context}

Provide locations, contexts, and frequency analysis.`;
        schema = {
          type: "object",
          properties: {
            matches: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  keyword: { type: "string" },
                  occurrences: { type: "number" },
                  locations: { type: "array", items: { type: "string" } },
                  contexts: { type: "array", items: { type: "string" } }
                }
              }
            }
          }
        };
        break;

      default:
        return Response.json({ error: 'Invalid mode' }, { status: 400 });
    }

    // If custom schema provided, use it
    if (customSchema) {
      schema = customSchema;
    }

    const response = await base44.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: schema
    });

    // Log activity
    await base44.entities.ActivityLog.create({
      action: 'convert',
      details: {
        type: 'rag_query',
        mode,
        documents_count: validDocs.length,
        query
      }
    });

    return Response.json({
      success: true,
      result: response,
      documents_processed: validDocs.length
    });

  } catch (error) {
    console.error('RAG query error:', error);
    return Response.json({ 
      error: error.message || 'RAG query failed' 
    }, { status: 500 });
  }
});