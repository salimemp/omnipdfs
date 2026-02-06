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
        details: 'Getting started with OmniPDFs is quick and easy. Simply click the "Sign In" button in the navigation bar and enter your email address. You\'ll receive a verification email to confirm your account. No payment information is needed to start using our free tier, which includes up to 25MB file uploads and access to all basic features. Once verified, you\'ll immediately have access to the dashboard where you can start uploading and processing documents. Your account comes with secure cloud storage, collaboration tools, and AI-powered features right out of the box.',
        icon: Users,
        illustration: '👤'
      },
      {
        title: 'Upload Your First Document',
        description: 'Drag and drop any file or click to browse. Supports 50+ formats.',
        details: 'OmniPDFs supports over 50 file formats including PDF, Word (DOCX, DOC), Excel (XLSX, XLS), PowerPoint (PPTX, PPT), images (JPG, PNG, SVG, WebP), e-books (EPUB, MOBI), HTML, and CAD files. You can upload files in three ways: drag and drop directly onto the upload area, click to browse your local files, or connect to cloud storage services like Google Drive, Dropbox, or OneDrive. Files are encrypted during upload using AES-256 encryption and processed in secure, isolated environments. Progress bars show real-time upload status, and you can upload multiple files simultaneously for batch processing.',
        icon: Upload,
        illustration: '📁'
      },
      {
        title: 'Convert or Edit',
        description: 'Choose from powerful conversion, editing, or AI tools.',
        details: 'Once uploaded, you have access to a comprehensive suite of tools. For conversions, select your target format from the dropdown menu - conversions typically complete in under 10 seconds. The PDF Editor provides professional-grade tools to add text, images, shapes, signatures, and annotations. Advanced features include page reorganization (merge, split, rotate), watermarking, form filling, and OCR text extraction. Our AI Assistant can summarize documents, translate to 50+ languages, auto-tag content, and perform deep document analysis. Quality settings allow you to customize compression, resolution, and OCR accuracy based on your needs.',
        icon: Zap,
        illustration: '⚡'
      },
      {
        title: 'Download & Share',
        description: 'Get your processed file instantly or share with your team.',
        details: 'After processing, download your files directly to your device or save them to integrated cloud storage services. Files are available for download for 24 hours (free tier) or indefinitely with premium plans. Share documents with team members by generating secure share links with customizable permissions (view-only, edit, comment). Set expiration dates and password protection for sensitive files. Enable real-time collaboration to work on documents simultaneously with colleagues. Track who viewed or edited your documents through detailed activity logs. Export files in multiple formats at once, and set up automated workflows to deliver processed files to specific destinations.',
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
        details: 'Our intelligent file detection system automatically identifies your document format upon upload, eliminating manual format selection. Simply drag and drop your file or click to browse - we handle the rest. Supported source formats include all major document types: PDF, Microsoft Office files (Word, Excel, PowerPoint), OpenDocument formats (ODT, ODS, ODP), images (JPG, PNG, BMP, GIF, TIFF, SVG, WebP), e-books (EPUB, MOBI, AZW), HTML files, plain text, rich text (RTF), and even CAD files (DWG, DXF). The system validates file integrity and checks for corruption before proceeding to ensure successful conversion.',
        icon: Upload,
        illustration: '📄'
      },
      {
        title: 'Choose Target Format',
        description: 'Pick from PDF, Word, Excel, PowerPoint, Images, and more.',
        details: 'Select from our extensive list of output formats optimized for different use cases. Convert to PDF for universal compatibility and archival purposes. Choose Word (DOCX) for editable documents, Excel (XLSX) for data manipulation, or PowerPoint (PPTX) for presentations. Image formats include JPG (smaller file size), PNG (transparency support), SVG (vector graphics), and WebP (modern web format). For e-readers, export to EPUB or MOBI. HTML conversion preserves formatting for web publishing. Our conversion engine maintains document fidelity, preserving fonts, layouts, images, hyperlinks, and metadata wherever possible. Format-specific options appear based on your selection.',
        icon: FileText,
        illustration: '🔄'
      },
      {
        title: 'Adjust Quality Settings',
        description: 'Customize resolution, compression, and OCR options.',
        details: 'Fine-tune conversion quality to match your needs. Image quality settings range from "Low" (maximum compression for web) to "Maximum" (print quality, larger files). DPI settings control resolution: 72 DPI for web, 150 DPI for screen viewing, 300 DPI for professional printing. Compression options reduce file size while maintaining visual quality - choose between lossless (no quality loss, larger files) and lossy (smaller files, minimal quality reduction). Enable OCR (Optical Character Recognition) to extract text from scanned documents and images, making them searchable and editable. OCR supports 50+ languages with confidence scoring. Advanced users can set custom color profiles, preserve embedded fonts, and control PDF/A compliance standards.',
        icon: Settings,
        illustration: '⚙️'
      },
      {
        title: 'Convert & Download',
        description: 'Processing takes seconds. Download or save to cloud.',
        details: 'Click "Convert" to begin processing. Our high-performance servers handle conversions in parallel, typically completing in under 10 seconds for standard documents. Large files or complex conversions may take up to 30 seconds. Watch real-time progress with detailed status updates and percentage completion. Once finished, download immediately via browser or send directly to connected cloud storage (Google Drive, Dropbox, OneDrive, Box). Batch conversion processes multiple files simultaneously with a single click. Failed conversions display clear error messages with troubleshooting suggestions. All converted files are temporarily stored for 24 hours on free plans, or permanently with premium accounts. Email notifications alert you when batch jobs complete.',
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
        details: 'Access our professional PDF editor by clicking "PDF Editor" from the navigation or selecting "Edit" on any uploaded PDF. The editor loads your document with a full-featured interface including thumbnail navigation, page zoom controls, and a comprehensive toolbar. The interface renders pages at high resolution for precise editing. Left sidebar shows page thumbnails for quick navigation through multi-page documents. Right panel provides tool options and properties. Keyboard shortcuts accelerate workflow (Ctrl+Z for undo, Ctrl+S for save). The editor supports PDFs of any size and complexity, including encrypted files (password required), forms, and documents with embedded media. Auto-save prevents data loss.',
        icon: FileText,
        illustration: '📝'
      },
      {
        title: 'Add Elements',
        description: 'Insert text, images, shapes, signatures, and stamps.',
        details: 'The editing toolbar provides comprehensive tools for PDF modification. Text Tool: Add new text boxes anywhere on the page with full font control (50+ fonts), size, color, alignment, and styling (bold, italic, underline). Image Tool: Insert images from your device or URL, with drag-to-resize and rotation controls. Shapes Tool: Draw rectangles, circles, lines, and arrows with customizable colors, borders, and fill patterns. Signature Tool: Create digital signatures using mouse, touchscreen, or upload scanned signatures. Stamp Tool: Apply pre-defined stamps (Approved, Confidential, Draft) or create custom stamps. Link Tool: Add clickable hyperlinks to external URLs or internal page jumps. Highlight, underline, and strikethrough tools for annotations. All elements support drag-and-drop positioning and layering controls.',
        icon: Layers,
        illustration: '🎨'
      },
      {
        title: 'Use AI Tools',
        description: 'Let AI suggest improvements, detect issues, and optimize.',
        details: 'Our AI-powered editing assistant provides intelligent recommendations to enhance your PDFs. AI Analysis detects common issues: missing fonts, low-resolution images, formatting inconsistencies, and broken links. Smart Suggestions recommend optimal page layouts, font pairings, and color schemes based on document type. Auto-formatting applies professional styling to text blocks, adjusting spacing, alignment, and hierarchy. Content Optimization identifies redundant content, suggests concise phrasing, and improves readability scores. OCR Enhancement automatically detects and extracts text from embedded images, making scanned documents fully searchable and editable. Accessibility Checker ensures WCAG compliance by validating alt text, heading structure, and reading order. AI can auto-tag documents, generate table of contents, and create bookmarks for improved navigation.',
        icon: Brain,
        illustration: '🤖'
      },
      {
        title: 'Save & Export',
        description: 'Save changes and export to various formats.',
        details: 'Save your edited PDF with multiple options to fit your workflow. Save Changes: Updates the original file with all modifications while preserving file metadata and properties. Save As: Creates a new copy, allowing you to keep the original untouched. Version control automatically creates backups of previous versions for 30 days (premium feature). Export Options: Download as PDF (standard, compressed, or PDF/A for archival), Word (DOCX with editable text), images (JPG, PNG per page), or HTML. Advanced PDF settings include linearization (fast web view), encryption (password protection with 128-bit or 256-bit AES), permissions control (restrict printing, copying, editing), and digital signatures. Cloud sync automatically uploads to connected storage services. Share directly via email or generate secure share links with view/edit permissions and expiration dates.',
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
        details: 'Our AI-powered summarization engine analyzes documents of any length and generates concise, accurate summaries in seconds. Choose from three summary types: Executive Summary (high-level overview for decision-makers), Detailed Summary (comprehensive with section-by-section breakdown), or Bullet Points (key takeaways and action items). The AI identifies main themes, important statistics, conclusions, and recommendations. Adjust summary length from 10% to 50% of original document. Supports all document formats including PDFs, Word docs, presentations, and even scanned documents via OCR. Multi-document summarization can synthesize information from multiple files simultaneously. Save summaries as separate documents or append to originals. Perfect for research papers, legal contracts, reports, and meeting transcripts.',
        icon: Brain,
        illustration: '📊'
      },
      {
        title: 'Smart Translation',
        description: 'Translate to 50+ languages while preserving formatting.',
        details: 'Translate documents to over 50 languages with industry-leading accuracy while maintaining original formatting, layout, and styling. Our neural translation engine preserves fonts, colors, images, tables, charts, headers, footers, and page structure. Unlike basic translation tools, we handle technical terminology, idioms, and context-specific phrasing. Language detection automatically identifies source language. Glossary support ensures consistent translation of specific terms across documents. Batch translation processes multiple files in one operation. Preview translations before finalizing, with side-by-side comparison views. Supported languages include all major European, Asian, Middle Eastern, and African languages. Perfect for international business documents, academic papers, marketing materials, and legal contracts. Translation memory stores previous translations to ensure consistency across projects.',
        icon: Wand2,
        illustration: '🌍'
      },
      {
        title: 'Auto-Tagging',
        description: 'AI automatically categorizes and tags your documents.',
        details: 'Intelligent auto-tagging analyzes document content and automatically applies relevant tags and categories for effortless organization. The AI examines text content, metadata, file names, and embedded information to generate accurate tags. Suggested categories include document type (invoice, contract, report), topic (finance, legal, HR), priority level, department, project, and date ranges. Custom tag sets can be trained on your organization\'s taxonomy. Bulk tagging processes entire folders in seconds. Tags are searchable and filterable, making document retrieval instantaneous. Tag confidence scores indicate reliability. Manual tag editing and refinement possible. Integration with existing folder structures and naming conventions. Perfect for large document libraries, compliance management, and knowledge bases.',
        icon: Bot,
        illustration: '🏷️'
      },
      {
        title: 'Document Analysis',
        description: 'Deep analysis for readability, compliance, and quality.',
        details: 'Comprehensive AI-powered document analysis provides actionable insights across multiple dimensions. Readability Analysis: Calculates Flesch-Kincaid score, grade level, and provides suggestions to improve clarity and comprehension. Compliance Checking: Validates documents against GDPR, HIPAA, SOC 2, and industry-specific regulations, flagging potential issues. Content Quality: Assesses grammar, spelling, consistency, tone, and style with AI-generated recommendations. Structure Analysis: Evaluates document organization, heading hierarchy, and navigation elements. Security Scan: Detects PII (personally identifiable information), sensitive data, and embedded malware. Sentiment Analysis: Gauges overall tone and emotional content (positive, neutral, negative). Accessibility Check: Ensures WCAG compliance for screen readers and assistive technologies. Generates detailed reports with scores, issues found, and step-by-step remediation guidance.',
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
        details: 'Collaborate seamlessly by inviting team members directly to your documents. Click "Share" on any document and enter email addresses of collaborators - they\'ll receive instant invitations with access links. Set granular permissions for each user: Viewer (read-only access), Commenter (can add comments and suggestions), Editor (full editing rights), or Admin (manage permissions and settings). Create team workspaces for department-wide collaboration with centralized document libraries. Invite external collaborators (clients, contractors) with guest access that doesn\'t require OmniPDFs accounts. Track invitation status (pending, accepted, declined) and resend as needed. Bulk invitations support CSV imports for large teams. Integration with corporate SSO (Single Sign-On) for enterprise security. Set expiration dates for temporary access.',
        icon: Users,
        illustration: '👥'
      },
      {
        title: 'Real-Time Editing',
        description: 'See changes instantly as team members edit.',
        details: 'Experience true real-time collaboration with instant synchronization across all devices. See team members\' cursors and selections as they edit, with name labels for identification. Changes appear immediately without refresh or manual sync. Collaborative editing works on text, annotations, form fields, and page organization. Conflict resolution automatically merges simultaneous edits intelligently. Presence indicators show who\'s currently viewing or editing the document. Activity notifications alert you when collaborators make significant changes. Edit in parallel without overwriting others\' work. Desktop, mobile, and web platforms stay perfectly synchronized. Offline mode queues changes and syncs when connection restores. Performance optimized for documents with dozens of concurrent editors. Perfect for team proposals, contracts requiring multiple approvals, and collaborative presentations.',
        icon: PenTool,
        illustration: '✏️'
      },
      {
        title: 'Comments & Chat',
        description: 'Discuss changes with inline comments and live chat.',
        details: 'Rich communication tools facilitate smooth collaboration without leaving the document. Inline Comments: Click anywhere to add comments with @mentions to notify specific team members. Thread replies keep conversations organized. Mark comments as resolved when addressed. Filter by commenter, date, or status. Attach files and images to comments. Live Chat: Built-in chat sidebar enables real-time discussions while viewing the document. Share screenshots, links, and emojis. Chat history persists with document. Notifications: Receive instant alerts for @mentions, replies, and status changes via email, mobile push, or in-app. Suggestion Mode: Propose changes that require approval rather than direct editing. Track all suggestions with accept/reject workflow. Perfect for review processes, contract negotiations, and team brainstorming.',
        icon: Users,
        illustration: '💬'
      },
      {
        title: 'Version Control',
        description: 'Track all changes and revert to previous versions.',
        details: 'Comprehensive version control provides complete document history and change tracking. Every save creates an automatic version snapshot with timestamp, author, and change summary. Version History panel displays chronological list of all versions with diff views showing exactly what changed (additions in green, deletions in red). Restore any previous version with one click - current version moves to history. Compare any two versions side-by-side to understand evolution. Export specific versions as separate files. Named versions allow marking milestones (e.g., "Final Draft", "Client Approved"). Comments and annotations linked to specific versions. Retention policies control how long versions are stored (30 days free, unlimited premium). Detailed activity log tracks all actions: edits, shares, downloads, permission changes. Compliance-ready audit trails for regulated industries.',
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
        details: 'Enterprise-grade security protects your documents at every stage. All files are encrypted using AES-256 encryption standard (same used by banks and military) both at rest (stored files) and in transit (during upload/download). TLS 1.3 protocol secures all network connections. Zero-knowledge architecture means your files are encrypted with keys only you control - even OmniPDFs cannot access your unencrypted data. Optional client-side encryption adds an extra layer where files are encrypted on your device before upload. Encryption keys are derived from your account credentials using industry-standard key derivation functions. Secure key management with automatic rotation. Data centers are geographically distributed with redundant backups. Files automatically deleted from servers after retention period (24 hours free, configurable premium). Compliant with international data protection regulations.',
        icon: Lock,
        illustration: '🔒'
      },
      {
        title: 'Compliance Standards',
        description: 'GDPR, HIPAA, SOC 2 compliant infrastructure.',
        details: 'OmniPDFs maintains compliance with major international regulations and standards. GDPR Compliance: Full adherence to European data protection regulations including right to access, right to deletion, data portability, and consent management. Data processing agreements available. HIPAA Compliance: Business Associate Agreements (BAA) for healthcare organizations handling Protected Health Information (PHI). Encrypted storage, access controls, and audit logging meet all requirements. SOC 2 Type II: Certified for security, availability, processing integrity, confidentiality, and privacy. Annual audits verify controls. PIPEDA: Compliant with Canadian privacy legislation. Additional certifications include ISO 27001 (information security), ISO 27018 (cloud privacy), and regional standards. Regular penetration testing and security audits by third-party firms. Incident response plan with notification procedures.',
        icon: Shield,
        illustration: '✅'
      },
      {
        title: 'Access Control',
        description: 'Set permissions and control who can view or edit.',
        details: 'Granular access controls provide precise security management at every level. User Permissions: Set document-level permissions for each user - View Only, Comment, Edit, or Admin. Role-Based Access Control (RBAC): Define organizational roles (Manager, Editor, Viewer) with pre-configured permissions applied automatically. Folder-level permissions cascade to contained documents. IP Whitelisting: Restrict access to approved IP addresses or ranges for enhanced security. Two-Factor Authentication (2FA): Require additional verification via SMS, authenticator app, or hardware keys. Session Management: Monitor active sessions, set timeout durations, and remotely terminate sessions. Password policies enforce complexity requirements. Document Permissions: Disable printing, copying, downloading, or forwarding for sensitive files. Set expiration dates for temporary access. Watermark viewing to prevent unauthorized distribution. Perfect for confidential business documents, legal files, and medical records.',
        icon: Users,
        illustration: '👮'
      },
      {
        title: 'Audit Logs',
        description: 'Complete activity logs for all document operations.',
        details: 'Comprehensive audit logging tracks every action for security, compliance, and accountability. Activity Logs capture: document uploads, downloads, views, edits, shares, permission changes, deletions, exports, and failed access attempts. Each log entry includes timestamp (precise to the second), user identity, IP address, device type, geographic location, and action details. Real-time monitoring dashboard displays current activity with filtering by user, action type, date range, or document. Export logs to CSV/JSON for external analysis or regulatory compliance reporting. Retention policies configurable (90 days standard, unlimited premium). Anomaly detection AI flags suspicious activity: unusual access patterns, bulk downloads, after-hours access. Email/SMS alerts for critical events. Immutable logs stored separately from operational data prevent tampering. Meet audit requirements for SOC 2, HIPAA, GDPR, and industry-specific regulations.',
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
        details: 'Design powerful automated workflows without coding using our intuitive visual builder. Drag nodes from the palette onto the canvas to create multi-step processes. Available nodes include: Triggers (file upload, schedule, webhook, email), Actions (convert, merge, split, compress, OCR, encrypt), Conditions (file type, size, content matching), Integrations (cloud storage, email, Slack, webhooks), and Loops (batch processing). Connect nodes with arrows to define execution flow. Configure each node with specific parameters: select formats, set quality options, define filter criteria. Use variables to pass data between steps (e.g., output of conversion becomes input for next step). Template library provides pre-built workflows for common scenarios: automated invoice processing, bulk image conversion, document archival. Test workflows with sample files before activation. Schedule workflows to run at specific times or intervals.',
        icon: Bot,
        illustration: '🤖'
      },
      {
        title: 'AI Optimization',
        description: 'Get intelligent suggestions to improve workflow performance.',
        details: 'Our AI Workflow Optimizer analyzes your automation and provides intelligent recommendations to enhance performance, reliability, and efficiency. Performance Optimization: Identifies parallel execution opportunities where independent steps can run simultaneously, reducing total execution time by up to 70%. Suggests faster alternative methods and optimal quality settings. Reliability Improvements: Recommends retry mechanisms for flaky operations, timeout adjustments, and error handling strategies. Detects potential failure points. Cost Optimization: Identifies redundant steps, suggests compression before cloud uploads to save bandwidth, and recommends resource-efficient alternatives. Efficiency Analysis: Finds bottlenecks, suggests workflow simplifications, and recommends consolidating similar operations. Each suggestion includes confidence score, estimated impact, and one-click implementation. AI learns from your workflow patterns to provide increasingly personalized recommendations.',
        icon: Sparkles,
        illustration: '✨'
      },
      {
        title: 'Workflow Visualizer',
        description: 'Track execution status and view detailed step-by-step progress.',
        details: 'Real-time workflow visualization provides complete transparency into automation execution. Live execution view displays each step as it runs with color-coded status indicators: gray (pending), blue (running), green (completed), red (failed), yellow (warning). Progress bars show completion percentage for long-running operations. Execution timeline presents chronological history with timestamps and duration for each step. Click any step to view detailed logs, input/output data, and performance metrics. Parallel execution visualization shows concurrent operations clearly. Error details include stack traces, retry attempts, and remediation suggestions. Historical runs view lets you compare past executions, identify patterns, and troubleshoot recurring issues. Export execution data for analysis. Set up notifications for workflow completion or failures via email, Slack, or webhooks. Perfect for monitoring critical business processes and ensuring SLA compliance.',
        icon: Layers,
        illustration: '📊'
      },
      {
        title: 'Analytics & Insights',
        description: 'Monitor performance metrics and get AI-powered recommendations.',
        details: 'Comprehensive analytics dashboard provides deep insights into workflow performance and usage patterns. Key Metrics: Track success rate, average execution time, total runs, files processed, and cost per execution. Time series charts show trends over days, weeks, or months. Performance Analysis: Identify slowest steps, compare execution times across workflow versions, and measure impact of optimizations. Resource usage tracking (CPU, memory, bandwidth). Reliability Monitoring: Monitor error rates, categorize failure types, and track mean time between failures (MTBF). Automated anomaly detection alerts you to unusual patterns. Usage Statistics: See which workflows are most active, peak usage times, and resource consumption by team or project. Cost analytics breaks down expenses by operation type. AI-Powered Recommendations: Machine learning analyzes patterns to suggest: best times to run workflows, resource allocation adjustments, and preventive maintenance. Predictive alerts warn of potential issues before they occur.',
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
        details: 'Advanced document comparison tools identify every difference between two versions with pixel-perfect accuracy. Visual Comparison: Side-by-side or overlay view highlights added content (green), removed content (red), and modified sections (yellow). Adjust sensitivity to ignore minor formatting changes. Text Comparison: Word-level diff shows exact text changes with context. Supports comparing different file formats (compare Word to PDF). Structural Analysis: Identifies changes in headings, tables, images, and page layouts. Metadata comparison shows property changes. AI-Powered Insights: Automatically summarizes key changes, categorizes modifications (substantive vs. formatting), and highlights critical updates. Change statistics provide metrics (percentage changed, number of edits). Generate comparison reports in PDF or HTML format. Perfect for contract reviews, document versioning, and legal compliance. Track changes across multiple versions simultaneously.',
        icon: GitCompare,
        illustration: '🔍'
      },
      {
        title: 'Security Dashboard',
        description: 'Monitor security events, manage settings, and track threats.',
        details: 'Centralized security dashboard provides real-time visibility into your organization\'s security posture. Security Score: Overall security rating (0-100) based on encryption usage, access controls, 2FA adoption, and compliance status. Improvement recommendations with impact scores. Real-Time Monitoring: Live feed of security events including successful logins, failed authentication attempts, permission changes, suspicious downloads, and potential data exfiltration. Threat Detection: AI-powered anomaly detection identifies unusual access patterns, brute force attempts, and insider threats. Risk heat maps show vulnerability hotspots. Security Settings: Configure organization-wide policies - enforce 2FA, set password complexity requirements, enable IP whitelisting, configure session timeouts, and manage encryption settings. Compliance Dashboard: Track GDPR, HIPAA, SOC 2 compliance status with audit readiness scores. Incident Response: Automated workflows for security incidents with notification chains and remediation playbooks.',
        icon: Shield,
        illustration: '🛡️'
      },
      {
        title: 'Collaboration Deep Dive',
        description: 'Detailed analytics on team activity, versions, and statistics.',
        details: 'In-depth collaboration analytics reveal how your team works together and optimize productivity. Team Activity Dashboard: Visualize total edits, comments, document views, and active collaboration time across your organization. Identify most and least active members. Per-User Statistics: Detailed profiles show each team member\'s contributions - edits made, comments added, documents owned, average response time, and collaboration score. Version History Analytics: Track document evolution with timeline visualization showing editing patterns, peak collaboration periods, and version frequency. Analyze who contributed to each version. Collaboration Patterns: Discover which team members collaborate most frequently, identify collaboration bottlenecks, and understand information flow. Network graphs visualize working relationships. Document Health: Monitor document status - pending reviews, unresolved comments, stale documents, and version conflicts. Productivity Metrics: Measure time-to-completion, review cycles, and approval workflows. Export reports for management review.',
        icon: Users,
        illustration: '👥'
      },
      {
        title: 'Cloud Integration',
        description: 'Sync with Google Drive, Dropbox, OneDrive, and Box.',
        details: 'Seamless cloud storage integration connects OmniPDFs with your existing file management infrastructure. Supported Services: Google Drive, Dropbox, OneDrive, Box, and iCloud. Connect multiple accounts from the same or different services. Two-Way Sync: Automatic bidirectional synchronization keeps files updated across platforms. Changes in OmniPDFs reflect in cloud storage and vice versa. Selective sync allows choosing specific folders. Smart Import: Browse and import files directly from cloud storage without downloading first. Batch operations process entire folders. File picker integration appears in all upload dialogs. Auto-Export: Configure workflows to automatically save processed files to specific cloud folders. Version control maintains sync across all versions. Conflict Resolution: Intelligent conflict detection when files change simultaneously with merge options or manual resolution. Bandwidth Optimization: Incremental sync transfers only changed portions of files. Offline Support: Queue operations when offline, sync when connection restores. Perfect for distributed teams, backup strategies, and maintaining single source of truth.',
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
  const [expandedGuide, setExpandedGuide] = useState(null);
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {guides.map((guide, i) => {
              const GuideIcon = guide.icon;
              const isExpanded = expandedGuide === guide.id;
              return (
                <motion.div
                  key={guide.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`${isExpanded ? 'sm:col-span-2 lg:col-span-3 xl:col-span-4' : ''}`}
                >
                  <Card 
                    className={`cursor-pointer overflow-hidden transition-all duration-300 ${
                      isDark ? 'bg-slate-900/50 border-slate-800 hover:border-violet-500/50' : 'bg-white border-slate-200 hover:border-violet-300'
                    } ${isExpanded ? 'ring-2 ring-violet-500' : ''}`}
                    onClick={() => setExpandedGuide(isExpanded ? null : guide.id)}
                  >
                    <CardHeader className={isExpanded ? '' : 'pb-3'}>
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${guide.color} flex items-center justify-center flex-shrink-0`}>
                          <GuideIcon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className={`mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {guide.title}
                          </CardTitle>
                          <CardDescription className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                            {guide.steps.length} step guide
                          </CardDescription>
                        </div>
                        <motion.div
                          animate={{ rotate: isExpanded ? 90 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronRight className={`w-5 h-5 flex-shrink-0 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                        </motion.div>
                      </div>
                    </CardHeader>

                    {isExpanded && (
                      <CardContent>
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-4"
                        >
                          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {guide.steps.map((step, index) => {
                              const StepIcon = step.icon;
                              return (
                                <div
                                  key={index}
                                  className={`p-5 rounded-xl ${isDark ? 'bg-slate-800/50 border border-slate-700' : 'bg-slate-50 border border-slate-200'}`}
                                >
                                  <div className="flex items-center gap-3 mb-3">
                                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${guide.color} flex items-center justify-center text-2xl shadow-lg`}>
                                      {step.illustration}
                                    </div>
                                    <Badge variant="secondary" className={isDark ? 'bg-violet-500/20 text-violet-300 text-xs' : 'bg-violet-100 text-violet-700 text-xs'}>
                                      Step {index + 1}
                                    </Badge>
                                  </div>
                                  <h4 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    {step.title}
                                  </h4>
                                  <p className={`text-sm leading-relaxed mb-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                    {step.description}
                                  </p>
                                  <div className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'} space-y-2`}>
                                    {step.details}
                                  </div>
                                  <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-700/50">
                                    <StepIcon className="w-4 h-4 text-violet-400" />
                                    <span className={`text-xs font-medium ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                      Key feature
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </motion.div>
                      </CardContent>
                    )}
                  </Card>
                </motion.div>
              );
            })}
          </div>
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