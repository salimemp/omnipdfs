import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { document1Id, document2Id, mode = 'comprehensive' } = await req.json();

    if (!document1Id || !document2Id) {
      return Response.json({ error: 'Both documents required' }, { status: 400 });
    }

    // Fetch documents
    const [doc1, doc2] = await Promise.all([
      base44.entities.Document.get(document1Id),
      base44.entities.Document.get(document2Id)
    ]);

    // Build comparison prompt based on mode
    const prompts = {
      comprehensive: `Compare these two documents comprehensively:

Document 1: ${doc1.name}
Document 2: ${doc2.name}

Analyze:
1. Similarity percentage
2. Additions in Document 2
3. Deletions from Document 1
4. Modifications between versions
5. Key insights and recommendations

Provide detailed analysis.`,

      quick: `Quick comparison of documents:
Document 1: ${doc1.name}
Document 2: ${doc2.name}

Provide: similarity score, top 3 differences, brief summary.`,

      semantic: `Semantic comparison of these documents focusing on meaning and intent rather than exact wording:
Document 1: ${doc1.name}
Document 2: ${doc2.name}

Analyze conceptual changes and semantic shifts.`,

      structural: `Structural comparison focusing on format, layout, and organization:
Document 1: ${doc1.name}
Document 2: ${doc2.name}

Analyze structural differences and formatting changes.`
    };

    const prompt = prompts[mode] || prompts.comprehensive;

    const response = await base44.integrations.Core.InvokeLLM({
      prompt,
      file_urls: [doc1.file_url, doc2.file_url],
      response_json_schema: {
        type: "object",
        properties: {
          similarity_score: { type: "number" },
          summary: { type: "string" },
          additions: { type: "array", items: { type: "string" } },
          deletions: { type: "array", items: { type: "string" } },
          modifications: { type: "array", items: { type: "string" } },
          insights: { type: "array", items: { type: "string" } },
          recommendations: { type: "array", items: { type: "string" } }
        }
      }
    });

    // Log comparison activity
    await base44.entities.ActivityLog.create({
      action: 'convert',
      document_id: document1Id,
      document_name: `${doc1.name} vs ${doc2.name}`,
      details: {
        type: 'document_comparison',
        mode,
        similarity: response.similarity_score,
        compared_with: document2Id
      }
    });

    return Response.json({
      success: true,
      ...response
    });

  } catch (error) {
    console.error('Document comparison error:', error);
    return Response.json({ 
      error: error.message || 'Comparison failed' 
    }, { status: 500 });
  }
});