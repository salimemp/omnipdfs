import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

const connections = new Map();

Deno.serve(async (req) => {
  const upgrade = req.headers.get("upgrade") || "";
  
  if (upgrade.toLowerCase() !== "websocket") {
    return new Response("Expected WebSocket", { status: 426 });
  }

  const url = new URL(req.url);
  const documentId = url.pathname.split('/').pop();
  
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { socket, response } = Deno.upgradeWebSocket(req);
    
    socket.onopen = () => {
      const connectionId = crypto.randomUUID();
      connections.set(connectionId, {
        socket,
        documentId,
        userId: user.id,
        userName: user.full_name || user.email
      });
      
      // Broadcast presence update
      broadcastToDocument(documentId, {
        type: 'presence-update',
        data: {
          users: getDocumentUsers(documentId)
        }
      }, connectionId);
    };

    socket.onmessage = async (event) => {
      try {
        const message = JSON.parse(event.data);
        
        // Broadcast to all users in the same document
        broadcastToDocument(documentId, {
          ...message,
          userId: user.id,
          userName: user.full_name || user.email,
          timestamp: new Date().toISOString()
        }, null, true);
        
        // Store updates in database
        if (message.type === 'document-update') {
          await base44.entities.ActivityLog.create({
            action: 'convert',
            document_id: documentId,
            document_name: 'Real-time edit',
            details: {
              type: 'websocket_update',
              user: user.email
            }
          });
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    };

    socket.onclose = () => {
      // Remove connection and broadcast presence update
      for (const [id, conn] of connections.entries()) {
        if (conn.socket === socket) {
          connections.delete(id);
          broadcastToDocument(documentId, {
            type: 'presence-update',
            data: {
              users: getDocumentUsers(documentId)
            }
          });
          break;
        }
      }
    };

    return response;
    
  } catch (error) {
    return new Response(error.message, { status: 500 });
  }
});

function broadcastToDocument(documentId, message, excludeConnectionId = null, includeAll = false) {
  for (const [id, conn] of connections.entries()) {
    if (conn.documentId === documentId && (includeAll || id !== excludeConnectionId)) {
      try {
        conn.socket.send(JSON.stringify(message));
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    }
  }
}

function getDocumentUsers(documentId) {
  const users = [];
  for (const conn of connections.values()) {
    if (conn.documentId === documentId) {
      users.push({
        userId: conn.userId,
        userName: conn.userName
      });
    }
  }
  return users;
}