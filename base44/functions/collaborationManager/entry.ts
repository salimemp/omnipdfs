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

    let collab = (await base44.entities.Collaboration.filter({ document_id: documentId }))[0];

    if (action === 'add_collaborator') {
      const { email, role } = data;
      
      const collaborators = collab?.collaborators || [];
      
      if (!collaborators.find(c => c.email === email)) {
        collaborators.push({
          email,
          role: role || 'viewer',
          joined_at: new Date().toISOString()
        });

        if (collab) {
          await base44.entities.Collaboration.update(collab.id, { collaborators });
        } else {
          collab = await base44.entities.Collaboration.create({
            document_id: documentId,
            collaborators,
            comments: [],
            version_history: [],
            status: 'draft'
          });
        }

        await base44.integrations.Core.SendEmail({
          to: email,
          subject: `Invited to collaborate: ${document.name}`,
          body: `You've been invited to collaborate on ${document.name} with ${role} access.`
        });
      }

      return Response.json({ success: true, collaborators });
    }

    if (action === 'add_comment') {
      const { content, page, position } = data;
      
      const comments = collab?.comments || [];
      const newComment = {
        id: `comment_${Date.now()}`,
        author: user.email,
        content,
        page,
        position,
        created_at: new Date().toISOString(),
        resolved: false
      };

      comments.push(newComment);

      if (collab) {
        await base44.entities.Collaboration.update(collab.id, { comments });
      } else {
        await base44.entities.Collaboration.create({
          document_id: documentId,
          comments: [newComment]
        });
      }

      return Response.json({ success: true, comment: newComment });
    }

    if (action === 'resolve_comment') {
      const { commentId } = data;
      
      const comments = collab?.comments || [];
      const comment = comments.find(c => c.id === commentId);
      
      if (comment) {
        comment.resolved = true;
        await base44.entities.Collaboration.update(collab.id, { comments });
      }

      return Response.json({ success: true });
    }

    if (action === 'update_status') {
      const { status } = data;
      
      if (collab) {
        await base44.entities.Collaboration.update(collab.id, { status });
      }

      return Response.json({ success: true });
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('Collaboration error:', error);
    return Response.json({ 
      error: error.message || 'Collaboration operation failed' 
    }, { status: 500 });
  }
});