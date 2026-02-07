import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Trash2, Save, Play, Settings, Copy, 
  FileText, Image, Zap, Mail, Clock, Filter,
  GitBranch, Repeat, AlertCircle, CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const nodeTypes = {
  trigger: {
    name: 'Trigger',
    icon: Zap,
    color: 'from-amber-500 to-orange-600',
    options: ['File Upload', 'Schedule', 'Webhook', 'Manual']
  },
  action: {
    name: 'Action',
    icon: Settings,
    color: 'from-violet-500 to-purple-600',
    options: ['Convert', 'Compress', 'Merge', 'Split', 'OCR', 'Encrypt', 'Watermark']
  },
  condition: {
    name: 'Condition',
    icon: GitBranch,
    color: 'from-cyan-500 to-blue-600',
    options: ['File Type', 'File Size', 'Contains Text', 'Date', 'Custom']
  },
  integration: {
    name: 'Integration',
    icon: Mail,
    color: 'from-emerald-500 to-green-600',
    options: ['Email', 'Slack', 'Google Drive', 'Dropbox', 'Webhook']
  },
  loop: {
    name: 'Loop',
    icon: Repeat,
    color: 'from-pink-500 to-rose-600',
    options: ['For Each File', 'Until Condition', 'Retry']
  }
};

