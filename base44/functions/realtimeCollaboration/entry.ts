import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, documentId, data } = await req.json();

    const document = await base44.entities.Document.get(documentId);
    if (!document) {
      return Response.json({ error: 'Document not found' }, { status: 404 });
    }

    let collab = (await base44.entities.Collaboration.filter({ document_id: documentId }))[0];

    if (!collab) {
      collab = await base44.entities.Collaboration.create({
        document_id: documentId,
        collaborators: [],
        comments: [],
        version_history: [],
        status: 'draft'
      });
    }

    if (action === 'update_content') {
      const { content, cursor_position } = data;
      
      const newVersion = {
        version: Date.now(),
        author: user.email,
        changes: 'Content updated',
        created_at: new Date().toISOString()
      };

      const versionHistory = collab.version_history || [];
      await base44.entities.Collaboration.update(collab.id, {
        version_history: [...versionHistory, newVersion]
      });

      return Response.json({ 
        success: true, 
        version: newVersion,
        last_saved: new Date().toISOString()
      });
    }

    if (action === 'get_active_users') {
      const collaborators = collab.collaborators || [];
      
      return Response.json({ 
        success: true, 
        active_users: collaborators.slice(0, 3)
      });
    }

    if (action === 'add_annotation') {
      const { type, content, page, position } = data;
      
      const comment = {
        id: `annotation_${Date.now()}`,
        author: user.email,
        type: type || 'comment',
        content,
        page,
        position,
        created_at: new Date().toISOString(),
        resolved: false
      };

      const comments = collab.comments || [];
      await base44.entities.Collaboration.update(collab.id, {
        comments: [...comments, comment]
      });

      return Response.json({ success: true, annotation: comment });
    }

    if (action === 'resolve_annotation') {
      const { annotationId } = data;
      
      const comments = collab.comments || [];
      const updated = comments.map(c => 
        c.id === annotationId ? { ...c, resolved: true } : c
      );
      
      await base44.entities.Collaboration.update(collab.id, {
        comments: updated
      });

      return Response.json({ success: true });
    }

    if (action === 'track_presence') {
      const { cursor, selection } = data;
      
      return Response.json({ 
        success: true,
        timestamp: new Date().toISOString()
      });
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('Realtime collaboration error:', error);
    return Response.json({ 
      error: error.message || 'Collaboration failed' 
    }, { status: 500 });
  }
});