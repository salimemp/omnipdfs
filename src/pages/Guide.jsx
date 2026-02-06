import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Zap,
  FileText,
  Upload,
  Layers,
  Users,
  Sparkles,
  Shield,
  Cloud,
  Search,
  Settings,
  CheckCircle2,
  ArrowRight,
  PlayCircle,
  Bot,
  Wand2,
  FileOutput,
  PenTool,
  LayoutTemplate,
  GitCompare,
  ScanText,
  Download,
  Share2,
  Lock,
  Brain,
  ChevronRight,
  HelpCircle
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import OnboardingVideo from '@/components/shared/OnboardingVideo';

const guides = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: PlayCircle,
    color: 'from-violet-500 to-purple-600',
    steps: [
      {
        title: 'Create Your Account',
        description: 'Sign up in seconds with your email. No credit card required.',
        icon: Users,
        illustration: '👤'
      },
      {
        title: 'Upload Your First Document',
        description: 'Drag and drop any file or click to browse. Supports 50+ formats.',
        icon: Upload,
        illustration: '📁'
      },
      {
        title: 'Convert or Edit',
        description: 'Choose from powerful conversion, editing, or AI tools.',
        icon: Zap,
        illustration: '⚡'
      },
      {
        title: 'Download & Share',
        description: 'Get your processed file instantly or share with your team.',
        icon: Download,
        illustration: '💾'
      }
    ]
  },
  {
    id: 'conversion',
    title: 'File Conversion',
    icon: FileOutput,
    color: 'from-cyan-500 to-blue-600',
    steps: [
      {
        title: 'Select Source Format',
        description: 'Upload your file. We automatically detect the format.',
        icon: Upload,
        illustration: '📄'
      },
      {
        title: 'Choose Target Format',
        description: 'Pick from PDF, Word, Excel, PowerPoint, Images, and more.',
        icon: FileText,
        illustration: '🔄'
      },
      {
        title: 'Adjust Quality Settings',
        description: 'Customize resolution, compression, and OCR options.',
        icon: Settings,
        illustration: '⚙️'
      },
      {
        title: 'Convert & Download',
        description: 'Processing takes seconds. Download or save to cloud.',
        icon: CheckCircle2,
        illustration: '✅'
      }
    ]
  },
  {
    id: 'editing',
    title: 'PDF Editing',
    icon: PenTool,
    color: 'from-emerald-500 to-green-600',
    steps: [
      {
        title: 'Open PDF Editor',
        description: 'Upload your PDF and open in our advanced editor.',
        icon: FileText,
        illustration: '📝'
      },
      {
        title: 'Add Elements',
        description: 'Insert text, images, shapes, signatures, and stamps.',
        icon: Layers,
        illustration: '🎨'
      },
      {
        title: 'Use AI Tools',
        description: 'Let AI suggest improvements, detect issues, and optimize.',
        icon: Brain,
        illustration: '🤖'
      },
      {
        title: 'Save & Export',
        description: 'Save changes and export to various formats.',
        icon: Download,
        illustration: '💾'
      }
    ]
  },
  {
    id: 'ai-features',
    title: 'AI Features',
    icon: Sparkles,
    color: 'from-pink-500 to-rose-600',
    steps: [
      {
        title: 'AI Summarization',
        description: 'Get instant summaries of long documents with key points.',
        icon: Brain,
        illustration: '📊'
      },
      {
        title: 'Smart Translation',
        description: 'Translate to 50+ languages while preserving formatting.',
        icon: Wand2,
        illustration: '🌍'
      },
      {
        title: 'Auto-Tagging',
        description: 'AI automatically categorizes and tags your documents.',
        icon: Bot,
        illustration: '🏷️'
      },
      {
        title: 'Document Analysis',
        description: 'Deep analysis for readability, compliance, and quality.',
        icon: FileText,
        illustration: '🔍'
      }
    ]
  },
  {
    id: 'collaboration',
    title: 'Team Collaboration',
    icon: Users,
    color: 'from-amber-500 to-orange-600',
    steps: [
      {
        title: 'Invite Team Members',
        description: 'Share documents and invite collaborators by email.',
        icon: Users,
        illustration: '👥'
      },
      {
        title: 'Real-Time Editing',
        description: 'See changes instantly as team members edit.',
        icon: PenTool,
        illustration: '✏️'
      },
      {
        title: 'Comments & Chat',
        description: 'Discuss changes with inline comments and live chat.',
        icon: Users,
        illustration: '💬'
      },
      {
        title: 'Version Control',
        description: 'Track all changes and revert to previous versions.',
        icon: GitCompare,
        illustration: '🔄'
      }
    ]
  },
  {
    id: 'security',
    title: 'Security & Compliance',
    icon: Shield,
    color: 'from-indigo-500 to-violet-600',
    steps: [
      {
        title: 'End-to-End Encryption',
        description: 'AES-256 encryption for all files at rest and in transit.',
        icon: Lock,
        illustration: '🔒'
      },
      {
        title: 'Compliance Standards',
        description: 'GDPR, HIPAA, SOC 2 compliant infrastructure.',
        icon: Shield,
        illustration: '✅'
      },
      {
        title: 'Access Control',
        description: 'Set permissions and control who can view or edit.',
        icon: Users,
        illustration: '👮'
      },
      {
        title: 'Audit Logs',
        description: 'Complete activity logs for all document operations.',
        icon: FileText,
        illustration: '📋'
      }
    ]
  },
  {
    id: 'automation',
    title: 'Workflow Automation',
    icon: Bot,
    color: 'from-purple-500 to-indigo-600',
    steps: [
      {
        title: 'Create Workflows',
        description: 'Build automated workflows with visual drag-and-drop builder.',
        icon: Bot,
        illustration: '🤖'
      },
      {
        title: 'AI Optimization',
        description: 'Get intelligent suggestions to improve workflow performance.',
        icon: Sparkles,
        illustration: '✨'
      },
      {
        title: 'Workflow Visualizer',
        description: 'Track execution status and view detailed step-by-step progress.',
        icon: Layers,
        illustration: '📊'
      },
      {
        title: 'Analytics & Insights',
        description: 'Monitor performance metrics and get AI-powered recommendations.',
        icon: Bot,
        illustration: '📈'
      }
    ]
  },
  {
    id: 'advanced',
    title: 'Advanced Features',
    icon: Sparkles,
    color: 'from-rose-500 to-pink-600',
    steps: [
      {
        title: 'Document Comparison',
        description: 'Compare PDFs with AI-powered visual and textual analysis.',
        icon: GitCompare,
        illustration: '🔍'
      },
      {
        title: 'Security Dashboard',
        description: 'Monitor security events, manage settings, and track threats.',
        icon: Shield,
        illustration: '🛡️'
      },
      {
        title: 'Collaboration Deep Dive',
        description: 'Detailed analytics on team activity, versions, and statistics.',
        icon: Users,
        illustration: '👥'
      },
      {
        title: 'Cloud Integration',
        description: 'Sync with Google Drive, Dropbox, OneDrive, and Box.',
        icon: Cloud,
        illustration: '☁️'
      }
    ]
  }
];

