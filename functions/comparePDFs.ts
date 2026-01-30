import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { document1Id, document2Id, options } = await req.json();

    const doc1 = await base44.entities.Document.get(document1Id);
    const doc2 = await base44.entities.Document.get(document2Id);

    if (!doc1 || !doc2) {
      return Response.json({ error: 'Documents not found' }, { status: 404 });
    }

    const prompt = `Compare these two documents and identify all differences:
Document 1: ${doc1.name}
Document 2: ${doc2.name}

${options?.compareMode === 'visual' ? 'Focus on visual differences in layout and formatting.' : ''}
${options?.compareMode === 'text' ? 'Focus on text content differences only.' : ''}
${options?.compareMode === 'semantic' ? 'Focus on semantic and meaning differences.' : ''}

Provide a detailed comparison with:
- Summary of changes
- Added content
- Removed content  
- Modified sections
- Similarity score`;

    const response = await base44.integrations.Core.InvokeLLM({
      prompt,
      file_urls: [doc1.file_url, doc2.file_url],
      response_json_schema: {
        type: "object",
        properties: {
          summary: { type: "string" },
          similarity_score: { type: "number" },
          added: { type: "array", items: { type: "string" } },
          removed: { type: "array", items: { type: "string" } },
          modified: { type: "array", items: { type: "string" } },
          statistics: {
            type: "object",
            properties: {
              total_changes: { type: "number" },
              additions: { type: "number" },
              deletions: { type: "number" },
              modifications: { type: "number" }
            }
          }
        }
      }
    });

    await base44.entities.ActivityLog.create({
      action: 'convert',
      document_name: `${doc1.name} vs ${doc2.name}`,
      details: { 
        type: 'pdf_comparison',
        similarity: response.similarity_score,
        changes: response.statistics.total_changes
      }
    });

    return Response.json({
      success: true,
      comparison: response
    });

  } catch (error) {
    console.error('PDF comparison error:', error);
    return Response.json({ 
      error: error.message || 'Comparison failed' 
    }, { status: 500 });
  }
});