import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, documentId, versionData } = await req.json();

    if (action === 'create_version') {
      const document = await base44.entities.Document.get(documentId);
      
      if (!document) {
        return Response.json({ error: 'Document not found' }, { status: 404 });
      }

      const collaboration = await base44.entities.Collaboration.filter({ document_id: documentId });
      
      let versionHistory = [];
      if (collaboration.length > 0 && collaboration[0].version_history) {
        versionHistory = collaboration[0].version_history;
      }

      const newVersion = {
        version: versionHistory.length + 1,
        author: user.email,
        changes: versionData.changes || 'Document updated',
        created_at: new Date().toISOString(),
        file_url: versionData.file_url || document.file_url,
        file_size: versionData.file_size || document.file_size
      };

      versionHistory.push(newVersion);

      if (collaboration.length > 0) {
        await base44.entities.Collaboration.update(collaboration[0].id, {
          version_history: versionHistory
        });
      } else {
        await base44.entities.Collaboration.create({
          document_id: documentId,
          version_history: versionHistory
        });
      }

      await base44.entities.ActivityLog.create({
        action: 'convert',
        document_id: documentId,
        details: {
          type: 'version_created',
          version: newVersion.version
        }
      });

      return Response.json({ success: true, version: newVersion });
    }

    if (action === 'restore_version') {
      const { version } = versionData;
      const collaboration = await base44.entities.Collaboration.filter({ document_id: documentId });
      
      if (collaboration.length === 0 || !collaboration[0].version_history) {
        return Response.json({ error: 'No version history found' }, { status: 404 });
      }

      const targetVersion = collaboration[0].version_history.find(v => v.version === version);
      
      if (!targetVersion) {
        return Response.json({ error: 'Version not found' }, { status: 404 });
      }

      await base44.entities.Document.update(documentId, {
        file_url: targetVersion.file_url,
        file_size: targetVersion.file_size
      });

      await base44.entities.ActivityLog.create({
        action: 'convert',
        document_id: documentId,
        details: {
          type: 'version_restored',
          version: version
        }
      });

      return Response.json({ success: true, restored: targetVersion });
    }

    if (action === 'list_versions') {
      const collaboration = await base44.entities.Collaboration.filter({ document_id: documentId });
      
      const versions = collaboration.length > 0 && collaboration[0].version_history 
        ? collaboration[0].version_history 
        : [];

      return Response.json({ success: true, versions });
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('Document versioning error:', error);
    return Response.json({ 
      error: error.message || 'Versioning failed' 
    }, { status: 500 });
  }
});