const features = [
  { name: 'File Conversions', icon: FileOutput, description: '50+ formats supported' },
  { name: 'PDF Editing', icon: PenTool, description: 'Advanced editing tools' },
  { name: 'AI Assistant', icon: Brain, description: 'Smart automation' },
  { name: 'OCR Processing', icon: ScanText, description: 'Text extraction' },
  { name: 'Templates', icon: LayoutTemplate, description: 'Pre-built templates' },
  { name: 'Comparison', icon: GitCompare, description: 'Compare documents' },
  { name: 'Cloud Sync', icon: Cloud, description: 'Multi-cloud support' },
  { name: 'Collaboration', icon: Users, description: 'Team workspaces' },
  { name: 'Automation', icon: Bot, description: 'Workflow automation' },
  { name: 'Security', icon: Shield, description: 'Enterprise-grade' },
  { name: 'AI Workflow Optimizer', icon: Sparkles, description: 'Intelligent optimization' },
  { name: 'Deep Analytics', icon: Bot, description: 'Collaboration insights' },
  { name: 'Audit Trails', icon: Shield, description: 'Complete activity logs' },
  { name: 'Version Control', icon: Layers, description: 'Track all changes' },
  { name: 'Legal Docs', icon: FileText, description: 'Compliance templates' }
];

