import { useEffect, useRef, useState } from 'react';
import { base44 } from '@/api/base44Client';

export function useWebSocket(documentId, onMessage) {
  const ws = useRef(null);
  const [connected, setConnected] = useState(false);
  const reconnectTimeout = useRef(null);

  useEffect(() => {
    if (!documentId) return;

    const connect = async () => {
      try {
        const user = await base44.auth.me();
        
        // WebSocket connection to Base44 real-time service
        const wsUrl = `wss://${window.location.hostname}/ws/collaboration/${documentId}?token=${user.token}`;
        ws.current = new WebSocket(wsUrl);

        ws.current.onopen = () => {
          setConnected(true);
          console.log('WebSocket connected');
        };

        ws.current.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            onMessage(data);
          } catch (error) {
            console.error('WebSocket message error:', error);
          }
        };

        ws.current.onerror = (error) => {
          console.error('WebSocket error:', error);
        };

        ws.current.onclose = () => {
          setConnected(false);
          console.log('WebSocket disconnected');
          
          // Reconnect after 3 seconds
          reconnectTimeout.current = setTimeout(() => {
            connect();
          }, 3000);
        };
      } catch (error) {
        console.error('Failed to connect WebSocket:', error);
      }
    };

    connect();

    return () => {
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [documentId]);

  const sendMessage = (type, data) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ type, data }));
    }
  };

  return { connected, sendMessage };
}

export default function WebSocketManager({ documentId, onUpdate, children }) {
  const [cursors, setCursors] = useState({});
  const [presence, setPresence] = useState([]);

  const handleMessage = (message) => {
    switch (message.type) {
      case 'cursor-update':
        setCursors(prev => ({
          ...prev,
          [message.userId]: message.data
        }));
        break;
        
      case 'document-update':
        onUpdate?.(message.data);
        break;
        
      case 'presence-update':
        setPresence(message.data.users || []);
        break;
        
      case 'comment-added':
        onUpdate?.({ type: 'comment', data: message.data });
        break;
        
      default:
        break;
    }
  };

  const { connected, sendMessage } = useWebSocket(documentId, handleMessage);

  return children({ connected, cursors, presence, sendMessage });
}