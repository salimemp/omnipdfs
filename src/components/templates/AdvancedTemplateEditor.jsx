import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import {
  Layers,
  Type,
  Image as ImageIcon,
  Square,
  Circle,
  Minus,
  Save,
  Eye,
  Code,
  Sparkles,
  Undo,
  Redo,
  Trash2,
  Copy,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Grid3x3,
  Share2,
  GitBranch,
  SaveAll,
  FileDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from 'sonner';
import TemplateVersioning from './TemplateVersioning';
import AdvancedSharingDialog from './AdvancedSharingDialog';

const tools = [
  { id: 'text', icon: Type, label: 'Text' },
  { id: 'image', icon: ImageIcon, label: 'Image' },
  { id: 'rectangle', icon: Square, label: 'Rectangle' },
  { id: 'circle', icon: Circle, label: 'Circle' },
  { id: 'line', icon: Minus, label: 'Line' },
];

export default function AdvancedTemplateEditor({ template, onSave, isDark = true }) {
  const [elements, setElements] = useState(template?.template_data?.elements || []);
  const [selectedElement, setSelectedElement] = useState(null);
  const [activeTool, setActiveTool] = useState('text');
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showGrid, setShowGrid] = useState(true);
  const [templateName, setTemplateName] = useState(template?.name || '');
  const [showVersioning, setShowVersioning] = useState(false);
  const [showSharing, setShowSharing] = useState(false);
  const [currentTemplateId, setCurrentTemplateId] = useState(template?.id);

  const addElement = (type) => {
    const newElement = {
      id: Date.now(),
      type,
      x: 100 + Math.random() * 200,
      y: 100 + Math.random() * 200,
      width: type === 'text' ? 200 : 150,
      height: type === 'text' ? 40 : 100,
      content: type === 'text' ? 'New Text' : '',
      fontSize: 16,
      color: '#000000',
      backgroundColor: 'transparent',
      borderColor: '#000000',
      borderWidth: 2,
      opacity: 100
    };

    const newElements = [...elements, newElement];
    setElements(newElements);
    addToHistory(newElements);
    setSelectedElement(newElement.id);
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
    addToHistory(newElements);
    setSelectedElement(null);
  };

  const duplicateElement = (id) => {
    const element = elements.find(el => el.id === id);
    if (element) {
      const duplicate = {
        ...element,
        id: Date.now(),
        x: element.x + 20,
        y: element.y + 20
      };
      const newElements = [...elements, duplicate];
      setElements(newElements);
      addToHistory(newElements);
    }
  };

  const addToHistory = (newElements) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newElements);
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

  const alignElements = (alignment) => {
    if (!selectedElement) return;
    
    const element = elements.find(el => el.id === selectedElement);
    if (!element) return;

    let updates = {};
    const canvasWidth = 800;

    switch (alignment) {
      case 'left':
        updates = { x: 0 };
        break;
      case 'center':
        updates = { x: (canvasWidth - element.width) / 2 };
        break;
      case 'right':
        updates = { x: canvasWidth - element.width };
        break;
    }

    updateElement(selectedElement, updates);
  };

  const handleSave = async (saveAs = false) => {
    if (!templateName) {
      toast.error('Please enter a template name');
      return;
    }

    try {
      const templateData = {
        name: saveAs ? `${templateName} (Copy)` : templateName,
        template_data: { elements },
        category: 'custom'
      };

      if (template?.id && !saveAs) {
        await base44.entities.Template.update(template.id, templateData);
        toast.success('Template updated');
      } else {
        const newTemplate = await base44.entities.Template.create(templateData);
        setCurrentTemplateId(newTemplate.id);
        toast.success('Template created');
      }

      onSave?.();
    } catch (e) {
      toast.error('Failed to save template');
    }
  };

  const saveVersion = async () => {
    if (!currentTemplateId) {
      toast.error('Save the template first');
      return;
    }

    try {
      const versionNumber = Math.floor(Date.now() / 1000);
      await base44.entities.ActivityLog.create({
        action: 'convert',
        document_id: currentTemplateId,
        details: {
          type: 'template_version',
          version_number: versionNumber,
          version_data: { elements, name: templateName },
          change_description: prompt('Describe this version:') || 'Version saved'
        }
      });

      toast.success('Version saved successfully');
    } catch (e) {
      toast.error('Failed to save version');
    }
  };

  const restoreVersion = (versionData) => {
    if (versionData.elements) {
      setElements(versionData.elements);
      addToHistory(versionData.elements);
    }
    if (versionData.name) {
      setTemplateName(versionData.name);
    }
  };

  const exportTemplate = () => {
    const data = JSON.stringify({ name: templateName, elements }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${templateName.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Template exported');
  };

  const generateWithAI = async () => {
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Improve this template design. Suggest optimal positioning and styling for the following elements: ${JSON.stringify(elements.map(e => ({ type: e.type, content: e.content })))}`,
        response_json_schema: {
          type: "object",
          properties: {
            suggestions: { type: "array", items: { type: "string" } }
          }
        }
      });

      toast.success('AI suggestions ready');
    } catch (e) {
      toast.error('AI generation failed');
    }
  };

  const selectedElementData = elements.find(el => el.id === selectedElement);

  return (
    <>
    <div className={`grid gap-4 h-[700px] ${showVersioning ? 'grid-cols-[280px_1fr_280px_300px]' : 'grid-cols-[280px_1fr_280px]'}`}>
      {/* Left Panel - Tools */}
      <div className={`rounded-2xl p-4 overflow-y-auto ${isDark ? 'bg-slate-900/50 border border-slate-800' : 'bg-white border border-slate-200'}`}>
        <h3 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          <Layers className="w-4 h-4 inline mr-2" />
          Tools
        </h3>

        <div className="space-y-2 mb-6">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => {
                setActiveTool(tool.id);
                addElement(tool.id);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                activeTool === tool.id
                  ? 'bg-violet-500 text-white'
                  : isDark ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <tool.icon className="w-4 h-4" />
              {tool.label}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={generateWithAI}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            AI Enhance
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => setShowGrid(!showGrid)}
          >
            <Grid3x3 className="w-4 h-4 mr-2" />
            {showGrid ? 'Hide' : 'Show'} Grid
          </Button>
        </div>
      </div>

      {/* Center Panel - Canvas */}
      <div className={`rounded-2xl p-4 overflow-auto ${isDark ? 'bg-slate-900/50 border border-slate-800' : 'bg-white border border-slate-200'}`}>
        <div className="flex items-center justify-between mb-4">
          <Input
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            placeholder="Template name..."
            className={`max-w-xs ${isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}`}
          />
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={undo} disabled={historyIndex <= 0}>
              <Undo className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={redo} disabled={historyIndex >= history.length - 1}>
              <Redo className="w-4 h-4" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" className="bg-violet-500">
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className={isDark ? 'bg-slate-900 border-slate-700' : ''}>
                <DropdownMenuItem onClick={() => handleSave()} className={isDark ? 'text-white' : ''}>
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSave(true)} className={isDark ? 'text-white' : ''}>
                  <SaveAll className="w-4 h-4 mr-2" />
                  Save As Copy
                </DropdownMenuItem>
                <DropdownMenuItem onClick={saveVersion} className={isDark ? 'text-white' : ''}>
                  <GitBranch className="w-4 h-4 mr-2" />
                  Save Version
                </DropdownMenuItem>
                <DropdownMenuSeparator className={isDark ? 'bg-slate-700' : ''} />
                <DropdownMenuItem onClick={exportTemplate} className={isDark ? 'text-white' : ''}>
                  <FileDown className="w-4 h-4 mr-2" />
                  Export Template
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button size="sm" variant="outline" onClick={() => setShowSharing(true)}>
              <Share2 className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={() => setShowVersioning(!showVersioning)}>
              <GitBranch className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Canvas */}
        <div
          className={`relative bg-white rounded-lg shadow-lg mx-auto ${showGrid ? 'bg-grid-pattern' : ''}`}
          style={{ width: 800, height: 1000, minHeight: 1000 }}
        >
          {elements.map((element) => (
            <div
              key={element.id}
              onClick={() => setSelectedElement(element.id)}
              className={`absolute cursor-move ${selectedElement === element.id ? 'ring-2 ring-violet-500' : ''}`}
              style={{
                left: element.x,
                top: element.y,
                width: element.width,
                height: element.height,
                opacity: element.opacity / 100
              }}
            >
              {element.type === 'text' && (
                <div
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => updateElement(element.id, { content: e.target.textContent })}
                  className="outline-none w-full h-full p-2"
                  style={{
                    fontSize: element.fontSize,
                    color: element.color,
                    backgroundColor: element.backgroundColor
                  }}
                >
                  {element.content}
                </div>
              )}
              {(element.type === 'rectangle' || element.type === 'circle') && (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: element.backgroundColor,
                    border: `${element.borderWidth}px solid ${element.borderColor}`,
                    borderRadius: element.type === 'circle' ? '50%' : '4px'
                  }}
                />
              )}
              {element.type === 'line' && (
                <div
                  style={{
                    width: '100%',
                    height: element.borderWidth,
                    backgroundColor: element.borderColor
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel - Properties */}
      <div className={`rounded-2xl p-4 overflow-y-auto ${isDark ? 'bg-slate-900/50 border border-slate-800' : 'bg-white border border-slate-200'}`}>
        <h3 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Properties</h3>

        {selectedElementData ? (
          <div className="space-y-4">
            <div>
              <Label className={`text-xs ${isDark ? 'text-slate-400' : ''}`}>Width</Label>
              <Slider
                value={[selectedElementData.width]}
                onValueChange={([v]) => updateElement(selectedElement, { width: v })}
                min={50}
                max={600}
                className="mt-2"
              />
            </div>

            <div>
              <Label className={`text-xs ${isDark ? 'text-slate-400' : ''}`}>Height</Label>
              <Slider
                value={[selectedElementData.height]}
                onValueChange={([v]) => updateElement(selectedElement, { height: v })}
                min={20}
                max={400}
                className="mt-2"
              />
            </div>

            {selectedElementData.type === 'text' && (
              <div>
                <Label className={`text-xs ${isDark ? 'text-slate-400' : ''}`}>Font Size</Label>
                <Slider
                  value={[selectedElementData.fontSize]}
                  onValueChange={([v]) => updateElement(selectedElement, { fontSize: v })}
                  min={8}
                  max={72}
                  className="mt-2"
                />
              </div>
            )}

            <div>
              <Label className={`text-xs ${isDark ? 'text-slate-400' : ''}`}>Color</Label>
              <Input
                type="color"
                value={selectedElementData.color}
                onChange={(e) => updateElement(selectedElement, { color: e.target.value })}
                className="mt-2 h-10"
              />
            </div>

            <div>
              <Label className={`text-xs ${isDark ? 'text-slate-400' : ''}`}>Opacity</Label>
              <Slider
                value={[selectedElementData.opacity]}
                onValueChange={([v]) => updateElement(selectedElement, { opacity: v })}
                min={0}
                max={100}
                className="mt-2"
              />
            </div>

            <div className="pt-4 border-t border-slate-700">
              <Label className={`text-xs mb-2 block ${isDark ? 'text-slate-400' : ''}`}>Align</Label>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => alignElements('left')}>
                  <AlignLeft className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => alignElements('center')}>
                  <AlignCenter className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => alignElements('right')}>
                  <AlignRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-700">
              <Button
                size="sm"
                variant="outline"
                className="w-full mb-2"
                onClick={() => duplicateElement(selectedElement)}
              >
                <Copy className="w-4 h-4 mr-2" />
                Duplicate
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="w-full text-red-400"
                onClick={() => deleteElement(selectedElement)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        ) : (
          <p className={`text-sm text-center py-8 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            Select an element to edit
          </p>
        )}
      </div>

      {/* Versioning Panel */}
      {showVersioning && (
        <div className={`rounded-2xl p-4 overflow-y-auto ${isDark ? 'bg-slate-900/50 border border-slate-800' : 'bg-white border border-slate-200'}`}>
          <TemplateVersioning
            templateId={currentTemplateId}
            onRestoreVersion={restoreVersion}
            isDark={isDark}
          />
        </div>
      )}

      <style>{`
        .bg-grid-pattern {
          background-image: 
            linear-gradient(to right, #e5e7eb 1px, transparent 1px),
            linear-gradient(to bottom, #e5e7eb 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
    </div>

    {/* Sharing Dialog */}
    <AdvancedSharingDialog
      template={{ id: currentTemplateId, name: templateName, shared_with: template?.shared_with }}
      open={showSharing}
      onOpenChange={setShowSharing}
      isDark={isDark}
    />
    </>
  );
}