const faqs = [
  {
    question: 'What file formats are supported?',
    answer: 'OmniPDFs supports 50+ file formats including PDF, Word (DOCX), Excel (XLSX), PowerPoint (PPTX), Images (JPG, PNG), HTML, EPUB, CAD files, and more.'
  },
  {
    question: 'Is my data secure?',
    answer: 'Yes. We use AES-256 encryption, zero-knowledge architecture, and are GDPR, HIPAA, and SOC 2 compliant. Your files are automatically deleted after processing.'
  },
  {
    question: 'How does AI analysis work?',
    answer: 'Our AI analyzes documents for readability, compliance, content quality, and provides actionable recommendations. It can summarize, translate, and auto-tag documents.'
  },
  {
    question: 'Can I collaborate with my team?',
    answer: 'Absolutely! Invite team members, edit documents together in real-time, use comments and chat, and track all changes with version control.'
  },
  {
    question: 'What are the file size limits?',
    answer: 'Free users can upload files up to 25MB. Premium users get 100MB per file, and Enterprise users have unlimited file sizes.'
  },
  {
    question: 'How fast is the conversion?',
    answer: 'Most conversions complete in under 10 seconds. Large files or complex conversions may take up to 30 seconds.'
  },
  {
    question: 'Do you offer API access?',
    answer: 'Yes! Enterprise plans include full API access for integrating OmniPDFs into your applications and workflows.'
  },
  {
    question: 'Can I automate workflows?',
    answer: 'Yes. Use our Task Automation feature to create workflows that automatically process documents based on triggers and conditions. Includes AI workflow optimizer and real-time visualizer.'
  },
  {
    question: 'What advanced features are available?',
    answer: 'Advanced features include AI workflow optimization, collaboration deep dive analytics, comprehensive security dashboard, audit trails, document comparison with AI analysis, and cloud storage integration.'
  },
  {
    question: 'How does the AI Workflow Optimizer work?',
    answer: 'The AI Optimizer analyzes your workflows and suggests improvements for performance, efficiency, reliability, and cost. It identifies parallel execution opportunities, redundant steps, and provides confidence scores for each optimization.'
  },
  {
    question: 'What insights are available in Collaboration Deep Dive?',
    answer: 'Track total edits, comments, versions, and active time. View detailed activity feeds, version history with changes, and per-user statistics including edits, comments, views, and time spent.'
  },
  {
    question: 'What security monitoring features are included?',
    answer: 'Security dashboard shows real-time events, active sessions, encrypted files, failed attempts, and security score. Configure 2FA, encryption at rest, IP whitelisting, audit logging, session timeout, and zero-knowledge encryption.'
  }
];

