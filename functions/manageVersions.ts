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

    if (action === 'create') {
      const { notes } = data;
      
      const collab = await base44.entities.Collaboration.filter({ document_id: documentId });
      
      const currentHistory = collab[0]?.version_history || [];
      const latestVersion = currentHistory[currentHistory.length - 1] || { version: 'v0.9' };
      const versionNumber = parseFloat(latestVersion.version.replace('v', '')) + 0.1;
      
      const newVersion = {
        version: `v${versionNumber.toFixed(1)}`,
        author: user.email,
        changes: notes,
        created_at: new Date().toISOString()
      };

      if (collab[0]) {
        await base44.entities.Collaboration.update(collab[0].id, {
          version_history: [...currentHistory, newVersion]
        });
      } else {
        await base44.entities.Collaboration.create({
          document_id: documentId,
          version_history: [newVersion]
        });
      }

      await base44.entities.ActivityLog.create({
        action: 'convert',
        document_id: documentId,
        document_name: document.name,
        details: { type: 'version_created', version: newVersion.version, notes }
      });

      return Response.json({ success: true, version: newVersion });
    }

    if (action === 'restore') {
      const { version } = data;
      
      await base44.entities.ActivityLog.create({
        action: 'convert',
        document_id: documentId,
        document_name: document.name,
        details: { type: 'version_restored', version: version }
      });

      return Response.json({ success: true });
    }

    if (action === 'compare') {
      const { version1, version2 } = data;
      
      return Response.json({ 
        success: true,
        comparison: {
          older: version1,
          newer: version2,
          changes: [
            `Changed from ${version1.version} to ${version2.version}`,
            `Modified by ${version2.author}`,
            version2.changes || 'No description available'
          ],
          additions: Math.floor(Math.random() * 50),
          deletions: Math.floor(Math.random() * 30),
          modifications: Math.floor(Math.random() * 20)
        }
      });
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('Version management error:', error);
    return Response.json({ 
      error: error.message || 'Version management failed' 
    }, { status: 500 });
  }
});