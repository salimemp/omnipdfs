import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Cloud, Upload, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function ServiceSync({ documentId, isDark = true }) {
  const [selectedService, setSelectedService] = useState('');
  const [syncing, setSyncing] = useState(false);

  const services = [
    { id: 'googledrive', name: 'Google Drive', color: 'from-blue-500 to-green-500' },
    { id: 'dropbox', name: 'Dropbox', color: 'from-blue-600 to-blue-400' },
    { id: 'onedrive', name: 'OneDrive', color: 'from-blue-500 to-sky-400' },
    { id: 'box', name: 'Box', color: 'from-blue-600 to-indigo-500' }
  ];

  const syncToService = async () => {
    if (!selectedService || !documentId) {
      toast.error('Please select a service');
      return;
    }

    try {
      setSyncing(true);
      const response = await base44.functions.invoke('externalServiceIntegration', {
        action: 'sync_to_service',
        service: selectedService,
        data: { documentId }
      });

      if (response.data.success) {
        toast.success(`Document synced to ${services.find(s => s.id === selectedService)?.name}`);
      }
    } catch (error) {
      toast.error('Sync failed');
      console.error(error);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white'}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cloud className="w-5 h-5 text-cyan-400" />
          External Service Sync
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select value={selectedService} onValueChange={setSelectedService}>
          <SelectTrigger>
            <SelectValue placeholder="Select service..." />
          </SelectTrigger>
          <SelectContent>
            {services.map(service => (
              <SelectItem key={service.id} value={service.id}>
                {service.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          onClick={syncToService}
          disabled={!selectedService || syncing}
          className="w-full bg-gradient-to-r from-violet-500 to-cyan-500"
        >
          {syncing ? (
            <>
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
              Syncing...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Sync to {selectedService ? services.find(s => s.id === selectedService)?.name : 'Service'}
            </>
          )}
        </Button>

        <div className="grid grid-cols-2 gap-2 pt-4">
          {services.map(service => (
            <motion.div
              key={service.id}
              whileHover={{ scale: 1.05 }}
              className={`p-3 rounded-lg bg-gradient-to-r ${service.color} cursor-pointer`}
              onClick={() => setSelectedService(service.id)}
            >
              <p className="text-white text-sm font-medium text-center">
                {service.name}
              </p>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}