export default function Guide({ theme = 'dark' }) {
  const [activeGuide, setActiveGuide] = useState('getting-started');
  const [searchQuery, setSearchQuery] = useState('');
  const isDark = theme === 'dark';

  const currentGuide = guides.find(g => g.id === activeGuide);

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              User Guide
            </h1>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Everything you need to master OmniPDFs
            </p>
          </div>
        </div>

        {/* Quick Feature Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`p-4 rounded-xl text-center ${isDark ? 'glass-light' : 'bg-white border border-slate-200 shadow-sm'}`}
            >
              <feature.icon className="w-6 h-6 text-violet-400 mx-auto mb-2" />
              <p className={`text-xs font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{feature.name}</p>
              <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Onboarding Video */}
      <OnboardingVideo isDark={isDark} />

      <Tabs defaultValue="guides" className="space-y-6">
        <TabsList className={isDark ? 'bg-slate-900/50 border border-slate-800' : 'bg-slate-100 border border-slate-200'}>
          <TabsTrigger value="guides" className={isDark ? 'data-[state=active]:bg-violet-500/20 data-[state=active]:text-violet-300' : 'data-[state=active]:bg-white data-[state=active]:text-violet-600'}>
            <BookOpen className="w-4 h-4 mr-2" />
            Step-by-Step Guides
          </TabsTrigger>
          <TabsTrigger value="features" className={isDark ? 'data-[state=active]:bg-violet-500/20 data-[state=active]:text-violet-300' : 'data-[state=active]:bg-white data-[state=active]:text-violet-600'}>
            <Sparkles className="w-4 h-4 mr-2" />
            Feature Details
          </TabsTrigger>
          <TabsTrigger value="faq" className={isDark ? 'data-[state=active]:bg-violet-500/20 data-[state=active]:text-violet-300' : 'data-[state=active]:bg-white data-[state=active]:text-violet-600'}>
            <HelpCircle className="w-4 h-4 mr-2" />
            FAQ
          </TabsTrigger>
        </TabsList>

        {/* Guides Tab */}
        <TabsContent value="guides" className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            {guides.map((guide) => {
              const GuideIcon = guide.icon;
              return (
                <motion.button
                  key={guide.id}
                  onClick={() => setActiveGuide(guide.id)}
                  whileHover={{ scale: 1.02 }}
                  className={`p-6 rounded-2xl text-left transition-all ${
                    activeGuide === guide.id
                      ? 'ring-2 ring-violet-500 bg-gradient-to-br ' + guide.color
                      : isDark ? 'glass-light hover:border-violet-500/30' : 'bg-white border border-slate-200 hover:border-violet-300'
                  }`}
                >
                  <GuideIcon className={`w-8 h-8 mb-3 ${activeGuide === guide.id ? 'text-white' : 'text-violet-400'}`} />
                  <h3 className={`font-semibold mb-1 ${activeGuide === guide.id ? 'text-white' : isDark ? 'text-white' : 'text-slate-900'}`}>
                    {guide.title}
                  </h3>
                  <p className={`text-sm ${activeGuide === guide.id ? 'text-white/80' : isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {guide.steps.length} steps
                  </p>
                </motion.button>
              );
            })}
          </div>

          {currentGuide && (
            <motion.div
              key={activeGuide}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {currentGuide.steps.map((step, index) => {
                const StepIcon = step.icon;
                return (
                  <Card key={index} className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${currentGuide.color} flex items-center justify-center text-2xl`}>
                            {step.illustration}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge variant="secondary" className={isDark ? 'bg-violet-500/20 text-violet-300' : 'bg-violet-100 text-violet-700'}>
                              Step {index + 1}
                            </Badge>
                            <StepIcon className="w-4 h-4 text-violet-400" />
                          </div>
                          <CardTitle className={isDark ? 'text-white' : 'text-slate-900'}>{step.title}</CardTitle>
                          <CardDescription className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                            {step.description}
                          </CardDescription>
                        </div>
                        <ChevronRight className={`w-5 h-5 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
                      </div>
                    </CardHeader>
                  </Card>
                );
              })}
            </motion.div>
          )}
        </TabsContent>

        {/* Features Tab */}
        <TabsContent value="features" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                    <FileOutput className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className={isDark ? 'text-white' : 'text-slate-900'}>File Conversion</CardTitle>
                </div>
                <CardDescription className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                  Convert between 50+ formats with industry-leading speed and quality
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5" />
                    <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>PDF, Word, Excel, PowerPoint</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5" />
                    <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Images (JPG, PNG, SVG, WebP)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5" />
                    <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>E-Books (EPUB, MOBI)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5" />
                    <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>CAD files and technical drawings</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                    <PenTool className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className={isDark ? 'text-white' : 'text-slate-900'}>PDF Editor</CardTitle>
                </div>
                <CardDescription className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                  Professional editing tools with AI assistance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5" />
                    <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Add text, images, shapes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5" />
                    <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Digital signatures & stamps</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5" />
                    <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Merge, split, rotate pages</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5" />
                    <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Real-time collaboration</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className={isDark ? 'text-white' : 'text-slate-900'}>AI Features</CardTitle>
                </div>
                <CardDescription className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                  Intelligent automation powered by advanced AI
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5" />
                    <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Smart document summarization</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5" />
                    <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Multi-language translation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5" />
                    <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Automatic tagging & categorization</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5" />
                    <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Content analysis & optimization</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className={isDark ? 'text-white' : 'text-slate-900'}>Collaboration</CardTitle>
                </div>
                <CardDescription className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                  Work together seamlessly with your team
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5" />
                    <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Real-time co-editing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5" />
                    <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Comments & chat</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5" />
                    <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Version control</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5" />
                    <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Permission management</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className={isDark ? 'text-white' : 'text-slate-900'}>Workflow Automation</CardTitle>
                </div>
                <CardDescription className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                  Automate document processing with AI
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5" />
                    <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Visual workflow builder</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5" />
                    <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>AI optimization suggestions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5" />
                    <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Real-time execution tracking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5" />
                    <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Performance analytics</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className={isDark ? 'text-white' : 'text-slate-900'}>Advanced Analytics</CardTitle>
                </div>
                <CardDescription className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                  Deep insights into collaboration and security
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5" />
                    <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Collaboration deep dive</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5" />
                    <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Security dashboard</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5" />
                    <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Complete audit trails</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5" />
                    <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Activity monitoring</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="space-y-6">
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
            <Input
              placeholder="Search frequently asked questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-10 ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200'}`}
            />
          </div>

          <Accordion type="single" collapsible className="space-y-3">
            {filteredFaqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`faq-${index}`}
                className={`rounded-xl border ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}
              >
                <AccordionTrigger className={`px-6 py-4 hover:no-underline ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  <div className="flex items-center gap-3 text-left">
                    <HelpCircle className="w-5 h-5 text-violet-400 flex-shrink-0" />
                    <span className="font-medium">{faq.question}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className={`px-6 pb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {filteredFaqs.length === 0 && (
            <div className="text-center py-12">
              <HelpCircle className={`w-12 h-12 mx-auto mb-3 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
              <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>No FAQs found matching your search</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Quick Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-12 p-6 rounded-2xl bg-gradient-to-br from-violet-500/10 to-cyan-500/10 border border-violet-500/20"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`text-lg font-semibold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Need More Help?
            </h3>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Contact our support team or check the API documentation
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className={isDark ? 'border-violet-500/50 text-violet-300 hover:bg-violet-500/10' : 'border-violet-300 text-violet-600 hover:bg-violet-50'}>
              Contact Support
            </Button>
            <Button className="bg-gradient-to-r from-violet-500 to-cyan-500 text-white">
              API Docs
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}