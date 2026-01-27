import React, { useState } from 'react';
import { GripVertical, Trash2, Copy, RotateCw, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Checkbox } from '@/components/ui/checkbox';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function PageOrganizer({ document, isDark }) {
  const [pages, setPages] = useState([
    { id: 1, number: 1, thumbnail: '', rotation: 0, selected: false },
    { id: 2, number: 2, thumbnail: '', rotation: 0, selected: false },
    { id: 3, number: 3, thumbnail: '', rotation: 0, selected: false },
    { id: 4, number: 4, thumbnail: '', rotation: 0, selected: false },
  ]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(pages);
    const [reordered] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordered);
    setPages(items.map((p, i) => ({ ...p, number: i + 1 })));
  };

  const deletePage = (id) => {
    setPages(pages.filter(p => p.id !== id).map((p, i) => ({ ...p, number: i + 1 })));
    toast.success('Page deleted');
  };

  const duplicatePage = (id) => {
    const page = pages.find(p => p.id === id);
    const newPage = { ...page, id: Date.now() };
    const index = pages.findIndex(p => p.id === id);
    const newPages = [...pages.slice(0, index + 1), newPage, ...pages.slice(index + 1)];
    setPages(newPages.map((p, i) => ({ ...p, number: i + 1 })));
    toast.success('Page duplicated');
  };

  const rotatePage = (id) => {
    setPages(pages.map(p => p.id === id ? { ...p, rotation: (p.rotation + 90) % 360 } : p));
  };

  const toggleSelection = (id) => {
    setPages(pages.map(p => p.id === id ? { ...p, selected: !p.selected } : p));
  };

  const deleteSelected = () => {
    setPages(pages.filter(p => !p.selected).map((p, i) => ({ ...p, number: i + 1 })));
    toast.success('Selected pages deleted');
  };

  const saveChanges = async () => {
    await base44.entities.ActivityLog.create({
      action: 'convert',
      document_id: document?.id,
      details: { type: 'pages_organized', total_pages: pages.length }
    });
    toast.success('Page organization saved');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Organize Pages ({pages.length})
        </h3>
        <div className="flex gap-2">
          {pages.some(p => p.selected) && (
            <Button size="sm" variant="outline" onClick={deleteSelected} className="text-red-400">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Selected
            </Button>
          )}
          <Button size="sm" onClick={saveChanges} className="bg-violet-500">
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="pages" direction="horizontal">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              {pages.map((page, index) => (
                <Draggable key={page.id} draggableId={String(page.id)} index={index}>
                  {(provided) => (
                    <Card
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'} ${page.selected ? 'ring-2 ring-violet-500' : ''}`}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between mb-2">
                          <Checkbox checked={page.selected} onCheckedChange={() => toggleSelection(page.id)} />
                          <div {...provided.dragHandleProps}>
                            <GripVertical className={`w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                          </div>
                        </div>
                        <div
                          className={`aspect-[8.5/11] rounded-lg mb-2 flex items-center justify-center ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}
                          style={{ transform: `rotate(${page.rotation}deg)` }}
                        >
                          <span className={`text-4xl font-bold ${isDark ? 'text-slate-600' : 'text-slate-300'}`}>
                            {page.number}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-1">
                          <Button size="icon" variant="ghost" onClick={() => rotatePage(page.id)} className="h-7 w-7">
                            <RotateCw className="w-3 h-3" />
                          </Button>
                          <Button size="icon" variant="ghost" onClick={() => duplicatePage(page.id)} className="h-7 w-7">
                            <Copy className="w-3 h-3" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => deletePage(page.id)}
                            className="h-7 w-7 text-red-400"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}