import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Type, Image, AlignLeft, AlignCenter, AlignRight,
  Bold, Italic, Underline, List, ListOrdered,
  Plus, Trash2, Copy, Layers, Move, Download,
  Sparkles, Eye, Undo, Redo, Save, Grid
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

const elementTypes = [
  { id: 'text', label: 'Text', icon: Type, defaultProps: { content: 'Text', fontSize: 16, color: '#000000' } },
  { id: 'heading', label: 'Heading', icon: Type, defaultProps: { content: 'Heading', fontSize: 24, bold: true } },
  { id: 'image', label: 'Image', icon: Image, defaultProps: { url: '', width: 200, height: 150 } },
  { id: 'list', label: 'List', icon: List, defaultProps: { items: ['Item 1', 'Item 2', 'Item 3'] } },
  { id: 'divider', label: 'Divider', icon: Grid, defaultProps: { color: '#e2e8f0', thickness: 1 } }
];

export default function VisualTemplateEditor({ templateId, isDark = false }) {
  const [elements, setElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [templateName, setTemplateName] = useState('Untitled Template');
  const canvasRef = useRef(null);

  const addElement = (type) => {
    const elementType = elementTypes.find(t => t.id === type);
    const newElement = {
      id: Date.now().toString(),
      type,
      position: { x: 50, y: 50 + elements.length * 60 },
      props: { ...elementType.defaultProps }
    };
    
    const newElements = [...elements, newElement];
    setElements(newElements);
    setSelectedElement(newElement.id);
    addToHistory(newElements);
  };

  const updateElement = (id, updates) => {
    const newElements = elements.map(el => 
      el.id === id ? { ...el, ...updates } : el
    );
    setElements(newElements);
    addToHistory(newElements);
  };

  const deleteElement = (id) => {
    const newElements = elements.filter(el => el.id !== id);
    setElements(newElements);
    setSelectedElement(null);
    addToHistory(newElements);
  };

  const duplicateElement = (id) => {
    const element = elements.find(el => el.id === id);
    if (element) {
      const newElement = {
        ...element,
        id: Date.now().toString(),
        position: { x: element.position.x + 20, y: element.position.y + 20 }
      };
      const newElements = [...elements, newElement];
      setElements(newElements);
      addToHistory(newElements);
    }
  };

  const addToHistory = (state) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(state);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setElements(history[historyIndex - 1]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setElements(history[historyIndex + 1]);
    }
  };

  const saveTemplate = async () => {
    try {
      await base44.entities.Template.create({
        name: templateName,
        category: 'custom',
        template_data: { elements }
      });
      toast.success('Template saved successfully');
    } catch (error) {
      toast.error('Failed to save template');
    }
  };

  const aiOptimizeLayout = async () => {
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Optimize this template layout for professional documents:
        
        Elements: ${JSON.stringify(elements)}
        
        Provide improved:
        - Element positioning (x, y coordinates)
        - Spacing and alignment
        - Font sizes and hierarchy
        - Color suggestions
        - Overall layout recommendations`,
        response_json_schema: {
          type: "object",
          properties: {
            optimized_elements: { type: "array" },
            suggestions: { type: "array", items: { type: "string" } }
          }
        }
      });

      if (result.optimized_elements) {
        setElements(result.optimized_elements);
        addToHistory(result.optimized_elements);
        toast.success('Layout optimized with AI');
      }
    } catch (error) {
      toast.error('AI optimization failed');
    }
  };

  const selectedEl = elements.find(el => el.id === selectedElement);

  return (
    <div className="flex h-[calc(100vh-200px)] gap-4">
      {/* Left Toolbar */}
      <Card className={`w-64 ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
        <CardContent className="p-4 space-y-4">
          <div>
            <Label className={`text-xs mb-2 block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              TEMPLATE NAME
            </Label>
            <Input
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              className={isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}
            />
          </div>

          <div>
            <Label className={`text-xs mb-2 block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              ADD ELEMENTS
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {elementTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <Button
                    key={type.id}
                    variant="outline"
                    size="sm"
                    onClick={() => addElement(type.id)}
                    className={`h-auto py-3 flex-col gap-1 ${isDark ? 'border-slate-700 hover:bg-slate-800' : ''}`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-xs">{type.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={undo}
              disabled={historyIndex <= 0}
              className="flex-1"
            >
              <Undo className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
              className="flex-1"
            >
              <Redo className="w-4 h-4" />
            </Button>
          </div>

          <Button
            onClick={aiOptimizeLayout}
            variant="outline"
            size="sm"
            className="w-full"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            AI Optimize
          </Button>

          <Button
            onClick={saveTemplate}
            className="w-full bg-violet-500 hover:bg-violet-600"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Template
          </Button>
        </CardContent>
      </Card>

      {/* Canvas */}
      <Card className={`flex-1 ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div
          ref={canvasRef}
          className={`relative w-full h-full p-8 overflow-auto ${isDark ? 'bg-slate-950/50' : 'bg-slate-50'}`}
          style={{ backgroundImage: 'radial-gradient(circle, rgba(148,163,184,0.1) 1px, transparent 1px)', backgroundSize: '20px 20px' }}
        >
          <div className={`relative mx-auto bg-white shadow-2xl ${isDark ? 'border border-slate-700' : ''}`} style={{ width: '800px', minHeight: '1000px' }}>
            {elements.map((element) => (
              <ElementRenderer
                key={element.id}
                element={element}
                isSelected={selectedElement === element.id}
                onSelect={() => setSelectedElement(element.id)}
                onUpdate={(updates) => updateElement(element.id, updates)}
                isDark={isDark}
              />
            ))}
            
            {elements.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Layers className="w-12 h-12 mx-auto mb-3 text-slate-400" />
                  <p className="text-slate-500">Add elements to start designing</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Right Properties Panel */}
      {selectedEl && (
        <Card className={`w-80 ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <Label className={isDark ? 'text-white' : 'text-slate-900'}>Element Properties</Label>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => duplicateElement(selectedEl.id)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteElement(selectedEl.id)}
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </Button>
              </div>
            </div>

            <div>
              <Label className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Type</Label>
              <Badge className="mt-1">{selectedEl.type}</Badge>
            </div>

            {selectedEl.type === 'text' || selectedEl.type === 'heading' ? (
              <>
                <div>
                  <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Content</Label>
                  <Input
                    value={selectedEl.props.content}
                    onChange={(e) => updateElement(selectedEl.id, {
                      props: { ...selectedEl.props, content: e.target.value }
                    })}
                    className={isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}
                  />
                </div>
                <div>
                  <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Font Size</Label>
                  <Slider
                    value={[selectedEl.props.fontSize || 16]}
                    onValueChange={([value]) => updateElement(selectedEl.id, {
                      props: { ...selectedEl.props, fontSize: value }
                    })}
                    min={8}
                    max={72}
                    step={1}
                  />
                </div>
              </>
            ) : null}

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>X Position</Label>
                <Input
                  type="number"
                  value={selectedEl.position.x}
                  onChange={(e) => updateElement(selectedEl.id, {
                    position: { ...selectedEl.position, x: parseInt(e.target.value) }
                  })}
                  className={isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}
                />
              </div>
              <div>
                <Label className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Y Position</Label>
                <Input
                  type="number"
                  value={selectedEl.position.y}
                  onChange={(e) => updateElement(selectedEl.id, {
                    position: { ...selectedEl.position, y: parseInt(e.target.value) }
                  })}
                  className={isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function ElementRenderer({ element, isSelected, onSelect, onUpdate, isDark }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e) => {
    setIsDragging(true);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrag = (e) => {
    if (e.clientX === 0 && e.clientY === 0) return;
    onUpdate({
      position: { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY }
    });
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragEnd={() => setIsDragging(false)}
      onClick={onSelect}
      className={`absolute cursor-move ${isSelected ? 'ring-2 ring-violet-500' : ''} ${isDragging ? 'opacity-50' : ''}`}
      style={{
        left: element.position.x,
        top: element.position.y
      }}
    >
      {element.type === 'text' || element.type === 'heading' ? (
        <p style={{ fontSize: element.props.fontSize, fontWeight: element.props.bold ? 'bold' : 'normal' }}>
          {element.props.content}
        </p>
      ) : element.type === 'list' ? (
        <ul className="list-disc pl-5">
          {element.props.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      ) : element.type === 'divider' ? (
        <div style={{ width: '100%', height: element.props.thickness, backgroundColor: element.props.color }} />
      ) : null}
    </div>
  );
}