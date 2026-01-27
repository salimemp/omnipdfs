import React, { useState } from 'react';
import { Ruler, Move, Maximize2, Grid, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function MeasurementTools({ isDark }) {
  const [activeTool, setActiveTool] = useState('distance');
  const [unit, setUnit] = useState('mm');
  const [measurements, setMeasurements] = useState([
    { id: 1, type: 'distance', value: 150, unit: 'mm', label: 'Width' },
    { id: 2, type: 'area', value: 225, unit: 'cm²', label: 'Section A' },
  ]);
  const [scale, setScale] = useState('1:1');

  const tools = [
    { id: 'distance', icon: Ruler, label: 'Distance' },
    { id: 'area', icon: Grid, label: 'Area' },
    { id: 'perimeter', icon: Maximize2, label: 'Perimeter' },
  ];

  const units = ['mm', 'cm', 'in', 'pt', 'px'];
  const scales = ['1:1', '1:2', '1:10', '1:100', 'Custom'];

  return (
    <div className="space-y-4">
      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <Ruler className="w-5 h-5 text-violet-400" />
            Measurement Tools
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            {tools.map(tool => (
              <Button
                key={tool.id}
                variant={activeTool === tool.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTool(tool.id)}
                className={activeTool === tool.id ? 'bg-violet-500' : ''}
              >
                <tool.icon className="w-4 h-4 mr-1" />
                {tool.label}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Unit</Label>
              <Select value={unit} onValueChange={setUnit}>
                <SelectTrigger className={`h-9 ${isDark ? 'bg-slate-800 border-slate-700' : ''}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {units.map(u => (
                    <SelectItem key={u} value={u}>{u}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Scale</Label>
              <Select value={scale} onValueChange={setScale}>
                <SelectTrigger className={`h-9 ${isDark ? 'bg-slate-800 border-slate-700' : ''}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {scales.map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {scale === 'Custom' && (
            <Input
              placeholder="Enter custom scale (e.g., 1:50)"
              className={isDark ? 'bg-slate-800 border-slate-700' : ''}
            />
          )}

          <div className={`p-3 rounded-lg ${isDark ? 'bg-violet-500/10 border border-violet-500/20' : 'bg-violet-50 border border-violet-200'}`}>
            <p className={`text-sm ${isDark ? 'text-violet-300' : 'text-violet-700'}`}>
              Click on the PDF to start measuring {activeTool}
            </p>
          </div>
        </CardContent>
      </Card>

      {measurements.length > 0 && (
        <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <Calculator className="w-5 h-5 text-violet-400" />
              Measurements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {measurements.map(m => (
              <div key={m.id} className={`flex items-center justify-between p-2 rounded-lg ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                <div>
                  <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {m.label}
                  </p>
                  <Badge variant="outline" className="text-xs mt-1">
                    {m.type}
                  </Badge>
                </div>
                <p className={`text-lg font-bold ${isDark ? 'text-violet-400' : 'text-violet-600'}`}>
                  {m.value} {m.unit}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}