export default function AdvancedWorkflowBuilder({ isDark = true }) {
  const [workflow, setWorkflow] = useState({
    name: 'New Workflow',
    nodes: [
      { id: '1', type: 'trigger', option: 'File Upload', x: 50, y: 50, config: {} }
    ],
    connections: []
  });
  const [selectedNode, setSelectedNode] = useState(null);
  const [draggedNodeType, setDraggedNodeType] = useState(null);

  const addNode = (type, x = 200, y = 200) => {
    const newNode = {
      id: Date.now().toString(),
      type,
      option: nodeTypes[type].options[0],
      x,
      y,
      config: {}
    };
    setWorkflow(prev => ({
      ...prev,
      nodes: [...prev.nodes, newNode]
    }));
  };

  const updateNode = (nodeId, updates) => {
    setWorkflow(prev => ({
      ...prev,
      nodes: prev.nodes.map(node =>
        node.id === nodeId ? { ...node, ...updates } : node
      )
    }));
  };

  const deleteNode = (nodeId) => {
    setWorkflow(prev => ({
      ...prev,
      nodes: prev.nodes.filter(node => node.id !== nodeId),
      connections: prev.connections.filter(
        conn => conn.from !== nodeId && conn.to !== nodeId
      )
    }));
    if (selectedNode?.id === nodeId) {
      setSelectedNode(null);
    }
  };

  const connectNodes = (fromId, toId) => {
    const exists = workflow.connections.some(
      conn => conn.from === fromId && conn.to === toId
    );
    if (!exists) {
      setWorkflow(prev => ({
        ...prev,
        connections: [...prev.connections, { from: fromId, to: toId }]
      }));
    }
  };

  const saveWorkflow = () => {
    toast.success('Workflow saved successfully');
  };

  const testWorkflow = () => {
    toast.info('Testing workflow...');
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Input
            value={workflow.name}
            onChange={(e) => setWorkflow(prev => ({ ...prev, name: e.target.value }))}
            className={`w-64 font-semibold ${isDark ? 'bg-slate-900 border-slate-700 text-white' : ''}`}
          />
          <Badge variant="secondary" className={isDark ? 'bg-violet-500/20 text-violet-300' : ''}>
            {workflow.nodes.length} nodes
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button onClick={testWorkflow} variant="outline" size="sm">
            <Play className="w-4 h-4 mr-2" />
            Test
          </Button>
          <Button onClick={saveWorkflow} size="sm" className="bg-violet-500 hover:bg-violet-600">
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-4">
        {/* Node Palette */}
        <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
          <CardHeader>
            <CardTitle className={`text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Workflow Nodes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {Object.entries(nodeTypes).map(([type, data]) => {
              const Icon = data.icon;
              return (
                <motion.button
                  key={type}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => addNode(type)}
                  className={`w-full p-3 rounded-lg text-left transition-all ${
                    isDark 
                      ? 'bg-slate-800 hover:bg-slate-700 text-white' 
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${data.color} flex items-center justify-center`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium">{data.name}</span>
                  </div>
                </motion.button>
              );
            })}
          </CardContent>
        </Card>

        {/* Canvas */}
        <div className="lg:col-span-2">
          <Card className={`h-[600px] overflow-auto ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className="relative w-full h-full p-4" style={{ minWidth: '800px', minHeight: '800px' }}>
              {/* Connections */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                {workflow.connections.map((conn, i) => {
                  const fromNode = workflow.nodes.find(n => n.id === conn.from);
                  const toNode = workflow.nodes.find(n => n.id === conn.to);
                  if (!fromNode || !toNode) return null;
                  
                  const x1 = fromNode.x + 100;
                  const y1 = fromNode.y + 40;
                  const x2 = toNode.x;
                  const y2 = toNode.y + 40;
                  
                  return (
                    <g key={i}>
                      <line
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke={isDark ? '#6366f1' : '#8b5cf6'}
                        strokeWidth="2"
                        strokeDasharray="5,5"
                      />
                      <circle cx={x2} cy={y2} r="4" fill={isDark ? '#6366f1' : '#8b5cf6'} />
                    </g>
                  );
                })}
              </svg>

              {/* Nodes */}
              {workflow.nodes.map((node) => {
                const nodeType = nodeTypes[node.type];
                const Icon = nodeType.icon;
                return (
                  <motion.div
                    key={node.id}
                    drag
                    dragMomentum={false}
                    onDragEnd={(e, info) => {
                      updateNode(node.id, {
                        x: Math.max(0, node.x + info.offset.x),
                        y: Math.max(0, node.y + info.offset.y)
                      });
                    }}
                    onClick={() => setSelectedNode(node)}
                    style={{
                      position: 'absolute',
                      left: node.x,
                      top: node.y,
                      zIndex: 1
                    }}
                    className={`w-48 p-3 rounded-xl cursor-move ${
                      selectedNode?.id === node.id
                        ? 'ring-2 ring-violet-500'
                        : ''
                    } ${isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-200'}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${nodeType.color} flex items-center justify-center`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNode(node.id);
                        }}
                        className={`p-1 rounded hover:bg-red-500/20 ${isDark ? 'text-red-400' : 'text-red-600'}`}
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                    <div className={`text-xs font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {nodeType.name}
                    </div>
                    <div className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {node.option}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Properties Panel */}
        <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
          <CardHeader>
            <CardTitle className={`text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {selectedNode ? 'Node Properties' : 'No Node Selected'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedNode ? (
              <div className="space-y-4">
                <div>
                  <label className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'} mb-2 block`}>
                    Action Type
                  </label>
                  <Select
                    value={selectedNode.option}
                    onValueChange={(value) => updateNode(selectedNode.id, { option: value })}
                  >
                    <SelectTrigger className={isDark ? 'bg-slate-800 border-slate-700' : ''}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {nodeTypes[selectedNode.type].options.map(option => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedNode.type === 'action' && selectedNode.option === 'Convert' && (
                  <div>
                    <label className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'} mb-2 block`}>
                      Target Format
                    </label>
                    <Select>
                      <SelectTrigger className={isDark ? 'bg-slate-800 border-slate-700' : ''}>
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="docx">Word</SelectItem>
                        <SelectItem value="jpg">JPG</SelectItem>
                        <SelectItem value="png">PNG</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className={`p-3 rounded-lg ${isDark ? 'bg-violet-500/10 border border-violet-500/20' : 'bg-violet-50 border border-violet-200'}`}>
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-violet-400 mt-0.5" />
                    <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      Drag nodes to position them. Click to edit properties.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Select a node to edit its properties
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}