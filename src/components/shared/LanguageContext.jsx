import React, { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  en: {
    // Navigation
    dashboard: 'Dashboard', convert: 'Convert', pdfTools: 'PDF Tools', pdfEditor: 'PDF Editor', formFiller: 'Form Filler',
    ocr: 'OCR', templates: 'Templates', aiGenerator: 'AI Generator', comparePdfs: 'Compare PDFs', aiAssistant: 'AI Assistant',
    collaboration: 'Collaboration', projectFiles: 'Project Files', legalDocs: 'Legal Docs', translation: 'Translation',
    myFiles: 'My Files', analytics: 'Analytics', apiDocs: 'API Docs', settings: 'Settings', cloudStorage: 'Cloud Storage',
    taskAutomation: 'Task Automation', advancedFeatures: 'Advanced Features', history: 'History', webhooks: 'Webhooks',
    
    // Auth
    signIn: 'Sign In', signOut: 'Sign Out',
    
    // Common Actions
    upload: 'Upload', download: 'Download', delete: 'Delete', save: 'Save', cancel: 'Cancel',
    confirm: 'Confirm', edit: 'Edit', share: 'Share', search: 'Search', filter: 'Filter', sort: 'Sort',
    copy: 'Copy', clear: 'Clear', restore: 'Restore', sync: 'Sync', import: 'Import', export: 'Export',
    
    // Cookie Consent
    cookieConsent: 'Cookie Consent', privacyPolicy: 'Privacy Policy', acceptAll: 'Accept All', decline: 'Decline',
    cookieMessage: 'We use cookies to enhance your experience, analyze site usage, and improve our services. Your privacy is important to us.',
    
    // AI Features
    summarize: 'Summarize', translate: 'Translate', autoTag: 'Auto-Tag', suggestions: 'Suggestions', aiChat: 'AI Chat',
    review: 'Review', workflows: 'Workflows', uploadDocument: 'Upload Document', pasteText: 'Or Paste Text',
    generateSummary: 'Generate Summary', aiPoweredInsights: 'AI-Powered Insights', targetLanguage: 'Target Language',
    
    // Status
    processing: 'Processing...', success: 'Success', error: 'Error', loading: 'Loading...', complete: 'Complete',
    pending: 'Pending', failed: 'Failed', active: 'Active', inactive: 'Inactive',
    
    // Features
    quickConvert: 'Quick Convert', enterprise: 'Enterprise', startConverting: 'Start converting', 
    dropFiles: 'Drop files to convert', copiedToClipboard: 'Copied to clipboard',
    
    // Security
    security: 'Security', encryption: 'Encryption', passwordProtect: 'Password Protect', permissions: 'Permissions',
    watermark: 'Watermark', digitalSignature: 'Digital Signature', auditLog: 'Audit Log', accessControl: 'Access Control',
    
    // Analytics
    totalDocuments: 'Total Documents', totalConversions: 'Total Conversions', successRate: 'Success Rate',
    fileTypes: 'File Types', activityTypes: 'Activity Types', insights: 'Insights',
    
    // Versioning
    versionHistory: 'Version History', currentVersion: 'Current', version: 'Version', restoreVersion: 'Restore',
    
    // Integration
    externalServiceSync: 'External Service Sync', selectService: 'Select service...', syncToService: 'Sync to',
    syncing: 'Syncing...', importFromService: 'Import from',
  },
  es: {
    // Navigation
    dashboard: 'Tablero', convert: 'Convertir', pdfTools: 'Herramientas PDF', pdfEditor: 'Editor PDF', formFiller: 'Rellenar Formularios',
    ocr: 'OCR', templates: 'Plantillas', aiGenerator: 'Generador IA', comparePdfs: 'Comparar PDFs', aiAssistant: 'Asistente IA',
    collaboration: 'Colaboración', projectFiles: 'Archivos del Proyecto', legalDocs: 'Documentos Legales', translation: 'Traducción',
    myFiles: 'Mis Archivos', analytics: 'Análisis', apiDocs: 'Documentación API', settings: 'Configuración', cloudStorage: 'Almacenamiento en la Nube',
    taskAutomation: 'Automatización de Tareas', advancedFeatures: 'Funciones Avanzadas', history: 'Historial', webhooks: 'Webhooks',
    
    // Auth
    signIn: 'Iniciar Sesión', signOut: 'Cerrar Sesión',
    
    // Common Actions
    upload: 'Subir', download: 'Descargar', delete: 'Eliminar', save: 'Guardar', cancel: 'Cancelar',
    confirm: 'Confirmar', edit: 'Editar', share: 'Compartir', search: 'Buscar', filter: 'Filtrar', sort: 'Ordenar',
    copy: 'Copiar', clear: 'Limpiar', restore: 'Restaurar', sync: 'Sincronizar', import: 'Importar', export: 'Exportar',
    
    // Cookie Consent
    cookieConsent: 'Consentimiento de Cookies', privacyPolicy: 'Política de Privacidad', acceptAll: 'Aceptar Todo', decline: 'Rechazar',
    cookieMessage: 'Utilizamos cookies para mejorar su experiencia, analizar el uso del sitio y mejorar nuestros servicios. Su privacidad es importante para nosotros.',
    
    // AI Features
    summarize: 'Resumir', translate: 'Traducir', autoTag: 'Etiquetar Auto', suggestions: 'Sugerencias', aiChat: 'Chat IA',
    review: 'Revisar', workflows: 'Flujos de Trabajo', uploadDocument: 'Subir Documento', pasteText: 'O Pegar Texto',
    generateSummary: 'Generar Resumen', aiPoweredInsights: 'Información Impulsada por IA', targetLanguage: 'Idioma Objetivo',
    
    // Status
    processing: 'Procesando...', success: 'Éxito', error: 'Error', loading: 'Cargando...', complete: 'Completo',
    pending: 'Pendiente', failed: 'Fallido', active: 'Activo', inactive: 'Inactivo',
    
    // Features
    quickConvert: 'Conversión Rápida', enterprise: 'Empresarial', startConverting: 'Comenzar a convertir',
    dropFiles: 'Suelta archivos para convertir', copiedToClipboard: 'Copiado al portapapeles',
    
    // Security
    security: 'Seguridad', encryption: 'Cifrado', passwordProtect: 'Proteger con Contraseña', permissions: 'Permisos',
    watermark: 'Marca de Agua', digitalSignature: 'Firma Digital', auditLog: 'Registro de Auditoría', accessControl: 'Control de Acceso',
    
    // Analytics
    totalDocuments: 'Documentos Totales', totalConversions: 'Conversiones Totales', successRate: 'Tasa de Éxito',
    fileTypes: 'Tipos de Archivo', activityTypes: 'Tipos de Actividad', insights: 'Información',
    
    // Versioning
    versionHistory: 'Historial de Versiones', currentVersion: 'Actual', version: 'Versión', restoreVersion: 'Restaurar',
    
    // Integration
    externalServiceSync: 'Sincronización de Servicio Externo', selectService: 'Seleccionar servicio...', syncToService: 'Sincronizar con',
    syncing: 'Sincronizando...', importFromService: 'Importar desde',
  },
  fr: {
    dashboard: 'Tableau de Bord', convert: 'Convertir', pdfTools: 'Outils PDF', pdfEditor: 'Éditeur PDF', formFiller: 'Remplisseur de Formulaires',
    ocr: 'OCR', templates: 'Modèles', aiGenerator: 'Générateur IA', comparePdfs: 'Comparer les PDFs', aiAssistant: 'Assistant IA',
    collaboration: 'Collaboration', projectFiles: 'Fichiers du Projet', legalDocs: 'Documents Légaux', translation: 'Traduction',
    myFiles: 'Mes Fichiers', analytics: 'Analytiques', apiDocs: 'Documentation API', settings: 'Paramètres', signIn: 'Se Connecter',
    signOut: 'Se Déconnecter', upload: 'Télécharger', download: 'Télécharger', delete: 'Supprimer', save: 'Enregistrer', cancel: 'Annuler',
    confirm: 'Confirmer', edit: 'Modifier', share: 'Partager', search: 'Rechercher', filter: 'Filtrer', sort: 'Trier',
    cookieConsent: 'Consentement aux Cookies', privacyPolicy: 'Politique de Confidentialité', acceptAll: 'Tout Accepter', decline: 'Refuser',
    cookieMessage: 'Nous utilisons des cookies pour améliorer votre expérience, analyser l\'utilisation du site et améliorer nos services. Votre vie privée est importante pour nous.',
    summarize: 'Résumer', translate: 'Traduire', autoTag: 'Étiquetage Auto', suggestions: 'Suggestions', aiChat: 'Chat IA',
    review: 'Réviser', workflows: 'Flux de Travail', uploadDocument: 'Télécharger Document', pasteText: 'Ou Coller du Texte',
    processing: 'Traitement...', success: 'Succès', error: 'Erreur', quickConvert: 'Conversion Rapide', enterprise: 'Entreprise',
    startConverting: 'Commencer à convertir', dropFiles: 'Déposez des fichiers pour convertir', copy: 'Copier', clear: 'Effacer',
    copiedToClipboard: 'Copié dans le presse-papiers', targetLanguage: 'Langue Cible', generateSummary: 'Générer un Résumé',
    security: 'Sécurité', encryption: 'Chiffrement', passwordProtect: 'Protection par Mot de Passe', permissions: 'Permissions',
    watermark: 'Filigrane', digitalSignature: 'Signature Numérique', auditLog: 'Journal d\'Audit', accessControl: 'Contrôle d\'Accès',
  },
  de: {
    dashboard: 'Dashboard', convert: 'Konvertieren', pdfTools: 'PDF-Tools', pdfEditor: 'PDF-Editor', formFiller: 'Formularausfüller',
    ocr: 'OCR', templates: 'Vorlagen', aiGenerator: 'KI-Generator', comparePdfs: 'PDFs Vergleichen', aiAssistant: 'KI-Assistent',
    collaboration: 'Zusammenarbeit', projectFiles: 'Projektdateien', legalDocs: 'Rechtsdokumente', translation: 'Übersetzung',
    myFiles: 'Meine Dateien', analytics: 'Analytik', apiDocs: 'API-Dokumentation', settings: 'Einstellungen', signIn: 'Anmelden',
    signOut: 'Abmelden', upload: 'Hochladen', download: 'Herunterladen', delete: 'Löschen', save: 'Speichern', cancel: 'Abbrechen',
    confirm: 'Bestätigen', edit: 'Bearbeiten', share: 'Teilen', search: 'Suchen', filter: 'Filtern', sort: 'Sortieren',
    cookieConsent: 'Cookie-Einwilligung', privacyPolicy: 'Datenschutzrichtlinie', acceptAll: 'Alle Akzeptieren', decline: 'Ablehnen',
    cookieMessage: 'Wir verwenden Cookies, um Ihre Erfahrung zu verbessern, die Website-Nutzung zu analysieren und unsere Dienste zu verbessern. Ihre Privatsphäre ist uns wichtig.',
    summarize: 'Zusammenfassen', translate: 'Übersetzen', autoTag: 'Auto-Tag', suggestions: 'Vorschläge', aiChat: 'KI-Chat',
    review: 'Überprüfen', workflows: 'Workflows', uploadDocument: 'Dokument Hochladen', pasteText: 'Oder Text Einfügen',
    processing: 'Wird Verarbeitet...', success: 'Erfolg', error: 'Fehler', quickConvert: 'Schnellkonvertierung', enterprise: 'Unternehmen',
    startConverting: 'Mit Konvertierung Beginnen', dropFiles: 'Dateien zum Konvertieren ablegen', copy: 'Kopieren', clear: 'Löschen',
    copiedToClipboard: 'In die Zwischenablage kopiert', targetLanguage: 'Zielsprache', generateSummary: 'Zusammenfassung Erstellen',
    security: 'Sicherheit', encryption: 'Verschlüsselung', passwordProtect: 'Passwortschutz', permissions: 'Berechtigungen',
    watermark: 'Wasserzeichen', digitalSignature: 'Digitale Signatur', auditLog: 'Prüfprotokoll', accessControl: 'Zugriffskontrolle',
  },
  ru: {
    dashboard: 'Панель управления', convert: 'Конвертировать', pdfTools: 'Инструменты PDF', pdfEditor: 'Редактор PDF', formFiller: 'Заполнитель форм',
    ocr: 'OCR', templates: 'Шаблоны', aiGenerator: 'Генератор ИИ', comparePdfs: 'Сравнить PDF', aiAssistant: 'Ассистент ИИ',
    collaboration: 'Сотрудничество', projectFiles: 'Файлы проекта', legalDocs: 'Юридические документы', translation: 'Перевод',
    myFiles: 'Мои файлы', analytics: 'Аналитика', apiDocs: 'Документация API', settings: 'Настройки', signIn: 'Войти',
    signOut: 'Выйти', upload: 'Загрузить', download: 'Скачать', delete: 'Удалить', save: 'Сохранить', cancel: 'Отмена',
    confirm: 'Подтвердить', edit: 'Редактировать', share: 'Поделиться', search: 'Поиск', filter: 'Фильтр', sort: 'Сортировать',
    cookieConsent: 'Согласие на использование файлов cookie', privacyPolicy: 'Политика конфиденциальности', acceptAll: 'Принять все', decline: 'Отклонить',
    cookieMessage: 'Мы используем файлы cookie для улучшения вашего опыта, анализа использования сайта и улучшения наших услуг. Ваша конфиденциальность важна для нас.',
    summarize: 'Резюмировать', translate: 'Перевести', autoTag: 'Авто-теги', suggestions: 'Предложения', aiChat: 'Чат с ИИ',
    review: 'Обзор', workflows: 'Рабочие процессы', uploadDocument: 'Загрузить документ', pasteText: 'Или вставить текст',
    processing: 'Обработка...', success: 'Успех', error: 'Ошибка', quickConvert: 'Быстрая конвертация', enterprise: 'Предприятие',
    startConverting: 'Начать конвертацию', dropFiles: 'Перетащите файлы для конвертации', copy: 'Копировать', clear: 'Очистить',
    copiedToClipboard: 'Скопировано в буфер обмена', targetLanguage: 'Целевой язык', generateSummary: 'Создать резюме',
    security: 'Безопасность', encryption: 'Шифрование', passwordProtect: 'Защита паролем', permissions: 'Разрешения',
    watermark: 'Водяной знак', digitalSignature: 'Цифровая подпись', auditLog: 'Журнал аудита', accessControl: 'Контроль доступа',
  },
  zh: {
    dashboard: '仪表板', convert: '转换', pdfTools: 'PDF工具', pdfEditor: 'PDF编辑器', formFiller: '表单填充',
    ocr: 'OCR', templates: '模板', aiGenerator: 'AI生成器', comparePdfs: '比较PDF', aiAssistant: 'AI助手',
    collaboration: '协作', projectFiles: '项目文件', legalDocs: '法律文件', translation: '翻译',
    myFiles: '我的文件', analytics: '分析', apiDocs: 'API文档', settings: '设置', signIn: '登录',
    signOut: '登出', upload: '上传', download: '下载', delete: '删除', save: '保存', cancel: '取消',
    confirm: '确认', edit: '编辑', share: '分享', search: '搜索', filter: '筛选', sort: '排序',
    cookieConsent: 'Cookie同意', privacyPolicy: '隐私政策', acceptAll: '全部接受', decline: '拒绝',
    cookieMessage: '我们使用Cookie来增强您的体验、分析网站使用情况并改进我们的服务。您的隐私对我们很重要。',
    summarize: '总结', translate: '翻译', autoTag: '自动标记', suggestions: '建议', aiChat: 'AI聊天',
    review: '审查', workflows: '工作流程', uploadDocument: '上传文档', pasteText: '或粘贴文本',
    processing: '处理中...', success: '成功', error: '错误', quickConvert: '快速转换', enterprise: '企业',
    startConverting: '开始转换', dropFiles: '拖放文件以转换', copy: '复制', clear: '清除',
    copiedToClipboard: '已复制到剪贴板', targetLanguage: '目标语言', generateSummary: '生成摘要',
    security: '安全', encryption: '加密', passwordProtect: '密码保护', permissions: '权限',
    watermark: '水印', digitalSignature: '数字签名', auditLog: '审计日志', accessControl: '访问控制',
  },
  ja: {
    dashboard: 'ダッシュボード', convert: '変換', pdfTools: 'PDFツール', pdfEditor: 'PDFエディター', formFiller: 'フォーム入力',
    ocr: 'OCR', templates: 'テンプレート', aiGenerator: 'AIジェネレーター', comparePdfs: 'PDF比較', aiAssistant: 'AIアシスタント',
    collaboration: 'コラボレーション', projectFiles: 'プロジェクトファイル', legalDocs: '法的文書', translation: '翻訳',
    myFiles: 'マイファイル', analytics: '分析', apiDocs: 'APIドキュメント', settings: '設定', signIn: 'サインイン',
    signOut: 'サインアウト', upload: 'アップロード', download: 'ダウンロード', delete: '削除', save: '保存', cancel: 'キャンセル',
    confirm: '確認', edit: '編集', share: '共有', search: '検索', filter: 'フィルター', sort: '並べ替え',
    cookieConsent: 'Cookie同意', privacyPolicy: 'プライバシーポリシー', acceptAll: 'すべて受け入れる', decline: '拒否',
    cookieMessage: '私たちはCookieを使用して、あなたの体験を向上させ、サイトの使用状況を分析し、サービスを改善します。あなたのプライバシーは私たちにとって重要です。',
    summarize: '要約', translate: '翻訳', autoTag: '自動タグ', suggestions: '提案', aiChat: 'AIチャット',
    review: 'レビュー', workflows: 'ワークフロー', uploadDocument: 'ドキュメントをアップロード', pasteText: 'またはテキストを貼り付け',
    processing: '処理中...', success: '成功', error: 'エラー', quickConvert: 'クイック変換', enterprise: 'エンタープライズ',
    startConverting: '変換を開始', dropFiles: 'ファイルをドロップして変換', copy: 'コピー', clear: 'クリア',
    copiedToClipboard: 'クリップボードにコピーしました', targetLanguage: 'ターゲット言語', generateSummary: '要約を生成',
    security: 'セキュリティ', encryption: '暗号化', passwordProtect: 'パスワード保護', permissions: '権限',
    watermark: '透かし', digitalSignature: 'デジタル署名', auditLog: '監査ログ', accessControl: 'アクセス制御',
  },
  ko: {
    dashboard: '대시보드', convert: '변환', pdfTools: 'PDF 도구', pdfEditor: 'PDF 편집기', formFiller: '양식 작성기',
    ocr: 'OCR', templates: '템플릿', aiGenerator: 'AI 생성기', comparePdfs: 'PDF 비교', aiAssistant: 'AI 어시스턴트',
    collaboration: '협업', projectFiles: '프로젝트 파일', legalDocs: '법률 문서', translation: '번역',
    myFiles: '내 파일', analytics: '분석', apiDocs: 'API 문서', settings: '설정', signIn: '로그인',
    signOut: '로그아웃', upload: '업로드', download: '다운로드', delete: '삭제', save: '저장', cancel: '취소',
    confirm: '확인', edit: '편집', share: '공유', search: '검색', filter: '필터', sort: '정렬',
    cookieConsent: '쿠키 동의', privacyPolicy: '개인정보 보호정책', acceptAll: '모두 수락', decline: '거부',
    cookieMessage: '우리는 귀하의 경험을 향상시키고, 사이트 사용을 분석하며, 서비스를 개선하기 위해 쿠키를 사용합니다. 귀하의 개인정보는 우리에게 중요합니다.',
    summarize: '요약', translate: '번역', autoTag: '자동 태그', suggestions: '제안', aiChat: 'AI 채팅',
    review: '검토', workflows: '워크플로우', uploadDocument: '문서 업로드', pasteText: '또는 텍스트 붙여넣기',
    processing: '처리 중...', success: '성공', error: '오류', quickConvert: '빠른 변환', enterprise: '엔터프라이즈',
    startConverting: '변환 시작', dropFiles: '변환할 파일을 드롭하세요', copy: '복사', clear: '지우기',
    copiedToClipboard: '클립보드에 복사됨', targetLanguage: '대상 언어', generateSummary: '요약 생성',
    security: '보안', encryption: '암호화', passwordProtect: '비밀번호 보호', permissions: '권한',
    watermark: '워터마크', digitalSignature: '디지털 서명', auditLog: '감사 로그', accessControl: '액세스 제어',
  },
  ar: {
    dashboard: 'لوحة التحكم', convert: 'تحويل', pdfTools: 'أدوات PDF', pdfEditor: 'محرر PDF', formFiller: 'ملء النماذج',
    ocr: 'التعرف الضوئي', templates: 'القوالب', aiGenerator: 'مولد الذكاء الاصطناعي', comparePdfs: 'مقارنة PDF', aiAssistant: 'مساعد الذكاء الاصطناعي',
    collaboration: 'التعاون', projectFiles: 'ملفات المشروع', legalDocs: 'المستندات القانونية', translation: 'الترجمة',
    myFiles: 'ملفاتي', analytics: 'التحليلات', apiDocs: 'وثائق API', settings: 'الإعدادات', signIn: 'تسجيل الدخول',
    signOut: 'تسجيل الخروج', upload: 'رفع', download: 'تحميل', delete: 'حذف', save: 'حفظ', cancel: 'إلغاء',
    confirm: 'تأكيد', edit: 'تحرير', share: 'مشاركة', search: 'بحث', filter: 'تصفية', sort: 'ترتيب',
    cookieConsent: 'موافقة ملفات تعريف الارتباط', privacyPolicy: 'سياسة الخصوصية', acceptAll: 'قبول الكل', decline: 'رفض',
    cookieMessage: 'نستخدم ملفات تعريف الارتباط لتحسين تجربتك، وتحليل استخدام الموقع، وتحسين خدماتنا. خصوصيتك مهمة بالنسبة لنا.',
    summarize: 'تلخيص', translate: 'ترجمة', autoTag: 'علامات تلقائية', suggestions: 'اقتراحات', aiChat: 'محادثة الذكاء الاصطناعي',
    review: 'مراجعة', workflows: 'سير العمل', uploadDocument: 'رفع مستند', pasteText: 'أو الصق النص',
    processing: 'جارٍ المعالجة...', success: 'نجاح', error: 'خطأ', quickConvert: 'تحويل سريع', enterprise: 'المؤسسة',
    startConverting: 'بدء التحويل', dropFiles: 'إسقاط الملفات للتحويل', copy: 'نسخ', clear: 'مسح',
    copiedToClipboard: 'تم النسخ إلى الحافظة', targetLanguage: 'اللغة الهدف', generateSummary: 'إنشاء ملخص',
    security: 'الأمان', encryption: 'التشفير', passwordProtect: 'حماية بكلمة مرور', permissions: 'الأذونات',
    watermark: 'علامة مائية', digitalSignature: 'التوقيع الرقمي', auditLog: 'سجل التدقيق', accessControl: 'التحكم في الوصول',
  },
  he: {
    dashboard: 'לוח בקרה', convert: 'המרה', pdfTools: 'כלי PDF', pdfEditor: 'עורך PDF', formFiller: 'ממלא טפסים',
    ocr: 'OCR', templates: 'תבניות', aiGenerator: 'מחולל AI', comparePdfs: 'השווה PDF', aiAssistant: 'עוזר AI',
    collaboration: 'שיתוף פעולה', projectFiles: 'קבצי פרויקט', legalDocs: 'מסמכים משפטיים', translation: 'תרגום',
    myFiles: 'הקבצים שלי', analytics: 'אנליטיקה', apiDocs: 'תיעוד API', settings: 'הגדרות', signIn: 'התחבר',
    signOut: 'התנתק', upload: 'העלה', download: 'הורד', delete: 'מחק', save: 'שמור', cancel: 'בטל',
    confirm: 'אשר', edit: 'ערוך', share: 'שתף', search: 'חפש', filter: 'סנן', sort: 'מיין',
    cookieConsent: 'הסכמת עוגיות', privacyPolicy: 'מדיניות פרטיות', acceptAll: 'קבל הכל', decline: 'דחה',
    cookieMessage: 'אנו משתמשים בעוגיות כדי לשפר את החוויה שלך, לנתח שימוש באתר ולשפר את השירותים שלנו. הפרטיות שלך חשובה לנו.',
    summarize: 'סכם', translate: 'תרגם', autoTag: 'תיוג אוטומטי', suggestions: 'הצעות', aiChat: 'צ\'אט AI',
    review: 'סקירה', workflows: 'זרימות עבודה', uploadDocument: 'העלה מסמך', pasteText: 'או הדבק טקסט',
    processing: 'מעבד...', success: 'הצלחה', error: 'שגיאה', quickConvert: 'המרה מהירה', enterprise: 'ארגוני',
    startConverting: 'התחל המרה', dropFiles: 'גרור קבצים להמרה', copy: 'העתק', clear: 'נקה',
    copiedToClipboard: 'הועתק ללוח', targetLanguage: 'שפת יעד', generateSummary: 'צור סיכום',
    security: 'אבטחה', encryption: 'הצפנה', passwordProtect: 'הגנת סיסמה', permissions: 'הרשאות',
    watermark: 'סימן מים', digitalSignature: 'חתימה דיגיטלית', auditLog: 'יומן ביקורת', accessControl: 'בקרת גישה',
  },
  hi: {
    dashboard: 'डैशबोर्ड', convert: 'रूपांतरण', pdfTools: 'PDF उपकरण', pdfEditor: 'PDF संपादक', formFiller: 'फॉर्म भरने वाला',
    ocr: 'OCR', templates: 'टेम्पलेट्स', aiGenerator: 'AI जेनरेटर', comparePdfs: 'PDF तुलना', aiAssistant: 'AI सहायक',
    collaboration: 'सहयोग', projectFiles: 'प्रोजेक्ट फाइलें', legalDocs: 'कानूनी दस्तावेज', translation: 'अनुवाद',
    myFiles: 'मेरी फाइलें', analytics: 'विश्लेषिकी', apiDocs: 'API दस्तावेज', settings: 'सेटिंग्स', signIn: 'साइन इन',
    signOut: 'साइन आउट', upload: 'अपलोड', download: 'डाउनलोड', delete: 'हटाएं', save: 'सेव करें', cancel: 'रद्द करें',
    confirm: 'पुष्टि करें', edit: 'संपादित करें', share: 'साझा करें', search: 'खोजें', filter: 'फ़िल्टर', sort: 'क्रमबद्ध करें',
    cookieConsent: 'कुकी सहमति', privacyPolicy: 'गोपनीयता नीति', acceptAll: 'सभी स्वीकार करें', decline: 'अस्वीकार करें',
    cookieMessage: 'हम आपके अनुभव को बेहतर बनाने, साइट उपयोग का विश्लेषण करने और अपनी सेवाओं में सुधार करने के लिए कुकीज़ का उपयोग करते हैं। आपकी गोपनीयता हमारे लिए महत्वपूर्ण है।',
    summarize: 'सारांश', translate: 'अनुवाद', autoTag: 'ऑटो टैग', suggestions: 'सुझाव', aiChat: 'AI चैट',
    review: 'समीक्षा', workflows: 'वर्कफ्लो', uploadDocument: 'दस्तावेज़ अपलोड करें', pasteText: 'या टेक्स्ट पेस्ट करें',
    processing: 'प्रोसेसिंग...', success: 'सफलता', error: 'त्रुटि', quickConvert: 'त्वरित रूपांतरण', enterprise: 'उद्यम',
    startConverting: 'रूपांतरण शुरू करें', dropFiles: 'रूपांतरण के लिए फाइलें ड्रॉप करें', copy: 'कॉपी', clear: 'साफ करें',
    copiedToClipboard: 'क्लिपबोर्ड पर कॉपी किया गया', targetLanguage: 'लक्ष्य भाषा', generateSummary: 'सारांश उत्पन्न करें',
    security: 'सुरक्षा', encryption: 'एन्क्रिप्शन', passwordProtect: 'पासवर्ड सुरक्षा', permissions: 'अनुमतियाँ',
    watermark: 'वॉटरमार्क', digitalSignature: 'डिजिटल हस्ताक्षर', auditLog: 'ऑडिट लॉग', accessControl: 'एक्सेस नियंत्रण',
  },
  ta: {
    dashboard: 'டாஷ்போர்டு', convert: 'மாற்று', pdfTools: 'PDF கருவிகள்', pdfEditor: 'PDF எடிட்டர்', formFiller: 'படிவம் நிரப்பி',
    ocr: 'OCR', templates: 'வார்ப்புருக்கள்', aiGenerator: 'AI ஜெனரேட்டர்', comparePdfs: 'PDF ஒப்பிடு', aiAssistant: 'AI உதவியாளர்',
    collaboration: 'ஒத்துழைப்பு', projectFiles: 'திட்ட கோப்புகள்', legalDocs: 'சட்ட ஆவணங்கள்', translation: 'மொழிபெயர்ப்பு',
    myFiles: 'எனது கோப்புகள்', analytics: 'பகுப்பாய்வு', apiDocs: 'API ஆவணங்கள்', settings: 'அமைப்புகள்', signIn: 'உள்நுழை',
    signOut: 'வெளியேறு', upload: 'பதிவேற்று', download: 'பதிவிறக்கு', delete: 'நீக்கு', save: 'சேமி', cancel: 'ரத்துசெய்',
    confirm: 'உறுதிசெய்', edit: 'திருத்து', share: 'பகிர்', search: 'தேடு', filter: 'வடிகட்டு', sort: 'வரிசைப்படுத்து',
    cookieConsent: 'குக்கீ ஒப்புதல்', privacyPolicy: 'தனியுரிமை கொள்கை', acceptAll: 'அனைத்தையும் ஏற்கவும்', decline: 'மறுக்கவும்',
    cookieMessage: 'உங்கள் அனுபவத்தை மேம்படுத்த, தள பயன்பாட்டை பகுப்பாய்வு செய்ய மற்றும் எங்கள் சேவைகளை மேம்படுத்த நாங்கள் குக்கீகளைப் பயன்படுத்துகிறோம். உங்கள் தனியுரிமை எங்களுக்கு முக்கியம்.',
    summarize: 'சுருக்கம்', translate: 'மொழிபெயர்', autoTag: 'தானாக குறியிடு', suggestions: 'பரிந்துரைகள்', aiChat: 'AI அரட்டை',
    review: 'மதிப்பாய்வு', workflows: 'பணிப்பாய்வுகள்', uploadDocument: 'ஆவணத்தைப் பதிவேற்றவும்', pasteText: 'அல்லது உரையை ஒட்டவும்',
    processing: 'செயலாக்கப்படுகிறது...', success: 'வெற்றி', error: 'பிழை', quickConvert: 'விரைவு மாற்றம்', enterprise: 'நிறுவனம்',
    startConverting: 'மாற்றத்தைத் தொடங்கவும்', dropFiles: 'மாற்ற கோப்புகளை விடவும்', copy: 'நகலெடு', clear: 'அழி',
    copiedToClipboard: 'கிளிப்போர்டுக்கு நகலெடுக்கப்பட்டது', targetLanguage: 'இலக்கு மொழி', generateSummary: 'சுருக்கத்தை உருவாக்கவும்',
    security: 'பாதுகாப்பு', encryption: 'குறியாக்கம்', passwordProtect: 'கடவுச்சொல் பாதுகாப்பு', permissions: 'அனுமதிகள்',
    watermark: 'நீர்முத்திரை', digitalSignature: 'டிஜிட்டல் கையொப்பம்', auditLog: 'தணிக்கை பதிவு', accessControl: 'அணுகல் கட்டுப்பாடு',
  },
  bn: {
    dashboard: 'ড্যাশবোর্ড', convert: 'রূপান্তর', pdfTools: 'PDF টুলস', pdfEditor: 'PDF সম্পাদক', formFiller: 'ফর্ম পূরণকারী',
    ocr: 'OCR', templates: 'টেমপ্লেট', aiGenerator: 'AI জেনারেটর', comparePdfs: 'PDF তুলনা', aiAssistant: 'AI সহায়ক',
    collaboration: 'সহযোগিতা', projectFiles: 'প্রকল্প ফাইল', legalDocs: 'আইনি নথি', translation: 'অনুবাদ',
    myFiles: 'আমার ফাইল', analytics: 'বিশ্লেষণ', apiDocs: 'API ডকুমেন্টেশন', settings: 'সেটিংস', signIn: 'সাইন ইন',
    signOut: 'সাইন আউট', upload: 'আপলোড', download: 'ডাউনলোড', delete: 'মুছুন', save: 'সংরক্ষণ', cancel: 'বাতিল',
    confirm: 'নিশ্চিত', edit: 'সম্পাদনা', share: 'শেয়ার', search: 'অনুসন্ধান', filter: 'ফিল্টার', sort: 'সাজান',
    cookieConsent: 'কুকি সম্মতি', privacyPolicy: 'গোপনীয়তা নীতি', acceptAll: 'সব গ্রহণ করুন', decline: 'প্রত্যাখ্যান',
    cookieMessage: 'আমরা আপনার অভিজ্ঞতা উন্নত করতে, সাইট ব্যবহার বিশ্লেষণ করতে এবং আমাদের সেবা উন্নত করতে কুকি ব্যবহার করি। আপনার গোপনীয়তা আমাদের কাছে গুরুত্বপূর্ণ।',
    summarize: 'সংক্ষিপ্ত', translate: 'অনুবাদ', autoTag: 'স্বয়ংক্রিয় ট্যাগ', suggestions: 'পরামর্শ', aiChat: 'AI চ্যাট',
    review: 'পর্যালোচনা', workflows: 'ওয়ার্কফ্লো', uploadDocument: 'নথি আপলোড করুন', pasteText: 'অথবা টেক্সট পেস্ট করুন',
    processing: 'প্রক্রিয়াকরণ...', success: 'সফল', error: 'ত্রুটি', quickConvert: 'দ্রুত রূপান্তর', enterprise: 'এন্টারপ্রাইজ',
    startConverting: 'রূপান্তর শুরু করুন', dropFiles: 'রূপান্তরের জন্য ফাইল ড্রপ করুন', copy: 'কপি', clear: 'পরিষ্কার',
    copiedToClipboard: 'ক্লিপবোর্ডে কপি করা হয়েছে', targetLanguage: 'লক্ষ্য ভাষা', generateSummary: 'সংক্ষিপ্তসার তৈরি করুন',
    security: 'নিরাপত্তা', encryption: 'এনক্রিপশন', passwordProtect: 'পাসওয়ার্ড সুরক্ষা', permissions: 'অনুমতি',
    watermark: 'ওয়াটারমার্ক', digitalSignature: 'ডিজিটাল স্বাক্ষর', auditLog: 'অডিট লগ', accessControl: 'অ্যাক্সেস নিয়ন্ত্রণ',
  },
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('omnipdf-language') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('omnipdf-language', language);
    document.documentElement.lang = language;
    document.documentElement.dir = ['ar', 'he'].includes(language) ? 'rtl' : 'ltr';
  }, [language]);

  const t = (key) => translations[language]?.[key] || translations['en'][key] || key;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, translations }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};