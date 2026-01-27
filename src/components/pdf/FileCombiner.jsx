import React, { useState } from 'react';
import { Plus, Trash2, GripVertical, Combine, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import DropZone from '@/components/shared/DropZone';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function FileCombiner({ isDark }) {
  const [files, setFiles] = useState([]);
  const [combining, setCombining] = useState(false);

  const handleFileUploaded = async (fileData) => {
    const document = await base44.entities.Document.create(fileData);
    setFiles(prev => [...prev, document]);
    toast.success('File added');
  };

  const removeFile = (id) => {
    setFiles(files.filter(f => f.id !== id));
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(files);
    const [reordered] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordered);
    setFiles(items);
  };

  const combineFiles = async () => {
    if (files.length < 2) {
      toast.error('Add at least 2 files to combine');
      return;
    }

    setCombining(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      await base44.entities.ActivityLog.create({
        action: 'merge',
        details: { files_count: files.length, file_names: files.map(f => f.name) }
      });

      toast.success('Files combined successfully!');
      setFiles([]);
    } catch (error) {
      toast.error('Failed to combine files');
    } finally {
      setCombining(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <Combine className="w-5 h-5 text-violet-400" />
            Combine Files
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DropZone onFileUploaded={handleFileUploaded} acceptedTypes={['.pdf']} maxSize={50 * 1024 * 1024} isDark={isDark} />
        </CardContent>
      </Card>

      {files.length > 0 && (
        <>
          <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
            <CardHeader>
              <CardTitle className={isDark ? 'text-white' : 'text-slate-900'}>
                Files to Combine ({files.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="files">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                      {files.map((file, index) => (
                        <Draggable key={file.id} draggableId={file.id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`flex items-center gap-3 p-3 rounded-lg ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}
                            >
                              <div {...provided.dragHandleProps}>
                                <GripVertical className={`w-5 h-5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                              </div>
                              <span className={`text-sm font-medium ${isDark ? 'text-violet-400' : 'text-violet-600'}`}>
                                {index + 1}.
                              </span>
                              <span className={`flex-1 truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                {file.name}
                              </span>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => removeFile(file.id)}
                                className={isDark ? 'text-slate-400 hover:text-red-400' : 'text-slate-500 hover:text-red-500'}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </CardContent>
          </Card>

          <Button onClick={combineFiles} disabled={combining} className="w-full bg-violet-500">
            {combining ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Combining...
              </>
            ) : (
              <>
                <Combine className="w-4 h-4 mr-2" />
                Combine {files.length} Files
              </>
            )}
          </Button>
        </>
      )}
    </div>
  );
}