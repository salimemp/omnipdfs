import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Type, Image, Square, Circle, ArrowRight, Minus, CheckSquare,
  Eraser, Undo2, Redo2, ZoomIn, ZoomOut, Move, Highlighter,
  PenTool, Shapes, Link2, Table2, FileText, Layers, Lock, Unlock,
  Eye, EyeOff, Copy, Trash2, AlignLeft, AlignCenter, AlignRight,
  Bold, Italic, Underline, Palette, Download, Upload
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { toast } from 'sonner';

const toolGroups = [
  {
    name: 'Selection',
    tools: [
      { id: 'select', icon: Move, label: 'Select', hotkey: 'V' },
    ]
  },
  {
    name: 'Shapes',
    tools: [
      { id: 'text', icon: Type, label: 'Text', hotkey: 'T' },
      { id: 'rectangle', icon: Square, label: 'Rectangle', hotkey: 'R' },
      { id: 'circle', icon: Circle, label: 'Circle', hotkey: 'C' },
      { id: 'line', icon: Minus, label: 'Line', hotkey: 'L' },
      { id: 'arrow', icon: ArrowRight, label: 'Arrow', hotkey: 'A' },
    ]
  },
  {
    name: 'Annotation',
    tools: [
      { id: 'highlight', icon: Highlighter, label: 'Highlight', hotkey: 'H' },
      { id: 'pen', icon: PenTool, label: 'Pen', hotkey: 'P' },
      { id: 'checkbox', icon: CheckSquare, label: 'Checkbox', hotkey: 'K' },
      { id: 'link', icon: Link2, label: 'Link', hotkey: 'N' },
    ]
  },
  {
    name: 'Advanced',
    tools: [
      { id: 'table', icon: Table2, label: 'Table', hotkey: 'B' },
      { id: 'image', icon: Image, label: 'Image', hotkey: 'I' },
      { id: 'stamp', icon: FileText, label: 'Stamp', hotkey: 'S' },
    ]
  }
];

export default function AdvancedToolbar({ 
  activeTool, 
  onToolChange, 
  onAction,
  selectedElements = [],
  zoom = 100,
  onZoomChange,
  isDark = true 
}) {
  const [fontSize, setFontSize] = useState(16);
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [color, setColor] = useState('#8B5CF6');
  const [opacity, setOpacity] = useState(100);

  const handleAction = (action) => {
    onAction?.(action);
    toast.success(`${action} applied`);
  };

  return (
    <div className={`flex flex-col gap-3 ${isDark ? 'bg-slate-900/50' : 'bg-white'} rounded-2xl p-4 border ${isDark ? 'border-slate-700/50' : 'border-slate-200'}`}>
      {/* Main Tools */}
      <div className="space-y-3">
        {toolGroups.map((group, i) => (
          <div key={i}>
            <p className={`text-xs font-medium mb-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              {group.name}
            </p>
            <div className="grid grid-cols-3 gap-2">
              {group.tools.map((tool) => {
                const Icon = tool.icon;
                const isActive = activeTool === tool.id;
                return (
                  <button
                    key={tool.id}
                    onClick={() => onToolChange(tool.id)}
                    className={`relative p-3 rounded-lg transition-all ${
                      isActive
                        ? 'bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border-2 border-violet-500/50'
                        : isDark
                          ? 'bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700'
                          : 'bg-slate-50 hover:bg-slate-100 border border-slate-200'
                    }`}
                    title={`${tool.label} (${tool.hotkey})`}
                  >
                    <Icon className={`w-5 h-5 mx-auto ${isActive ? 'text-violet-400' : isDark ? 'text-slate-400' : 'text-slate-600'}`} />
                    {tool.hotkey && (
                      <span className={`absolute top-1 right-1 text-[9px] ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
                        {tool.hotkey}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Properties */}
      {selectedElements.length > 0 && (
        <div className={`pt-3 border-t ${isDark ? 'border-slate-700' : 'border-slate-200'} space-y-3`}>
          <p className={`text-xs font-medium ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            Properties ({selectedElements.length})
          </p>

          {/* Font Size */}
          <div>
            <label className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Size</label>
            <Select value={String(fontSize)} onValueChange={(v) => setFontSize(Number(v))}>
              <SelectTrigger className={`mt-1 h-8 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className={isDark ? 'bg-slate-900 border-slate-700' : ''}>
                {[8, 10, 12, 14, 16, 18, 20, 24, 32, 48].map(size => (
                  <SelectItem key={size} value={String(size)} className={isDark ? 'text-white' : ''}>{size}px</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Color */}
          <div>
            <label className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Color</label>
            <div className="flex gap-2 mt-1">
              {['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#6B7280'].map(c => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-lg border-2 ${color === c ? 'border-white' : 'border-transparent'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Opacity */}
          <div>
            <label className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Opacity: {opacity}%</label>
            <Slider
              value={[opacity]}
              onValueChange={([v]) => setOpacity(v)}
              min={0}
              max={100}
              step={5}
              className="mt-2"
            />
          </div>

          {/* Alignment */}
          <div className="flex gap-1">
            <Button size="sm" variant="outline" onClick={() => handleAction('align-left')} className={isDark ? 'border-slate-700' : ''}>
              <AlignLeft className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleAction('align-center')} className={isDark ? 'border-slate-700' : ''}>
              <AlignCenter className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleAction('align-right')} className={isDark ? 'border-slate-700' : ''}>
              <AlignRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className={`pt-3 border-t ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
        <p className={`text-xs font-medium mb-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          Actions
        </p>
        <div className="grid grid-cols-3 gap-1">
          <Button size="sm" variant="outline" onClick={() => handleAction('undo')} className={isDark ? 'border-slate-700' : ''}>
            <Undo2 className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={() => handleAction('redo')} className={isDark ? 'border-slate-700' : ''}>
            <Redo2 className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={() => handleAction('delete')} className={isDark ? 'border-slate-700' : ''}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Zoom */}
      <div className={`pt-3 border-t ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
        <p className={`text-xs font-medium mb-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          Zoom: {zoom}%
        </p>
        <div className="flex gap-1">
          <Button size="sm" variant="outline" onClick={() => onZoomChange?.(zoom - 10)} className={isDark ? 'border-slate-700' : ''}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={() => onZoomChange?.(100)} className={`flex-1 ${isDark ? 'border-slate-700' : ''}`}>
            Fit
          </Button>
          <Button size="sm" variant="outline" onClick={() => onZoomChange?.(zoom + 10)} className={isDark ? 'border-slate-700' : ''}>
            <ZoomIn className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}