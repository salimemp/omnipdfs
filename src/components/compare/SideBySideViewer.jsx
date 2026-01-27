import React, { useState } from 'react';
import { ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';

export default function SideBySideViewer({ doc1, doc2, isDark }) {
  const [zoom, setZoom] = useState(100);
  const [page, setPage] = useState(1);
  const [syncScroll, setSyncScroll] = useState(true);

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className={`flex items-center justify-between p-4 rounded-xl ${isDark ? 'bg-slate-900/50 border border-slate-800' : 'bg-white border border-slate-200'}`}>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => setPage(Math.max(1, page - 1))}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            Page {page}
          </span>
          <Button size="sm" variant="outline" onClick={() => setPage(page + 1)}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <Button size="sm" variant="outline" onClick={() => setZoom(Math.max(50, zoom - 10))}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Slider
            value={[zoom]}
            onValueChange={(v) => setZoom(v[0])}
            min={50}
            max={200}
            step={10}
            className="w-32"
          />
          <Button size="sm" variant="outline" onClick={() => setZoom(Math.min(200, zoom + 10))}>
            <ZoomIn className="w-4 h-4" />
          </Button>
          <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            {zoom}%
          </span>
        </div>

        <Button size="sm" variant="outline">
          <Maximize2 className="w-4 h-4 mr-2" />
          Fullscreen
        </Button>
      </div>

      {/* Side-by-Side View */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
          <CardContent className="p-4">
            <div className={`text-sm font-medium mb-2 ${isDark ? 'text-violet-400' : 'text-violet-600'}`}>
              Original Document
            </div>
            <div 
              className={`aspect-[8.5/11] rounded-lg overflow-auto ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}
              style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left' }}
            >
              {doc1?.file_url ? (
                <iframe
                  src={doc1.file_url}
                  className="w-full h-full border-0"
                  title="Document 1"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className={isDark ? 'text-slate-500' : 'text-slate-400'}>No document loaded</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
          <CardContent className="p-4">
            <div className={`text-sm font-medium mb-2 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
              Comparison Document
            </div>
            <div 
              className={`aspect-[8.5/11] rounded-lg overflow-auto ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}
              style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left' }}
            >
              {doc2?.file_url ? (
                <iframe
                  src={doc2.file_url}
                  className="w-full h-full border-0"
                  title="Document 2"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className={isDark ? 'text-slate-500' : 'text-slate-400'}>No document loaded</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}