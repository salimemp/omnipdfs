import React, { useState } from 'react';
import { Shield, Lock, FileCheck, Key, Eye, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/components/shared/LanguageContext';
import AdvancedSecurity from '@/components/security/AdvancedSecurity';
import SecurityDashboard from '@/components/security/SecurityDashboard';
import EnhancedCollaboration from '@/components/collab/EnhancedCollaboration';
import DropZone from '@/components/shared/DropZone';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';

export default function Security({ theme = 'dark' }) {
  const { t } = useLanguage();
  const [uploadedFile, setUploadedFile] = useState(null);
  const [activeTab, setActiveTab] = useState('security');
  const [securityTab, setSecurityTab] = useState('dashboard');
  const isDark = theme === 'dark';

  const handleFileUploaded = async (fileData) => {
    const document = await base44.entities.Document.create(fileData);
    setUploadedFile(document);
  };

  const securityFeatures = [
    { icon: Lock, title: t('passwordProtect'), desc: 'Protect with strong passwords', color: 'violet' },
    { icon: Key, title: t('encryption'), desc: 'Military-grade AES-256 encryption', color: 'blue' },
    { icon: FileCheck, title: t('watermark'), desc: 'Add visible protection', color: 'emerald' },
    { icon: Eye, title: t('permissions'), desc: 'Control access rights', color: 'amber' },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${isDark ? 'bg-violet-500/10' : 'bg-violet-100'} border border-violet-500/20 mb-6`}>
          <Shield className="w-4 h-4 text-violet-400" />
          <span className={`text-sm ${isDark ? 'text-violet-300' : 'text-violet-600'}`}>Enterprise-Grade Security</span>
        </div>
        <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Advanced {t('security')} & Protection
        </h1>
        <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
          Secure your documents with military-grade encryption and access control
        </p>
      </motion.div>

      {!uploadedFile ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {t('uploadDocument')}
              </CardTitle>
              <CardDescription className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                Upload a document to apply security features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DropZone onFileUploaded={handleFileUploaded} maxSize={50 * 1024 * 1024} />
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {securityFeatures.map((feature, i) => (
              <Card key={i} className={`${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'} hover:shadow-lg transition-all`}>
                <CardContent className="pt-6">
                  <div className={`w-12 h-12 rounded-xl bg-${feature.color}-500/20 flex items-center justify-center mb-4`}>
                    <feature.icon className={`w-6 h-6 text-${feature.color}-400`} />
                  </div>
                  <h3 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{feature.title}</h3>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex gap-2 mb-6">
            <Button
              onClick={() => setActiveTab('security')}
              variant={activeTab === 'security' ? 'default' : 'outline'}
              className={activeTab === 'security' ? 'bg-gradient-to-r from-violet-500 to-purple-500' : ''}
            >
              <Shield className="w-4 h-4 mr-2" />
              {t('security')}
            </Button>
            <Button
              onClick={() => setActiveTab('collaboration')}
              variant={activeTab === 'collaboration' ? 'default' : 'outline'}
              className={activeTab === 'collaboration' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : ''}
            >
              <Shield className="w-4 h-4 mr-2" />
              {t('collaboration')}
            </Button>
          </div>

          {activeTab === 'security' ? (
            <Tabs value={securityTab} onValueChange={setSecurityTab} className="space-y-6">
              <TabsList className={`grid grid-cols-2 ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'} border`}>
                <TabsTrigger value="dashboard">Security Dashboard</TabsTrigger>
                <TabsTrigger value="advanced">Document Security</TabsTrigger>
              </TabsList>

              <TabsContent value="dashboard">
                <SecurityDashboard isDark={isDark} />
              </TabsContent>

              <TabsContent value="advanced">
                <AdvancedSecurity document={uploadedFile} isDark={isDark} />
              </TabsContent>
            </Tabs>
          ) : (
            <EnhancedCollaboration document={uploadedFile} isDark={isDark} />
          )}

          <Button
            variant="outline"
            onClick={() => setUploadedFile(null)}
            className={`w-full ${isDark ? 'border-slate-700' : 'border-slate-200'}`}
          >
            Upload Different Document
          </Button>
        </motion.div>
      )}
    </div>
  );
}