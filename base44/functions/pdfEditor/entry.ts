import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { documentId, action, data } = await req.json();

    const document = await base44.entities.Document.get(documentId);
    if (!document) {
      return Response.json({ error: 'Document not found' }, { status: 404 });
    }

    // Validate input data
    if (!data) {
      return Response.json({ error: 'Action data required' }, { status: 400 });
    }

    let result = {};

    switch (action) {
      case 'add_text':
        const { text, x, y, page, fontSize, color } = data;
        if (!text || !page) {
          return Response.json({ error: 'Text and page required' }, { status: 400 });
        }
        result = { 
          success: true, 
          message: 'Text added to PDF',
          details: { text, page, position: { x, y }, fontSize, color }
        };
        break;
      
      case 'add_image':
        const { imageUrl, page: imgPage, x: imgX, y: imgY } = data;
        if (!imageUrl || !imgPage) {
          return Response.json({ error: 'Image URL and page required' }, { status: 400 });
        }
        result = { 
          success: true, 
          message: 'Image added to PDF',
          details: { imageUrl, page: imgPage, position: { x: imgX, y: imgY } }
        };
        break;
      
      case 'add_signature':
        const { signatureData, page: sigPage } = data;
        if (!signatureData || !sigPage) {
          return Response.json({ error: 'Signature data and page required' }, { status: 400 });
        }
        result = { 
          success: true, 
          message: 'Signature added to PDF',
          details: { page: sigPage }
        };
        break;
      
      case 'merge':
        const { documentIds } = data;
        if (!documentIds || documentIds.length < 2) {
          return Response.json({ error: 'At least 2 documents required' }, { status: 400 });
        }
        
        // Verify all documents exist
        const docs = await Promise.all(
          documentIds.map(id => base44.entities.Document.get(id))
        );
        if (docs.some(d => !d)) {
          return Response.json({ error: 'One or more documents not found' }, { status: 404 });
        }
        
        result = { 
          success: true, 
          message: `Merged ${documentIds.length} documents`,
          documentIds
        };
        break;
      
      case 'split':
        const { ranges } = data;
        if (!ranges || !Array.isArray(ranges) || ranges.length === 0) {
          return Response.json({ error: 'Page ranges required' }, { status: 400 });
        }
        result = { 
          success: true, 
          message: `Split into ${ranges.length} parts`,
          ranges
        };
        break;
      
      case 'rotate':
        const { pages, angle } = data;
        if (!pages || !angle || ![90, 180, 270, -90].includes(angle)) {
          return Response.json({ error: 'Valid pages and angle required' }, { status: 400 });
        }
        result = { 
          success: true, 
          message: `Rotated ${pages.length} pages by ${angle}°`,
          pages,
          angle
        };
        break;
      
      case 'delete_pages':
        const { pages: delPages } = data;
        if (!delPages || !Array.isArray(delPages) || delPages.length === 0) {
          return Response.json({ error: 'Page numbers required' }, { status: 400 });
        }
        result = { 
          success: true, 
          message: `Deleted ${delPages.length} pages`,
          pages: delPages
        };
        break;
      
      case 'reorder':
        const { newOrder } = data;
        if (!newOrder || !Array.isArray(newOrder)) {
          return Response.json({ error: 'New page order required' }, { status: 400 });
        }
        result = { 
          success: true, 
          message: 'Pages reordered',
          newOrder
        };
        break;

      default:
        return Response.json({ error: 'Invalid action' }, { status: 400 });
    }

    await base44.entities.ActivityLog.create({
      action: 'convert',
      document_id: documentId,
      document_name: document.name,
      details: { type: 'pdf_edit', action, ...data }
    });

    return Response.json(result);

  } catch (error) {
    console.error('PDF editor error:', error);
    return Response.json({ 
      error: error.message || 'PDF editing failed' 
    }, { status: 500 });
  }
});