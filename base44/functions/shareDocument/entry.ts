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

    if (action === 'add_user') {
      const { email, role } = data;
      
      await base44.entities.Document.update(documentId, {
        is_shared: true,
        shared_with: [...new Set([...(document.shared_with || []), email])]
      });

      await base44.integrations.Core.SendEmail({
        to: email,
        subject: `Document shared: ${document.name}`,
        body: `You have been granted ${role} access to: ${document.name}\n\nAccess the document: ${data.shareLink || ''}`
      });

      await base44.entities.ActivityLog.create({
        action: 'share',
        document_id: documentId,
        document_name: document.name,
        details: {
          type: 'user_added',
          user_email: email,
          role: role
        }
      });

      return Response.json({ success: true });
    }

    if (action === 'remove_user') {
      const { email } = data;
      
      await base44.entities.Document.update(documentId, {
        shared_with: (document.shared_with || []).filter(e => e !== email)
      });

      await base44.entities.ActivityLog.create({
        action: 'share',
        document_id: documentId,
        document_name: document.name,
        details: {
          type: 'user_removed',
          user_email: email
        }
      });

      return Response.json({ success: true });
    }

    if (action === 'generate_link') {
      const { settings } = data;
      
      await base44.entities.ActivityLog.create({
        action: 'share',
        document_id: documentId,
        document_name: document.name,
        details: {
          type: 'link_generated',
          settings: settings
        }
      });

      return Response.json({ 
        success: true,
        link: `${data.origin}/share/${documentId}?access=${settings.role}`
      });
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('Share error:', error);
    return Response.json({ 
      error: error.message || 'Sharing failed' 
    }, { status: 500 });
  }
});