import React, { useState } from 'react';
import { Folder, FileText, Download, Upload, RefreshCw, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function CloudFileBrowser({ provider, isDark }) {
  const [currentPath, setCurrentPath] = useState('/');
  const [files, setFiles] = useState([
    { id: 1, name: 'Documents', type: 'folder', size: null, modified: new Date() },
    { id: 2, name: 'Contract.pdf', type: 'file', size: '2.4 MB', modified: new Date() },
    { id: 3, name: 'Invoice.pdf', type: 'file', size: '1.2 MB', modified: new Date() },
  ]);

  const importFile = (file) => {
    toast.success(`Importing ${file.name}...`);
  };

  return (
    <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={isDark ? 'text-white' : 'text-slate-900'}>{provider}</span>
            <ChevronRight className="w-4 h-4" />
            <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{currentPath}</span>
          </div>
          <Button size="icon" variant="ghost">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {files.map(file => (
            <div
              key={file.id}
              className={`flex items-center justify-between p-3 rounded-lg ${isDark ? 'bg-slate-800/50 hover:bg-slate-800' : 'bg-slate-50 hover:bg-slate-100'} transition-colors`}
            >
              <div className="flex items-center gap-3">
                {file.type === 'folder' ? (
                  <Folder className="w-5 h-5 text-blue-400" />
                ) : (
                  <FileText className="w-5 h-5 text-red-400" />
                )}
                <div>
                  <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{file.name}</p>
                  {file.size && (
                    <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{file.size}</p>
                  )}
                </div>
              </div>
              {file.type === 'file' && (
                <Button size="sm" onClick={() => importFile(file)} className="bg-violet-500">
                  <Upload className="w-4 h-4 mr-2" />
                  Import
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}