import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
import {
  FileText,
  Type,
  Image,
  Shapes,
  PenTool,
  Highlighter,
  Eraser,
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Save,
  Download,
  Undo,
  Redo,
  Stamp,
  Signature,
  Square,
  Circle,
  ArrowRight,
  Minus,
  Trash2,
  Layers,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  Palette,
  Move,
  MousePointer2,
  Sparkles,
  Wand2,
  Loader2,
  MessageSquare,
  Users
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import DropZone from '@/components/shared/DropZone';
import AIToolsPanel from '@/components/editor/AIToolsPanel';
import AdvancedToolbar from '@/components/editor/AdvancedToolbar';
import RealtimeEditor from '@/components/editor/RealtimeEditor';
import ReadAloud from '@/components/shared/ReadAloud';
import PDFChatAssistant from '@/components/ai/PDFChatAssistant';
import { useLanguage } from '@/components/shared/LanguageContext';
import { toast } from 'sonner';

const tools = [
  { id: 'select', icon: MousePointer2, label: 'Select', shortcut: 'V' },
  { id: 'text', icon: Type, label: 'Add Text', shortcut: 'T' },
  { id: 'image', icon: Image, label: 'Add Image', shortcut: 'I' },
  { id: 'draw', icon: PenTool, label: 'Draw', shortcut: 'D' },
  { id: 'highlight', icon: Highlighter, label: 'Highlight', shortcut: 'H' },
  { id: 'shape', icon: Shapes, label: 'Shapes', shortcut: 'S' },
  { id: 'stamp', icon: Stamp, label: 'Stamp', shortcut: 'P' },
  { id: 'signature', icon: Signature, label: 'Signature', shortcut: 'G' },
  { id: 'eraser', icon: Eraser, label: 'Eraser', shortcut: 'E' },
  { id: 'chat', icon: MessageSquare, label: 'AI Chat', shortcut: 'Q' },
  { id: 'ai', icon: Sparkles, label: 'AI Tools', shortcut: 'A' },
  { id: 'collab', icon: Users, label: 'Collaborate', shortcut: 'C' },
];

const shapes = [
  { id: 'rectangle', icon: Square, label: 'Rectangle' },
  { id: 'circle', icon: Circle, label: 'Circle' },
  { id: 'arrow', icon: ArrowRight, label: 'Arrow' },
  { id: 'line', icon: Minus, label: 'Line' },
];

const stamps = [
  { id: 'approved', label: 'APPROVED', color: 'text-emerald-500' },
  { id: 'rejected', label: 'REJECTED', color: 'text-red-500' },
  { id: 'draft', label: 'DRAFT', color: 'text-amber-500' },
  { id: 'confidential', label: 'CONFIDENTIAL', color: 'text-violet-500' },
  { id: 'final', label: 'FINAL', color: 'text-blue-500' },
];

const colors = [
  '#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4',
  '#3b82f6', '#8b5cf6', '#ec4899', '#000000', '#ffffff'
];

export default function PDFEditor({ theme = 'dark' }) {
  const { t } = useLanguage();
  const [uploadedFile, setUploadedFile] = useState(null);
  const [activeTool, setActiveTool] = useState('select');
  const [zoom, setZoom] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [elements, setElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [toolSettings, setToolSettings] = useState({
    color: '#3b82f6',
    fontSize: 16,
    strokeWidth: 2,
    opacity: 100,
    fontFamily: 'Arial',
    bold: false,
    italic: false,
    underline: false,
  });
  const [aiProcessing, setAiProcessing] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);

  const isDark = theme === 'dark';
  const queryClient = useQueryClient();

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setTotalPages(numPages);
    setPageLoading(false);
  };

  // Load document from URL parameter if present
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const documentId = urlParams.get('documentId');
    
    if (documentId && !uploadedFile) {
      base44.entities.Document.get(documentId)
        .then(doc => {
          if (doc) {
            setUploadedFile(doc);
            setElements([]);
            setHistory([]);
            setHistoryIndex(-1);
            setTotalPages(Math.floor(Math.random() * 10) + 1);
            toast.success('PDF loaded successfully');
          }
        })
        .catch(err => {
          console.error('Failed to load document:', err);
          toast.error('Failed to load document');
        });
    }
  }, []);

  const handleFileUploaded = async (fileData) => {
    const document = await base44.entities.Document.create(fileData);
    setUploadedFile({ ...fileData, id: document.id });
    setElements([]);
    setHistory([]);
    setHistoryIndex(-1);
    setTotalPages(Math.floor(Math.random() * 10) + 1);
    toast.success('PDF loaded successfully');
  };

  const addToHistory = (newElements) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push([...newElements]);
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

  const addElement = (type, data = {}) => {
    const newElement = {
      id: Date.now(),
      type,
      x: 100 + Math.random() * 200,
      y: 100 + Math.random() * 200,
      ...data,
      ...toolSettings,
    };
    const newElements = [...elements, newElement];
    setElements(newElements);
    addToHistory(newElements);
    setSelectedElement(newElement.id);
  };

  const deleteElement = (id) => {
    const newElements = elements.filter(el => el.id !== id);
    setElements(newElements);
    addToHistory(newElements);
    setSelectedElement(null);
  };

  const handleCanvasClick = (e) => {
    if (activeTool === 'text') {
      addElement('text', { content: 'Click to edit', width: 200, height: 30 });
    } else if (activeTool === 'shape') {
      addElement('shape', { shapeType: 'rectangle', width: 100, height: 80 });
    } else if (activeTool === 'highlight') {
      addElement('highlight', { width: 200, height: 30 });
    } else if (activeTool === 'stamp') {
      addElement('stamp', { stampType: 'approved' });
    } else if (activeTool === 'signature') {
      addElement('signature', { width: 150, height: 50 });
    }
  };

  const saveDocument = async () => {
    if (!uploadedFile) return;
    
    toast.promise(
      async () => {
        await base44.entities.Document.update(uploadedFile.id, {
          status: 'ready'
        });
        await base44.entities.ActivityLog.create({
          action: 'convert',
          document_id: uploadedFile.id,
          document_name: uploadedFile.name,
          details: { type: 'pdf_edit', elements_count: elements.length }
        });
      },
      {
        loading: 'Saving document...',
        success: 'Document saved successfully!',
        error: 'Failed to save document'
      }
    );
  };

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              PDF Editor
            </h1>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Advanced editing tools for your documents
            </p>
          </div>
          {uploadedFile && (
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={undo} disabled={historyIndex <= 0} className={isDark ? 'border-slate-700' : ''}>
                <Undo className="w-4 h-4" />
              </Button>
              <Button variant="outline" onClick={redo} disabled={historyIndex >= history.length - 1} className={isDark ? 'border-slate-700' : ''}>
                <Redo className="w-4 h-4" />
              </Button>
              <Button onClick={saveDocument} className="bg-gradient-to-r from-violet-500 to-cyan-500">
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          )}
        </div>
      </motion.div>

      {!uploadedFile ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 flex items-center justify-center"
        >
          <div className="max-w-xl w-full">
            <DropZone
              onFileUploaded={handleFileUploaded}
              acceptedTypes={['.pdf']}
              maxSize={50 * 1024 * 1024}
              isDark={isDark}
            />
          </div>
        </motion.div>
      ) : (
        <div className="flex-1 flex gap-4 overflow-hidden">
          {/* Left Toolbar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`w-16 rounded-2xl p-2 flex flex-col gap-1 ${isDark ? 'glass-light' : 'bg-white border border-slate-200 shadow-sm'}`}
          >
            {tools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                className={`p-3 rounded-xl transition-all ${
                  activeTool === tool.id
                    ? 'bg-violet-500 text-white'
                    : isDark
                      ? 'text-slate-400 hover:text-white hover:bg-slate-700'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                }`}
                title={`${tool.label} (${tool.shortcut})`}
              >
                <tool.icon className="w-5 h-5" />
              </button>
            ))}
          </motion.div>

          {/* Canvas Area */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col"
          >
            {/* Top Bar */}
            <div className={`rounded-t-2xl p-3 flex items-center justify-between ${isDark ? 'glass-light' : 'bg-white border border-slate-200 border-b-0'}`}>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={() => setZoom(Math.max(25, zoom - 25))} className={isDark ? 'text-slate-400' : ''}>
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  <span className={`text-sm min-w-[50px] text-center ${isDark ? 'text-white' : 'text-slate-900'}`}>{zoom}%</span>
                  <Button variant="ghost" size="icon" onClick={() => setZoom(Math.min(400, zoom + 25))} className={isDark ? 'text-slate-400' : ''}>
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className={isDark ? 'text-slate-400' : ''}>
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className={isDark ? 'text-slate-400' : ''}>
                    <RotateCw className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                  className={isDark ? 'text-slate-400' : ''}
                >
                  Previous
                </Button>
                <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Page {currentPage} of {totalPages}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                  className={isDark ? 'text-slate-400' : ''}
                >
                  Next
                </Button>
              </div>
            </div>

            {/* Canvas */}
            <div
              className={`flex-1 rounded-b-2xl overflow-auto ${isDark ? 'bg-slate-900/50' : 'bg-slate-100'} flex items-center justify-center`}
            >
              <div className="relative">
                {uploadedFile?.file_url && (
                  <Document
                    file={uploadedFile.file_url}
                    onLoadSuccess={onDocumentLoadSuccess}
                    loading={
                      <div className="flex items-center justify-center p-12">
                        <Loader2 className="w-8 h-8 animate-spin text-violet-400" />
                      </div>
                    }
                    error={
                      <div className="flex flex-col items-center justify-center p-12 text-red-400">
                        <FileText className="w-12 h-12 mb-2" />
                        <p>Failed to load PDF</p>
                      </div>
                    }
                  >
                    <div 
                      className="relative"
                      onClick={handleCanvasClick}
                      style={{ cursor: activeTool !== 'select' ? 'crosshair' : 'default' }}
                    >
                      <Page
                        pageNumber={currentPage}
                        scale={zoom / 100}
                        renderTextLayer={true}
                        renderAnnotationLayer={true}
                      />
                      
                      {/* Render Elements Overlay */}
                      <div className="absolute inset-0 pointer-events-none">
                        {elements.map((element) => (
                          <div
                            key={element.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedElement(element.id);
                            }}
                            className={`absolute cursor-move pointer-events-auto ${selectedElement === element.id ? 'ring-2 ring-violet-500' : ''}`}
                            style={{
                              left: element.x,
                              top: element.y,
                              opacity: element.opacity / 100,
                            }}
                          >
                            {element.type === 'text' && (
                              <div
                                contentEditable
                                suppressContentEditableWarning
                                className="outline-none min-w-[50px] p-1"
                                style={{
                                  color: element.color,
                                  fontSize: element.fontSize,
                                  fontFamily: element.fontFamily,
                                  fontWeight: element.bold ? 'bold' : 'normal',
                                  fontStyle: element.italic ? 'italic' : 'normal',
                                  textDecoration: element.underline ? 'underline' : 'none',
                                }}
                              >
                                {element.content}
                              </div>
                            )}
                            {element.type === 'shape' && (
                              <div
                                style={{
                                  width: element.width,
                                  height: element.height,
                                  border: `${element.strokeWidth}px solid ${element.color}`,
                                  borderRadius: element.shapeType === 'circle' ? '50%' : '4px',
                                }}
                              />
                            )}
                            {element.type === 'highlight' && (
                              <div
                                style={{
                                  width: element.width,
                                  height: element.height,
                                  backgroundColor: element.color,
                                  opacity: 0.3,
                                }}
                              />
                            )}
                            {element.type === 'stamp' && (
                              <div className={`px-4 py-2 border-2 ${stamps.find(s => s.id === element.stampType)?.color || 'text-slate-500'} font-bold text-lg transform -rotate-12`}>
                                {stamps.find(s => s.id === element.stampType)?.label || 'STAMP'}
                              </div>
                            )}
                            {element.type === 'signature' && (
                              <div className="italic text-2xl font-script text-slate-800" style={{ fontFamily: 'cursive' }}>
                                Signature
                              </div>
                            )}
                            {selectedElement === element.id && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteElement(element.id);
                                }}
                                className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </Document>
                )}
              </div>
            </div>
          </motion.div>

          {/* Right Panel - Properties */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`w-64 rounded-2xl p-4 overflow-y-auto ${isDark ? 'glass-light' : 'bg-white border border-slate-200 shadow-sm'}`}
          >
            <h3 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Properties</h3>

            <div className="space-y-4">
              {/* Color Picker */}
              <div>
                <Label className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Color</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setToolSettings({ ...toolSettings, color })}
                      className={`w-6 h-6 rounded-full ${toolSettings.color === color ? 'ring-2 ring-violet-500 ring-offset-2' : ''}`}
                      style={{ backgroundColor: color, border: color === '#ffffff' ? '1px solid #ccc' : 'none' }}
                    />
                  ))}
                </div>
              </div>

              {/* Font Size */}
              {(activeTool === 'text' || selectedElement) && (
                <div>
                  <Label className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Font Size: {toolSettings.fontSize}px</Label>
                  <Slider
                    value={[toolSettings.fontSize]}
                    onValueChange={([v]) => setToolSettings({ ...toolSettings, fontSize: v })}
                    min={8}
                    max={72}
                    className="mt-2"
                  />
                </div>
              )}

              {/* Stroke Width */}
              {(activeTool === 'draw' || activeTool === 'shape') && (
                <div>
                  <Label className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Stroke: {toolSettings.strokeWidth}px</Label>
                  <Slider
                    value={[toolSettings.strokeWidth]}
                    onValueChange={([v]) => setToolSettings({ ...toolSettings, strokeWidth: v })}
                    min={1}
                    max={10}
                    className="mt-2"
                  />
                </div>
              )}

              {/* Opacity */}
              <div>
                <Label className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Opacity: {toolSettings.opacity}%</Label>
                <Slider
                  value={[toolSettings.opacity]}
                  onValueChange={([v]) => setToolSettings({ ...toolSettings, opacity: v })}
                  min={10}
                  max={100}
                  className="mt-2"
                />
              </div>

              {/* Text Formatting */}
              {activeTool === 'text' && (
                <div>
                  <Label className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Formatting</Label>
                  <div className="flex gap-2 mt-2">
                    <Button
                      variant={toolSettings.bold ? 'default' : 'outline'}
                      size="icon"
                      onClick={() => setToolSettings({ ...toolSettings, bold: !toolSettings.bold })}
                      className={!toolSettings.bold && isDark ? 'border-slate-700' : ''}
                    >
                      <Bold className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={toolSettings.italic ? 'default' : 'outline'}
                      size="icon"
                      onClick={() => setToolSettings({ ...toolSettings, italic: !toolSettings.italic })}
                      className={!toolSettings.italic && isDark ? 'border-slate-700' : ''}
                    >
                      <Italic className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={toolSettings.underline ? 'default' : 'outline'}
                      size="icon"
                      onClick={() => setToolSettings({ ...toolSettings, underline: !toolSettings.underline })}
                      className={!toolSettings.underline && isDark ? 'border-slate-700' : ''}
                    >
                      <Underline className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Shape Selector */}
              {activeTool === 'shape' && (
                <div>
                  <Label className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Shape Type</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {shapes.map((shape) => (
                      <Button
                        key={shape.id}
                        variant="outline"
                        size="sm"
                        className={isDark ? 'border-slate-700' : ''}
                      >
                        <shape.icon className="w-4 h-4 mr-1" />
                        {shape.label}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Stamp Selector */}
              {activeTool === 'stamp' && (
                <div>
                  <Label className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Stamp Type</Label>
                  <div className="space-y-2 mt-2">
                    {stamps.map((stamp) => (
                      <Button
                        key={stamp.id}
                        variant="outline"
                        size="sm"
                        className={`w-full justify-start ${stamp.color} ${isDark ? 'border-slate-700' : ''}`}
                        onClick={() => addElement('stamp', { stampType: stamp.id })}
                      >
                        {stamp.label}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Chat */}
              {activeTool === 'chat' && uploadedFile && (
                <div>
                  <Label className={`text-sm mb-2 block ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    AI Chat Assistant
                  </Label>
                  <div className="max-h-[400px] overflow-y-auto">
                    <PDFChatAssistant document={uploadedFile} isDark={isDark} />
                  </div>
                </div>
              )}

              {/* AI Tools */}
              {activeTool === 'ai' && (
                <AIToolsPanel
                  isDark={isDark}
                  elements={elements}
                  onAddElement={addElement}
                  onSuggestionsReady={setAiSuggestion}
                />
              )}

              {/* Collaboration */}
              {activeTool === 'collab' && uploadedFile && (
                <div>
                  <Label className={`text-sm mb-2 block ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Real-time Collaboration
                  </Label>
                  <RealtimeEditor documentId={uploadedFile.id} isDark={isDark} />
                </div>
              )}

              {/* Read Aloud for selected text */}
              {selectedElement && elements.find(e => e.id === selectedElement)?.type === 'text' && (
                <div className="mt-4 pt-4 border-t border-slate-700">
                  <Label className={`text-sm mb-2 block ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Read Selected Text
                  </Label>
                  <ReadAloud 
                    text={elements.find(e => e.id === selectedElement)?.content || ''} 
                    isDark={isDark} 
                  />
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}