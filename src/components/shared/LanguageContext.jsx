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
    // Navigation
    dashboard: 'Tableau de Bord', convert: 'Convertir', pdfTools: 'Outils PDF', pdfEditor: 'Éditeur PDF', formFiller: 'Remplisseur de Formulaires',
    ocr: 'OCR', templates: 'Modèles', aiGenerator: 'Générateur IA', comparePdfs: 'Comparer les PDFs', aiAssistant: 'Assistant IA',
    collaboration: 'Collaboration', projectFiles: 'Fichiers du Projet', legalDocs: 'Documents Légaux', translation: 'Traduction',
    myFiles: 'Mes Fichiers', analytics: 'Analytiques', apiDocs: 'Documentation API', settings: 'Paramètres', cloudStorage: 'Stockage Cloud',
    taskAutomation: 'Automatisation des Tâches', advancedFeatures: 'Fonctionnalités Avancées', history: 'Historique', webhooks: 'Webhooks',
    
    // Auth
    signIn: 'Se Connecter', signOut: 'Se Déconnecter',
    
    // Common Actions
    upload: 'Télécharger', download: 'Télécharger', delete: 'Supprimer', save: 'Enregistrer', cancel: 'Annuler',
    confirm: 'Confirmer', edit: 'Modifier', share: 'Partager', search: 'Rechercher', filter: 'Filtrer', sort: 'Trier',
    copy: 'Copier', clear: 'Effacer', restore: 'Restaurer', sync: 'Synchroniser', import: 'Importer', export: 'Exporter',
    
    // Cookie Consent
    cookieConsent: 'Consentement aux Cookies', privacyPolicy: 'Politique de Confidentialité', acceptAll: 'Tout Accepter', decline: 'Refuser',
    cookieMessage: 'Nous utilisons des cookies pour améliorer votre expérience, analyser l\'utilisation du site et améliorer nos services. Votre vie privée est importante pour nous.',
    
    // AI Features
    summarize: 'Résumer', translate: 'Traduire', autoTag: 'Étiquetage Auto', suggestions: 'Suggestions', aiChat: 'Chat IA',
    review: 'Réviser', workflows: 'Flux de Travail', uploadDocument: 'Télécharger Document', pasteText: 'Ou Coller du Texte',
    generateSummary: 'Générer un Résumé', aiPoweredInsights: 'Informations Alimentées par IA', targetLanguage: 'Langue Cible',
    
    // Status
    processing: 'Traitement...', success: 'Succès', error: 'Erreur', loading: 'Chargement...', complete: 'Complet',
    pending: 'En attente', failed: 'Échoué', active: 'Actif', inactive: 'Inactif',
    
    // Features
    quickConvert: 'Conversion Rapide', enterprise: 'Entreprise', startConverting: 'Commencer à convertir',
    dropFiles: 'Déposez des fichiers pour convertir', copiedToClipboard: 'Copié dans le presse-papiers',
    
    // Security
    security: 'Sécurité', encryption: 'Chiffrement', passwordProtect: 'Protection par Mot de Passe', permissions: 'Permissions',
    watermark: 'Filigrane', digitalSignature: 'Signature Numérique', auditLog: 'Journal d\'Audit', accessControl: 'Contrôle d\'Accès',
    
    // Analytics
    totalDocuments: 'Total de Documents', totalConversions: 'Total de Conversions', successRate: 'Taux de Réussite',
    fileTypes: 'Types de Fichiers', activityTypes: 'Types d\'Activité', insights: 'Informations',
    
    // Versioning
    versionHistory: 'Historique des Versions', currentVersion: 'Actuel', version: 'Version', restoreVersion: 'Restaurer',
    
    // Integration
    externalServiceSync: 'Synchronisation de Service Externe', selectService: 'Sélectionner un service...', syncToService: 'Synchroniser vers',
    syncing: 'Synchronisation...', importFromService: 'Importer depuis',
  },
  de: {
    // Navigation
    dashboard: 'Dashboard', convert: 'Konvertieren', pdfTools: 'PDF-Tools', pdfEditor: 'PDF-Editor', formFiller: 'Formularausfüller',
    ocr: 'OCR', templates: 'Vorlagen', aiGenerator: 'KI-Generator', comparePdfs: 'PDFs Vergleichen', aiAssistant: 'KI-Assistent',
    collaboration: 'Zusammenarbeit', projectFiles: 'Projektdateien', legalDocs: 'Rechtsdokumente', translation: 'Übersetzung',
    myFiles: 'Meine Dateien', analytics: 'Analytik', apiDocs: 'API-Dokumentation', settings: 'Einstellungen', cloudStorage: 'Cloud-Speicher',
    taskAutomation: 'Aufgabenautomatisierung', advancedFeatures: 'Erweiterte Funktionen', history: 'Verlauf', webhooks: 'Webhooks',
    
    // Auth
    signIn: 'Anmelden', signOut: 'Abmelden',
    
    // Common Actions
    upload: 'Hochladen', download: 'Herunterladen', delete: 'Löschen', save: 'Speichern', cancel: 'Abbrechen',
    confirm: 'Bestätigen', edit: 'Bearbeiten', share: 'Teilen', search: 'Suchen', filter: 'Filtern', sort: 'Sortieren',
    copy: 'Kopieren', clear: 'Löschen', restore: 'Wiederherstellen', sync: 'Synchronisieren', import: 'Importieren', export: 'Exportieren',
    
    // Cookie Consent
    cookieConsent: 'Cookie-Einwilligung', privacyPolicy: 'Datenschutzrichtlinie', acceptAll: 'Alle Akzeptieren', decline: 'Ablehnen',
    cookieMessage: 'Wir verwenden Cookies, um Ihre Erfahrung zu verbessern, die Website-Nutzung zu analysieren und unsere Dienste zu verbessern. Ihre Privatsphäre ist uns wichtig.',
    
    // AI Features
    summarize: 'Zusammenfassen', translate: 'Übersetzen', autoTag: 'Auto-Tag', suggestions: 'Vorschläge', aiChat: 'KI-Chat',
    review: 'Überprüfen', workflows: 'Workflows', uploadDocument: 'Dokument Hochladen', pasteText: 'Oder Text Einfügen',
    generateSummary: 'Zusammenfassung Erstellen', aiPoweredInsights: 'KI-gestützte Einblicke', targetLanguage: 'Zielsprache',
    
    // Status
    processing: 'Wird Verarbeitet...', success: 'Erfolg', error: 'Fehler', loading: 'Lädt...', complete: 'Abgeschlossen',
    pending: 'Ausstehend', failed: 'Fehlgeschlagen', active: 'Aktiv', inactive: 'Inaktiv',
    
    // Features
    quickConvert: 'Schnellkonvertierung', enterprise: 'Unternehmen', startConverting: 'Mit Konvertierung Beginnen',
    dropFiles: 'Dateien zum Konvertieren ablegen', copiedToClipboard: 'In die Zwischenablage kopiert',
    
    // Security
    security: 'Sicherheit', encryption: 'Verschlüsselung', passwordProtect: 'Passwortschutz', permissions: 'Berechtigungen',
    watermark: 'Wasserzeichen', digitalSignature: 'Digitale Signatur', auditLog: 'Prüfprotokoll', accessControl: 'Zugriffskontrolle',
    
    // Analytics
    totalDocuments: 'Dokumente Gesamt', totalConversions: 'Konvertierungen Gesamt', successRate: 'Erfolgsquote',
    fileTypes: 'Dateitypen', activityTypes: 'Aktivitätstypen', insights: 'Einblicke',
    
    // Versioning
    versionHistory: 'Versionsverlauf', currentVersion: 'Aktuell', version: 'Version', restoreVersion: 'Wiederherstellen',
    
    // Integration
    externalServiceSync: 'Externe Dienstsynchronisierung', selectService: 'Dienst auswählen...', syncToService: 'Synchronisieren mit',
    syncing: 'Synchronisiere...', importFromService: 'Importieren von',
  },
  ru: {
    // Navigation
    dashboard: 'Панель управления', convert: 'Конвертировать', pdfTools: 'Инструменты PDF', pdfEditor: 'Редактор PDF', formFiller: 'Заполнитель форм',
    ocr: 'OCR', templates: 'Шаблоны', aiGenerator: 'Генератор ИИ', comparePdfs: 'Сравнить PDF', aiAssistant: 'Ассистент ИИ',
    collaboration: 'Сотрудничество', projectFiles: 'Файлы проекта', legalDocs: 'Юридические документы', translation: 'Перевод',
    myFiles: 'Мои файлы', analytics: 'Аналитика', apiDocs: 'Документация API', settings: 'Настройки', cloudStorage: 'Облачное хранилище',
    taskAutomation: 'Автоматизация задач', advancedFeatures: 'Расширенные функции', history: 'История', webhooks: 'Вебхуки',
    
    // Auth
    signIn: 'Войти', signOut: 'Выйти',
    
    // Common Actions
    upload: 'Загрузить', download: 'Скачать', delete: 'Удалить', save: 'Сохранить', cancel: 'Отмена',
    confirm: 'Подтвердить', edit: 'Редактировать', share: 'Поделиться', search: 'Поиск', filter: 'Фильтр', sort: 'Сортировать',
    copy: 'Копировать', clear: 'Очистить', restore: 'Восстановить', sync: 'Синхронизировать', import: 'Импортировать', export: 'Экспортировать',
    
    // Cookie Consent
    cookieConsent: 'Согласие на использование файлов cookie', privacyPolicy: 'Политика конфиденциальности', acceptAll: 'Принять все', decline: 'Отклонить',
    cookieMessage: 'Мы используем файлы cookie для улучшения вашего опыта, анализа использования сайта и улучшения наших услуг. Ваша конфиденциальность важна для нас.',
    
    // AI Features
    summarize: 'Резюмировать', translate: 'Перевести', autoTag: 'Авто-теги', suggestions: 'Предложения', aiChat: 'Чат с ИИ',
    review: 'Обзор', workflows: 'Рабочие процессы', uploadDocument: 'Загрузить документ', pasteText: 'Или вставить текст',
    generateSummary: 'Создать резюме', aiPoweredInsights: 'Аналитика с ИИ', targetLanguage: 'Целевой язык',
    
    // Status
    processing: 'Обработка...', success: 'Успех', error: 'Ошибка', loading: 'Загрузка...', complete: 'Завершено',
    pending: 'Ожидание', failed: 'Не удалось', active: 'Активный', inactive: 'Неактивный',
    
    // Features
    quickConvert: 'Быстрая конвертация', enterprise: 'Предприятие', startConverting: 'Начать конвертацию',
    dropFiles: 'Перетащите файлы для конвертации', copiedToClipboard: 'Скопировано в буфер обмена',
    
    // Security
    security: 'Безопасность', encryption: 'Шифрование', passwordProtect: 'Защита паролем', permissions: 'Разрешения',
    watermark: 'Водяной знак', digitalSignature: 'Цифровая подпись', auditLog: 'Журнал аудита', accessControl: 'Контроль доступа',
    
    // Analytics
    totalDocuments: 'Всего документов', totalConversions: 'Всего конверсий', successRate: 'Процент успеха',
    fileTypes: 'Типы файлов', activityTypes: 'Типы активности', insights: 'Аналитика',
    
    // Versioning
    versionHistory: 'История версий', currentVersion: 'Текущая', version: 'Версия', restoreVersion: 'Восстановить',
    
    // Integration
    externalServiceSync: 'Синхронизация внешних сервисов', selectService: 'Выбрать сервис...', syncToService: 'Синхронизировать с',
    syncing: 'Синхронизация...', importFromService: 'Импортировать из',
  },
  zh: {
    // Navigation
    dashboard: '仪表板', convert: '转换', pdfTools: 'PDF工具', pdfEditor: 'PDF编辑器', formFiller: '表单填充',
    ocr: 'OCR', templates: '模板', aiGenerator: 'AI生成器', comparePdfs: '比较PDF', aiAssistant: 'AI助手',
    collaboration: '协作', projectFiles: '项目文件', legalDocs: '法律文件', translation: '翻译',
    myFiles: '我的文件', analytics: '分析', apiDocs: 'API文档', settings: '设置', cloudStorage: '云存储',
    taskAutomation: '任务自动化', advancedFeatures: '高级功能', history: '历史', webhooks: 'Webhooks',
    
    // Auth
    signIn: '登录', signOut: '登出',
    
    // Common Actions
    upload: '上传', download: '下载', delete: '删除', save: '保存', cancel: '取消',
    confirm: '确认', edit: '编辑', share: '分享', search: '搜索', filter: '筛选', sort: '排序',
    copy: '复制', clear: '清除', restore: '恢复', sync: '同步', import: '导入', export: '导出',
    
    // Cookie Consent
    cookieConsent: 'Cookie同意', privacyPolicy: '隐私政策', acceptAll: '全部接受', decline: '拒绝',
    cookieMessage: '我们使用Cookie来增强您的体验、分析网站使用情况并改进我们的服务。您的隐私对我们很重要。',
    
    // AI Features
    summarize: '总结', translate: '翻译', autoTag: '自动标记', suggestions: '建议', aiChat: 'AI聊天',
    review: '审查', workflows: '工作流程', uploadDocument: '上传文档', pasteText: '或粘贴文本',
    generateSummary: '生成摘要', aiPoweredInsights: 'AI驱动的见解', targetLanguage: '目标语言',
    
    // Status
    processing: '处理中...', success: '成功', error: '错误', loading: '加载中...', complete: '完成',
    pending: '待处理', failed: '失败', active: '活动', inactive: '非活动',
    
    // Features
    quickConvert: '快速转换', enterprise: '企业', startConverting: '开始转换',
    dropFiles: '拖放文件以转换', copiedToClipboard: '已复制到剪贴板',
    
    // Security
    security: '安全', encryption: '加密', passwordProtect: '密码保护', permissions: '权限',
    watermark: '水印', digitalSignature: '数字签名', auditLog: '审计日志', accessControl: '访问控制',
    
    // Analytics
    totalDocuments: '文档总数', totalConversions: '转换总数', successRate: '成功率',
    fileTypes: '文件类型', activityTypes: '活动类型', insights: '见解',
    
    // Versioning
    versionHistory: '版本历史', currentVersion: '当前', version: '版本', restoreVersion: '恢复',
    
    // Integration
    externalServiceSync: '外部服务同步', selectService: '选择服务...', syncToService: '同步到',
    syncing: '同步中...', importFromService: '从中导入',
  },
  ja: {
    // Navigation
    dashboard: 'ダッシュボード', convert: '変換', pdfTools: 'PDFツール', pdfEditor: 'PDFエディター', formFiller: 'フォーム入力',
    ocr: 'OCR', templates: 'テンプレート', aiGenerator: 'AIジェネレーター', comparePdfs: 'PDF比較', aiAssistant: 'AIアシスタント',
    collaboration: 'コラボレーション', projectFiles: 'プロジェクトファイル', legalDocs: '法的文書', translation: '翻訳',
    myFiles: 'マイファイル', analytics: '分析', apiDocs: 'APIドキュメント', settings: '設定', cloudStorage: 'クラウドストレージ',
    taskAutomation: 'タスク自動化', advancedFeatures: '高度な機能', history: '履歴', webhooks: 'Webhooks',
    
    // Auth
    signIn: 'サインイン', signOut: 'サインアウト',
    
    // Common Actions
    upload: 'アップロード', download: 'ダウンロード', delete: '削除', save: '保存', cancel: 'キャンセル',
    confirm: '確認', edit: '編集', share: '共有', search: '検索', filter: 'フィルター', sort: '並べ替え',
    copy: 'コピー', clear: 'クリア', restore: '復元', sync: '同期', import: 'インポート', export: 'エクスポート',
    
    // Cookie Consent
    cookieConsent: 'Cookie同意', privacyPolicy: 'プライバシーポリシー', acceptAll: 'すべて受け入れる', decline: '拒否',
    cookieMessage: '私たちはCookieを使用して、あなたの体験を向上させ、サイトの使用状況を分析し、サービスを改善します。あなたのプライバシーは私たちにとって重要です。',
    
    // AI Features
    summarize: '要約', translate: '翻訳', autoTag: '自動タグ', suggestions: '提案', aiChat: 'AIチャット',
    review: 'レビュー', workflows: 'ワークフロー', uploadDocument: 'ドキュメントをアップロード', pasteText: 'またはテキストを貼り付け',
    generateSummary: '要約を生成', aiPoweredInsights: 'AI駆動のインサイト', targetLanguage: 'ターゲット言語',
    
    // Status
    processing: '処理中...', success: '成功', error: 'エラー', loading: '読み込み中...', complete: '完了',
    pending: '保留中', failed: '失敗', active: 'アクティブ', inactive: '非アクティブ',
    
    // Features
    quickConvert: 'クイック変換', enterprise: 'エンタープライズ', startConverting: '変換を開始',
    dropFiles: 'ファイルをドロップして変換', copiedToClipboard: 'クリップボードにコピーしました',
    
    // Security
    security: 'セキュリティ', encryption: '暗号化', passwordProtect: 'パスワード保護', permissions: '権限',
    watermark: '透かし', digitalSignature: 'デジタル署名', auditLog: '監査ログ', accessControl: 'アクセス制御',
    
    // Analytics
    totalDocuments: '総ドキュメント数', totalConversions: '総変換数', successRate: '成功率',
    fileTypes: 'ファイルタイプ', activityTypes: 'アクティビティタイプ', insights: 'インサイト',
    
    // Versioning
    versionHistory: 'バージョン履歴', currentVersion: '現在', version: 'バージョン', restoreVersion: '復元',
    
    // Integration
    externalServiceSync: '外部サービス同期', selectService: 'サービスを選択...', syncToService: '同期先',
    syncing: '同期中...', importFromService: 'からインポート',
  },
  ko: {
    // Navigation
    dashboard: '대시보드', convert: '변환', pdfTools: 'PDF 도구', pdfEditor: 'PDF 편집기', formFiller: '양식 작성기',
    ocr: 'OCR', templates: '템플릿', aiGenerator: 'AI 생성기', comparePdfs: 'PDF 비교', aiAssistant: 'AI 어시스턴트',
    collaboration: '협업', projectFiles: '프로젝트 파일', legalDocs: '법률 문서', translation: '번역',
    myFiles: '내 파일', analytics: '분석', apiDocs: 'API 문서', settings: '설정', cloudStorage: '클라우드 스토리지',
    taskAutomation: '작업 자동화', advancedFeatures: '고급 기능', history: '기록', webhooks: 'Webhooks',
    
    // Auth
    signIn: '로그인', signOut: '로그아웃',
    
    // Common Actions
    upload: '업로드', download: '다운로드', delete: '삭제', save: '저장', cancel: '취소',
    confirm: '확인', edit: '편집', share: '공유', search: '검색', filter: '필터', sort: '정렬',
    copy: '복사', clear: '지우기', restore: '복원', sync: '동기화', import: '가져오기', export: '내보내기',
    
    // Cookie Consent
    cookieConsent: '쿠키 동의', privacyPolicy: '개인정보 보호정책', acceptAll: '모두 수락', decline: '거부',
    cookieMessage: '우리는 귀하의 경험을 향상시키고, 사이트 사용을 분석하며, 서비스를 개선하기 위해 쿠키를 사용합니다. 귀하의 개인정보는 우리에게 중요합니다.',
    
    // AI Features
    summarize: '요약', translate: '번역', autoTag: '자동 태그', suggestions: '제안', aiChat: 'AI 채팅',
    review: '검토', workflows: '워크플로우', uploadDocument: '문서 업로드', pasteText: '또는 텍스트 붙여넣기',
    generateSummary: '요약 생성', aiPoweredInsights: 'AI 기반 인사이트', targetLanguage: '대상 언어',
    
    // Status
    processing: '처리 중...', success: '성공', error: '오류', loading: '로딩 중...', complete: '완료',
    pending: '대기 중', failed: '실패', active: '활성', inactive: '비활성',
    
    // Features
    quickConvert: '빠른 변환', enterprise: '엔터프라이즈', startConverting: '변환 시작',
    dropFiles: '변환할 파일을 드롭하세요', copiedToClipboard: '클립보드에 복사됨',
    
    // Security
    security: '보안', encryption: '암호화', passwordProtect: '비밀번호 보호', permissions: '권한',
    watermark: '워터마크', digitalSignature: '디지털 서명', auditLog: '감사 로그', accessControl: '액세스 제어',
    
    // Analytics
    totalDocuments: '총 문서 수', totalConversions: '총 변환 수', successRate: '성공률',
    fileTypes: '파일 유형', activityTypes: '활동 유형', insights: '인사이트',
    
    // Versioning
    versionHistory: '버전 기록', currentVersion: '현재', version: '버전', restoreVersion: '복원',
    
    // Integration
    externalServiceSync: '외부 서비스 동기화', selectService: '서비스 선택...', syncToService: '동기화 대상',
    syncing: '동기화 중...', importFromService: '에서 가져오기',
  },
  ar: {
    // Navigation
    dashboard: 'لوحة التحكم', convert: 'تحويل', pdfTools: 'أدوات PDF', pdfEditor: 'محرر PDF', formFiller: 'ملء النماذج',
    ocr: 'التعرف الضوئي', templates: 'القوالب', aiGenerator: 'مولد الذكاء الاصطناعي', comparePdfs: 'مقارنة PDF', aiAssistant: 'مساعد الذكاء الاصطناعي',
    collaboration: 'التعاون', projectFiles: 'ملفات المشروع', legalDocs: 'المستندات القانونية', translation: 'الترجمة',
    myFiles: 'ملفاتي', analytics: 'التحليلات', apiDocs: 'وثائق API', settings: 'الإعدادات', cloudStorage: 'التخزين السحابي',
    taskAutomation: 'أتمتة المهام', advancedFeatures: 'الميزات المتقدمة', history: 'التاريخ', webhooks: 'Webhooks',
    
    // Auth
    signIn: 'تسجيل الدخول', signOut: 'تسجيل الخروج',
    
    // Common Actions
    upload: 'رفع', download: 'تحميل', delete: 'حذف', save: 'حفظ', cancel: 'إلغاء',
    confirm: 'تأكيد', edit: 'تحرير', share: 'مشاركة', search: 'بحث', filter: 'تصفية', sort: 'ترتيب',
    copy: 'نسخ', clear: 'مسح', restore: 'استعادة', sync: 'مزامنة', import: 'استيراد', export: 'تصدير',
    
    // Cookie Consent
    cookieConsent: 'موافقة ملفات تعريف الارتباط', privacyPolicy: 'سياسة الخصوصية', acceptAll: 'قبول الكل', decline: 'رفض',
    cookieMessage: 'نستخدم ملفات تعريف الارتباط لتحسين تجربتك، وتحليل استخدام الموقع، وتحسين خدماتنا. خصوصيتك مهمة بالنسبة لنا.',
    
    // AI Features
    summarize: 'تلخيص', translate: 'ترجمة', autoTag: 'علامات تلقائية', suggestions: 'اقتراحات', aiChat: 'محادثة الذكاء الاصطناعي',
    review: 'مراجعة', workflows: 'سير العمل', uploadDocument: 'رفع مستند', pasteText: 'أو الصق النص',
    generateSummary: 'إنشاء ملخص', aiPoweredInsights: 'رؤى مدعومة بالذكاء الاصطناعي', targetLanguage: 'اللغة الهدف',
    
    // Status
    processing: 'جارٍ المعالجة...', success: 'نجاح', error: 'خطأ', loading: 'جارٍ التحميل...', complete: 'مكتمل',
    pending: 'قيد الانتظار', failed: 'فشل', active: 'نشط', inactive: 'غير نشط',
    
    // Features
    quickConvert: 'تحويل سريع', enterprise: 'المؤسسة', startConverting: 'بدء التحويل',
    dropFiles: 'إسقاط الملفات للتحويل', copiedToClipboard: 'تم النسخ إلى الحافظة',
    
    // Security
    security: 'الأمان', encryption: 'التشفير', passwordProtect: 'حماية بكلمة مرور', permissions: 'الأذونات',
    watermark: 'علامة مائية', digitalSignature: 'التوقيع الرقمي', auditLog: 'سجل التدقيق', accessControl: 'التحكم في الوصول',
    
    // Analytics
    totalDocuments: 'إجمالي المستندات', totalConversions: 'إجمالي التحويلات', successRate: 'معدل النجاح',
    fileTypes: 'أنواع الملفات', activityTypes: 'أنواع النشاط', insights: 'رؤى',
    
    // Versioning
    versionHistory: 'سجل الإصدارات', currentVersion: 'الحالي', version: 'الإصدار', restoreVersion: 'استعادة',
    
    // Integration
    externalServiceSync: 'مزامنة الخدمة الخارجية', selectService: 'حدد الخدمة...', syncToService: 'مزامنة إلى',
    syncing: 'جارٍ المزامنة...', importFromService: 'استيراد من',
  },
  he: {
    // Navigation
    dashboard: 'לוח בקרה', convert: 'המרה', pdfTools: 'כלי PDF', pdfEditor: 'עורך PDF', formFiller: 'ממלא טפסים',
    ocr: 'OCR', templates: 'תבניות', aiGenerator: 'מחולל AI', comparePdfs: 'השווה PDF', aiAssistant: 'עוזר AI',
    collaboration: 'שיתוף פעולה', projectFiles: 'קבצי פרויקט', legalDocs: 'מסמכים משפטיים', translation: 'תרגום',
    myFiles: 'הקבצים שלי', analytics: 'אנליטיקה', apiDocs: 'תיעוד API', settings: 'הגדרות', cloudStorage: 'אחסון בענן',
    taskAutomation: 'אוטומציה של משימות', advancedFeatures: 'תכונות מתקדמות', history: 'היסטוריה', webhooks: 'Webhooks',
    
    // Auth
    signIn: 'התחבר', signOut: 'התנתק',
    
    // Common Actions
    upload: 'העלה', download: 'הורד', delete: 'מחק', save: 'שמור', cancel: 'בטל',
    confirm: 'אשר', edit: 'ערוך', share: 'שתף', search: 'חפש', filter: 'סנן', sort: 'מיין',
    copy: 'העתק', clear: 'נקה', restore: 'שחזר', sync: 'סנכרן', import: 'ייבא', export: 'ייצא',
    
    // Cookie Consent
    cookieConsent: 'הסכמת עוגיות', privacyPolicy: 'מדיניות פרטיות', acceptAll: 'קבל הכל', decline: 'דחה',
    cookieMessage: 'אנו משתמשים בעוגיות כדי לשפר את החוויה שלך, לנתח שימוש באתר ולשפר את השירותים שלנו. הפרטיות שלך חשובה לנו.',
    
    // AI Features
    summarize: 'סכם', translate: 'תרגם', autoTag: 'תיוג אוטומטי', suggestions: 'הצעות', aiChat: 'צ\'אט AI',
    review: 'סקירה', workflows: 'זרימות עבודה', uploadDocument: 'העלה מסמך', pasteText: 'או הדבק טקסט',
    generateSummary: 'צור סיכום', aiPoweredInsights: 'תובנות מבוססות AI', targetLanguage: 'שפת יעד',
    
    // Status
    processing: 'מעבד...', success: 'הצלחה', error: 'שגיאה', loading: 'טוען...', complete: 'הושלם',
    pending: 'ממתין', failed: 'נכשל', active: 'פעיל', inactive: 'לא פעיל',
    
    // Features
    quickConvert: 'המרה מהירה', enterprise: 'ארגוני', startConverting: 'התחל המרה',
    dropFiles: 'גרור קבצים להמרה', copiedToClipboard: 'הועתק ללוח',
    
    // Security
    security: 'אבטחה', encryption: 'הצפנה', passwordProtect: 'הגנת סיסמה', permissions: 'הרשאות',
    watermark: 'סימן מים', digitalSignature: 'חתימה דיגיטלית', auditLog: 'יומן ביקורת', accessControl: 'בקרת גישה',
    
    // Analytics
    totalDocuments: 'סך המסמכים', totalConversions: 'סך ההמרות', successRate: 'שיעור הצלחה',
    fileTypes: 'סוגי קבצים', activityTypes: 'סוגי פעילות', insights: 'תובנות',
    
    // Versioning
    versionHistory: 'היסטוריית גרסאות', currentVersion: 'נוכחי', version: 'גרסה', restoreVersion: 'שחזר',
    
    // Integration
    externalServiceSync: 'סנכרון שירות חיצוני', selectService: 'בחר שירות...', syncToService: 'סנכרן אל',
    syncing: 'מסנכרן...', importFromService: 'ייבא מ',
  },
  hi: {
    // Navigation
    dashboard: 'डैशबोर्ड', convert: 'रूपांतरण', pdfTools: 'PDF उपकरण', pdfEditor: 'PDF संपादक', formFiller: 'फॉर्म भरने वाला',
    ocr: 'OCR', templates: 'टेम्पलेट्स', aiGenerator: 'AI जेनरेटर', comparePdfs: 'PDF तुलना', aiAssistant: 'AI सहायक',
    collaboration: 'सहयोग', projectFiles: 'प्रोजेक्ट फाइलें', legalDocs: 'कानूनी दस्तावेज', translation: 'अनुवाद',
    myFiles: 'मेरी फाइलें', analytics: 'विश्लेषिकी', apiDocs: 'API दस्तावेज', settings: 'सेटिंग्स', cloudStorage: 'क्लाउड स्टोरेज',
    taskAutomation: 'कार्य स्वचालन', advancedFeatures: 'उन्नत सुविधाएँ', history: 'इतिहास', webhooks: 'Webhooks',
    
    // Auth
    signIn: 'साइन इन', signOut: 'साइन आउट',
    
    // Common Actions
    upload: 'अपलोड', download: 'डाउनलोड', delete: 'हटाएं', save: 'सेव करें', cancel: 'रद्द करें',
    confirm: 'पुष्टि करें', edit: 'संपादित करें', share: 'साझा करें', search: 'खोजें', filter: 'फ़िल्टर', sort: 'क्रमबद्ध करें',
    copy: 'कॉपी', clear: 'साफ करें', restore: 'पुनर्स्थापित करें', sync: 'समन्वयित करें', import: 'आयात करें', export: 'निर्यात करें',
    
    // Cookie Consent
    cookieConsent: 'कुकी सहमति', privacyPolicy: 'गोपनीयता नीति', acceptAll: 'सभी स्वीकार करें', decline: 'अस्वीकार करें',
    cookieMessage: 'हम आपके अनुभव को बेहतर बनाने, साइट उपयोग का विश्लेषण करने और अपनी सेवाओं में सुधार करने के लिए कुकीज़ का उपयोग करते हैं। आपकी गोपनीयता हमारे लिए महत्वपूर्ण है।',
    
    // AI Features
    summarize: 'सारांश', translate: 'अनुवाद', autoTag: 'ऑटो टैग', suggestions: 'सुझाव', aiChat: 'AI चैट',
    review: 'समीक्षा', workflows: 'वर्कफ्लो', uploadDocument: 'दस्तावेज़ अपलोड करें', pasteText: 'या टेक्स्ट पेस्ट करें',
    generateSummary: 'सारांश उत्पन्न करें', aiPoweredInsights: 'AI संचालित अंतर्दृष्टि', targetLanguage: 'लक्ष्य भाषा',
    
    // Status
    processing: 'प्रोसेसिंग...', success: 'सफलता', error: 'त्रुटि', loading: 'लोड हो रहा है...', complete: 'पूर्ण',
    pending: 'लंबित', failed: 'विफल', active: 'सक्रिय', inactive: 'निष्क्रिय',
    
    // Features
    quickConvert: 'त्वरित रूपांतरण', enterprise: 'उद्यम', startConverting: 'रूपांतरण शुरू करें',
    dropFiles: 'रूपांतरण के लिए फाइलें ड्रॉप करें', copiedToClipboard: 'क्लिपबोर्ड पर कॉपी किया गया',
    
    // Security
    security: 'सुरक्षा', encryption: 'एन्क्रिप्शन', passwordProtect: 'पासवर्ड सुरक्षा', permissions: 'अनुमतियाँ',
    watermark: 'वॉटरमार्क', digitalSignature: 'डिजिटल हस्ताक्षर', auditLog: 'ऑडिट लॉग', accessControl: 'एक्सेस नियंत्रण',
    
    // Analytics
    totalDocuments: 'कुल दस्तावेज़', totalConversions: 'कुल रूपांतरण', successRate: 'सफलता दर',
    fileTypes: 'फ़ाइल प्रकार', activityTypes: 'गतिविधि प्रकार', insights: 'अंतर्दृष्टि',
    
    // Versioning
    versionHistory: 'संस्करण इतिहास', currentVersion: 'वर्तमान', version: 'संस्करण', restoreVersion: 'पुनर्स्थापित करें',
    
    // Integration
    externalServiceSync: 'बाहरी सेवा समन्वयन', selectService: 'सेवा चुनें...', syncToService: 'समन्वयन करें',
    syncing: 'समन्वयन हो रहा है...', importFromService: 'से आयात करें',
  },
  ta: {
    // Navigation
    dashboard: 'டாஷ்போர்டு', convert: 'மாற்று', pdfTools: 'PDF கருவிகள்', pdfEditor: 'PDF எடிட்டர்', formFiller: 'படிவம் நிரப்பி',
    ocr: 'OCR', templates: 'வார்ப்புருக்கள்', aiGenerator: 'AI ஜெனரேட்டர்', comparePdfs: 'PDF ஒப்பிடு', aiAssistant: 'AI உதவியாளர்',
    collaboration: 'ஒத்துழைப்பு', projectFiles: 'திட்ட கோப்புகள்', legalDocs: 'சட்ட ஆவணங்கள்', translation: 'மொழிபெயர்ப்பு',
    myFiles: 'எனது கோப்புகள்', analytics: 'பகுப்பாய்வு', apiDocs: 'API ஆவணங்கள்', settings: 'அமைப்புகள்', cloudStorage: 'கிளவுட் சேமிப்பு',
    taskAutomation: 'பணி தானியங்கு', advancedFeatures: 'மேம்பட்ட அம்சங்கள்', history: 'வரலாறு', webhooks: 'Webhooks',
    
    // Auth
    signIn: 'உள்நுழை', signOut: 'வெளியேறு',
    
    // Common Actions
    upload: 'பதிவேற்று', download: 'பதிவிறக்கு', delete: 'நீக்கு', save: 'சேமி', cancel: 'ரத்துசெய்',
    confirm: 'உறுதிசெய்', edit: 'திருத்து', share: 'பகிர்', search: 'தேடு', filter: 'வடிகட்டு', sort: 'வரிசைப்படுத்து',
    copy: 'நகலெடு', clear: 'அழி', restore: 'மீட்டமை', sync: 'ஒத்திசை', import: 'இறக்குமதி', export: 'ஏற்றுமதி',
    
    // Cookie Consent
    cookieConsent: 'குக்கீ ஒப்புதல்', privacyPolicy: 'தனியுரிமை கொள்கை', acceptAll: 'அனைத்தையும் ஏற்கவும்', decline: 'மறுக்கவும்',
    cookieMessage: 'உங்கள் அனுபவத்தை மேம்படுத்த, தள பயன்பாட்டை பகுப்பாய்வு செய்ய மற்றும் எங்கள் சேவைகளை மேம்படுத்த நாங்கள் குக்கீகளைப் பயன்படுத்துகிறோம். உங்கள் தனியுரிமை எங்களுக்கு முக்கியம்.',
    
    // AI Features
    summarize: 'சுருக்கம்', translate: 'மொழிபெயர்', autoTag: 'தானாக குறியிடு', suggestions: 'பரிந்துரைகள்', aiChat: 'AI அரட்டை',
    review: 'மதிப்பாய்வு', workflows: 'பணிப்பாய்வுகள்', uploadDocument: 'ஆவணத்தைப் பதிவேற்றவும்', pasteText: 'அல்லது உரையை ஒட்டவும்',
    generateSummary: 'சுருக்கத்தை உருவாக்கவும்', aiPoweredInsights: 'AI இயக்கப்பட்ட நுண்ணறிவு', targetLanguage: 'இலக்கு மொழி',
    
    // Status
    processing: 'செயலாக்கப்படுகிறது...', success: 'வெற்றி', error: 'பிழை', loading: 'ஏற்றுகிறது...', complete: 'முடிந்தது',
    pending: 'நிலுவையில்', failed: 'தோல்வியுற்றது', active: 'செயலில்', inactive: 'செயலற்றது',
    
    // Features
    quickConvert: 'விரைவு மாற்றம்', enterprise: 'நிறுவனம்', startConverting: 'மாற்றத்தைத் தொடங்கவும்',
    dropFiles: 'மாற்ற கோப்புகளை விடவும்', copiedToClipboard: 'கிளிப்போர்டுக்கு நகலெடுக்கப்பட்டது',
    
    // Security
    security: 'பாதுகாப்பு', encryption: 'குறியாக்கம்', passwordProtect: 'கடவுச்சொல் பாதுகாப்பு', permissions: 'அனுமதிகள்',
    watermark: 'நீர்முத்திரை', digitalSignature: 'டிஜிட்டல் கையொப்பம்', auditLog: 'தணிக்கை பதிவு', accessControl: 'அணுகல் கட்டுப்பாடு',
    
    // Analytics
    totalDocuments: 'மொத்த ஆவணங்கள்', totalConversions: 'மொத்த மாற்றங்கள்', successRate: 'வெற்றி விகிதம்',
    fileTypes: 'கோப்பு வகைகள்', activityTypes: 'செயல்பாடு வகைகள்', insights: 'நுண்ணறிவு',
    
    // Versioning
    versionHistory: 'பதிப்பு வரலாறு', currentVersion: 'தற்போதைய', version: 'பதிப்பு', restoreVersion: 'மீட்டமை',
    
    // Integration
    externalServiceSync: 'வெளிப்புற சேவை ஒத்திசைவு', selectService: 'சேவையைத் தேர்ந்தெடுக்கவும்...', syncToService: 'ஒத்திசைக்க',
    syncing: 'ஒத்திசைக்கிறது...', importFromService: 'இலிருந்து இறக்குமதி',
  },
  bn: {
    // Navigation
    dashboard: 'ড্যাশবোর্ড', convert: 'রূপান্তর', pdfTools: 'PDF টুলস', pdfEditor: 'PDF সম্পাদক', formFiller: 'ফর্ম পূরণকারী',
    ocr: 'OCR', templates: 'টেমপ্লেট', aiGenerator: 'AI জেনারেটর', comparePdfs: 'PDF তুলনা', aiAssistant: 'AI সহায়ক',
    collaboration: 'সহযোগিতা', projectFiles: 'প্রকল্প ফাইল', legalDocs: 'আইনি নথি', translation: 'অনুবাদ',
    myFiles: 'আমার ফাইল', analytics: 'বিশ্লেষণ', apiDocs: 'API ডকুমেন্টেশন', settings: 'সেটিংস', cloudStorage: 'ক্লাউড স্টোরেজ',
    taskAutomation: 'টাস্ক অটোমেশন', advancedFeatures: 'উন্নত বৈশিষ্ট্য', history: 'ইতিহাস', webhooks: 'Webhooks',
    
    // Auth
    signIn: 'সাইন ইন', signOut: 'সাইন আউট',
    
    // Common Actions
    upload: 'আপলোড', download: 'ডাউনলোড', delete: 'মুছুন', save: 'সংরক্ষণ', cancel: 'বাতিল',
    confirm: 'নিশ্চিত', edit: 'সম্পাদনা', share: 'শেয়ার', search: 'অনুসন্ধান', filter: 'ফিল্টার', sort: 'সাজান',
    copy: 'কপি', clear: 'পরিষ্কার', restore: 'পুনরুদ্ধার', sync: 'সিঙ্ক', import: 'আমদানি', export: 'রপ্তানি',
    
    // Cookie Consent
    cookieConsent: 'কুকি সম্মতি', privacyPolicy: 'গোপনীয়তা নীতি', acceptAll: 'সব গ্রহণ করুন', decline: 'প্রত্যাখ্যান',
    cookieMessage: 'আমরা আপনার অভিজ্ঞতা উন্নত করতে, সাইট ব্যবহার বিশ্লেষণ করতে এবং আমাদের সেবা উন্নত করতে কুকি ব্যবহার করি। আপনার গোপনীয়তা আমাদের কাছে গুরুত্বপূর্ণ।',
    
    // AI Features
    summarize: 'সংক্ষিপ্ত', translate: 'অনুবাদ', autoTag: 'স্বয়ংক্রিয় ট্যাগ', suggestions: 'পরামর্শ', aiChat: 'AI চ্যাট',
    review: 'পর্যালোচনা', workflows: 'ওয়ার্কফ্লো', uploadDocument: 'নথি আপলোড করুন', pasteText: 'অথবা টেক্সট পেস্ট করুন',
    generateSummary: 'সংক্ষিপ্তসার তৈরি করুন', aiPoweredInsights: 'AI চালিত অন্তর্দৃষ্টি', targetLanguage: 'লক্ষ্য ভাষা',
    
    // Status
    processing: 'প্রক্রিয়াকরণ...', success: 'সফল', error: 'ত্রুটি', loading: 'লোড হচ্ছে...', complete: 'সম্পূর্ণ',
    pending: 'অপেক্ষমান', failed: 'ব্যর্থ', active: 'সক্রিয়', inactive: 'নিষ্ক্রিয়',
    
    // Features
    quickConvert: 'দ্রুত রূপান্তর', enterprise: 'এন্টারপ্রাইজ', startConverting: 'রূপান্তর শুরু করুন',
    dropFiles: 'রূপান্তরের জন্য ফাইল ড্রপ করুন', copiedToClipboard: 'ক্লিপবোর্ডে কপি করা হয়েছে',
    
    // Security
    security: 'নিরাপত্তা', encryption: 'এনক্রিপশন', passwordProtect: 'পাসওয়ার্ড সুরক্ষা', permissions: 'অনুমতি',
    watermark: 'ওয়াটারমার্ক', digitalSignature: 'ডিজিটাল স্বাক্ষর', auditLog: 'অডিট লগ', accessControl: 'অ্যাক্সেস নিয়ন্ত্রণ',
    
    // Analytics
    totalDocuments: 'মোট নথি', totalConversions: 'মোট রূপান্তর', successRate: 'সাফল্যের হার',
    fileTypes: 'ফাইলের ধরন', activityTypes: 'কার্যকলাপের ধরন', insights: 'অন্তর্দৃষ্টি',
    
    // Versioning
    versionHistory: 'সংস্করণ ইতিহাস', currentVersion: 'বর্তমান', version: 'সংস্করণ', restoreVersion: 'পুনরুদ্ধার',
    
    // Integration
    externalServiceSync: 'বাহ্যিক সেবা সিঙ্ক', selectService: 'সেবা নির্বাচন করুন...', syncToService: 'সিঙ্ক করুন',
    syncing: 'সিঙ্ক হচ্ছে...', importFromService: 'থেকে আমদানি',
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

  const t = (key) => {
    const translation = translations[language]?.[key] || translations['en']?.[key] || key;
    return translation;
  };

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