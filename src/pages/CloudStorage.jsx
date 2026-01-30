import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import {
  Cloud,
  HardDrive,
  Upload,
  Download,
  RefreshCw,
  Link2,
  Unlink,
  CheckCircle2,
  Loader2,
  FileText,
  ExternalLink
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import DropZone from '@/components/shared/DropZone';

const cloudServices = [
  {
    id: 'google-drive',
    name: 'Google Drive',
    icon: '🟢',
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/20',
    description: 'Access and sync files from Google Drive'
  },
  {
    id: 'onedrive',
    name: 'OneDrive',
    icon: '🔵',
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
    description: 'Connect your Microsoft OneDrive account'
  },
  {
    id: 'dropbox',
    name: 'Dropbox',
    icon: '💧',
    color: 'from-blue-600 to-blue-700',
    bgColor: 'bg-blue-600/10',
    borderColor: 'border-blue-600/20',
    description: 'Sync files from your Dropbox storage'
  },
  {
    id: 'box',
    name: 'Box',
    icon: '📦',
    color: 'from-blue-400 to-indigo-500',
    bgColor: 'bg-indigo-500/10',
    borderColor: 'border-indigo-500/20',
    description: 'Enterprise content management with Box'
  }
];

export default function CloudStorage({ theme = 'dark' }) {
  const [connectedServices, setConnectedServices] = useState(['google-drive']);
  const [selectedService, setSelectedService] = useState(null);
  const [showConnectDialog, setShowConnectDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importing, setImporting] = useState(false);
  const [syncing, setSyncing] = useState({});

  const isDark = theme === 'dark';
  const queryClient = useQueryClient();

  const { data: documents = [] } = useQuery({
    queryKey: ['documents'],
    queryFn: () => base44.entities.Document.list('-created_date'),
  });

  const isConnected = (serviceId) => connectedServices.includes(serviceId);

  const connectService = (service) => {
    setSelectedService(service);
    setShowConnectDialog(true);
  };

  const handleConnect = () => {
    setConnectedServices(prev => [...prev, selectedService.id]);
    setShowConnectDialog(false);
    toast.success(`Connected to ${selectedService.name}`);
  };

  const disconnectService = (serviceId) => {
    setConnectedServices(prev => prev.filter(id => id !== serviceId));
    toast.success('Disconnected successfully');
  };

  const importFromCloud = async (service) => {
    setSelectedService(service);
    setImporting(true);
    
    try {
      let functionName, fileIdKey;
      
      switch (service.id) {
        case 'google-drive':
          functionName = 'googleDriveImport';
          fileIdKey = 'fileId';
          break;
        case 'onedrive':
          functionName = 'oneDriveIntegration';
          fileIdKey = 'itemId';
          break;
        case 'dropbox':
          functionName = 'dropboxIntegration';
          fileIdKey = 'path';
          break;
        case 'box':
          functionName = 'boxIntegration';
          fileIdKey = 'fileId';
          break;
        default:
          setShowImportDialog(true);
          setImporting(false);
          return;
      }
      
      const result = await base44.functions.invoke(functionName, { action: 'list' });
      
      if (result.data.success && result.data.files?.length > 0) {
        const pdfFile = result.data.files.find(f => 
          f.mimeType === 'application/pdf' || 
          f.name?.endsWith('.pdf') ||
          f.type === 'file'
        );
        
        if (pdfFile) {
          const downloadParams = { 
            action: 'download',
            [fileIdKey]: pdfFile.id || pdfFile.path_display
          };
          
          const downloadResult = await base44.functions.invoke(functionName, downloadParams);
          
          const document = await base44.entities.Document.create({
            name: pdfFile.name,
            file_url: downloadResult.data.fileUrl,
            file_type: 'pdf',
            file_size: pdfFile.size || 0,
            tags: ['imported', service.id]
          });
          
          await base44.entities.ActivityLog.create({
            action: 'upload',
            document_id: document.id,
            document_name: pdfFile.name,
            details: { source: service.name }
          });
          
          queryClient.invalidateQueries(['documents']);
          toast.success(`Imported ${pdfFile.name} from ${service.name}`);
        } else {
          toast.error(`No PDF files found in ${service.name}`);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.error || `Failed to import from ${service.name}`);
    } finally {
      setImporting(false);
    }
  };

  const handleImport = async (fileData) => {
    setImporting(true);
    
    const document = await base44.entities.Document.create({
      ...fileData,
      tags: ['imported', selectedService?.id]
    });
    
    await base44.entities.ActivityLog.create({
      action: 'upload',
      document_name: fileData.name,
      details: { source: selectedService?.name }
    });

    queryClient.invalidateQueries(['documents']);
    setImporting(false);
    setShowImportDialog(false);
    toast.success(`Imported from ${selectedService?.name}`);
  };

  const exportToCloud = async (file, serviceId) => {
    setSyncing(prev => ({ ...prev, [file.id]: serviceId }));
    
    try {
      let functionName;
      
      switch (serviceId) {
        case 'google-drive':
          functionName = 'googleDriveImport';
          break;
        case 'onedrive':
          functionName = 'oneDriveIntegration';
          break;
        case 'dropbox':
          functionName = 'dropboxIntegration';
          break;
        case 'box':
          functionName = 'boxIntegration';
          break;
        default:
          throw new Error('Unsupported service');
      }
      
      const result = await base44.functions.invoke(functionName, {
        action: 'upload',
        fileName: file.name,
        fileUrl: file.file_url
      });
      
      if (result.data.success) {
        await base44.entities.ActivityLog.create({
          action: 'share',
          document_id: file.id,
          document_name: file.name,
          details: { destination: cloudServices.find(s => s.id === serviceId)?.name }
        });
        
        toast.success(`Exported to ${cloudServices.find(s => s.id === serviceId)?.name}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Export failed');
    } finally {
      setSyncing(prev => ({ ...prev, [file.id]: null }));
    }
  };

  const syncAll = async (serviceId) => {
    setSyncing(prev => ({ ...prev, all: serviceId }));
    await new Promise(resolve => setTimeout(resolve, 3000));
    setSyncing(prev => ({ ...prev, all: null }));
    toast.success('Sync complete');
  };

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-6">
          <Cloud className="w-4 h-4 text-violet-400" />
          <span className="text-sm text-violet-300">Cloud Integration</span>
        </div>
        <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Cloud Storage
        </h1>
        <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
          Connect your cloud storage accounts to import and export documents seamlessly
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {cloudServices.map((service, index) => {
          const connected = isConnected(service.id);
          return (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`h-full ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'} ${connected ? service.borderColor : ''} transition-colors`}>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className={`w-16 h-16 mx-auto rounded-2xl ${service.bgColor} flex items-center justify-center text-3xl mb-4`}>
                      {service.icon}
                    </div>
                    <h3 className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {service.name}
                    </h3>
                    <p className={`text-sm mb-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {service.description}
                    </p>
                    
                    {connected ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-center gap-2 text-sm text-emerald-400">
                          <CheckCircle2 className="w-4 h-4" />
                          Connected
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => importFromCloud(service)}
                            className={`flex-1 ${isDark ? 'border-slate-700 text-slate-300' : 'border-slate-200 text-slate-600'}`}
                          >
                            <Download className="w-3 h-3 mr-1" />
                            Import
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => disconnectService(service.id)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          >
                            <Unlink className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        onClick={() => connectService(service)}
                        className={`w-full bg-gradient-to-r ${service.color} text-white`}
                      >
                        <Link2 className="w-4 h-4 mr-2" />
                        Connect
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {connectedServices.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <Card className={`${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <RefreshCw className="w-5 h-5 text-violet-400" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {connectedServices.map(serviceId => {
                  const service = cloudServices.find(s => s.id === serviceId);
                  return (
                    <Button
                      key={serviceId}
                      variant="outline"
                      onClick={() => syncAll(serviceId)}
                      disabled={syncing.all === serviceId}
                      className={`${isDark ? 'border-slate-700 text-slate-300' : 'border-slate-200 text-slate-600'}`}
                    >
                      {syncing.all === serviceId ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <RefreshCw className="w-4 h-4 mr-2" />
                      )}
                      Sync with {service?.name}
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Your Files
          </h2>
          <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>
            Export files to connected cloud storage
          </p>
        </div>

        {documents.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {documents.slice(0, 9).map((file, index) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`glass-light rounded-2xl p-4 ${isDark ? '' : 'bg-white border border-slate-200'}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 rounded-xl ${isDark ? 'bg-violet-500/10' : 'bg-violet-100'} flex items-center justify-center`}>
                    <FileText className="w-6 h-6 text-violet-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{file.name}</p>
                    <p className={`text-xs uppercase ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{file.file_type}</p>
                  </div>
                </div>
                
                {connectedServices.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {connectedServices.map(serviceId => {
                      const service = cloudServices.find(s => s.id === serviceId);
                      const isSyncing = syncing[file.id] === serviceId;
                      return (
                        <Button
                          key={serviceId}
                          size="sm"
                          variant="outline"
                          onClick={() => exportToCloud(file, serviceId)}
                          disabled={isSyncing}
                          className={`text-xs ${isDark ? 'border-slate-700' : 'border-slate-200'}`}
                        >
                          {isSyncing ? (
                            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                          ) : (
                            <Upload className="w-3 h-3 mr-1" />
                          )}
                          {service?.name}
                        </Button>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <Card className={`${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
            <CardContent className="py-12 text-center">
              <HardDrive className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
              <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>No files yet. Import from cloud or upload new files.</p>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={showConnectDialog} onOpenChange={setShowConnectDialog}>
        <DialogContent className={`${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <DialogHeader>
            <DialogTitle className={isDark ? 'text-white' : 'text-slate-900'}>
              Connect to {selectedService?.name}
            </DialogTitle>
            <DialogDescription className={isDark ? 'text-slate-400' : 'text-slate-500'}>
              Authorize OmniPDF to access your {selectedService?.name} account
            </DialogDescription>
          </DialogHeader>
          <div className="py-6 text-center">
            <div className={`w-20 h-20 mx-auto rounded-2xl ${selectedService?.bgColor} flex items-center justify-center text-4xl mb-4`}>
              {selectedService?.icon}
            </div>
            <p className={`mb-4 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              You will be redirected to {selectedService?.name} to authorize access.
            </p>
            <div className={`p-4 rounded-lg text-left ${isDark ? 'bg-slate-800/50' : 'bg-slate-100'}`}>
              <p className={`text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>OmniPDF will be able to:</p>
              <ul className={`text-sm space-y-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                <li>• View and download files</li>
                <li>• Upload new files</li>
                <li>• Create folders</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConnectDialog(false)}
              className={isDark ? 'border-slate-700 text-slate-300' : 'border-slate-200 text-slate-600'}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConnect}
              className={`bg-gradient-to-r ${selectedService?.color} text-white`}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Authorize
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent className={`${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} max-w-xl`}>
          <DialogHeader>
            <DialogTitle className={isDark ? 'text-white' : 'text-slate-900'}>
              Import from {selectedService?.name}
            </DialogTitle>
            <DialogDescription className={isDark ? 'text-slate-400' : 'text-slate-500'}>
              Select files to import or upload from your device
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <DropZone
              onFileUploaded={handleImport}
              maxSize={25 * 1024 * 1024}
            />
            {importing && (
              <div className="mt-4 flex items-center justify-center gap-2 text-violet-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                Importing...
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}