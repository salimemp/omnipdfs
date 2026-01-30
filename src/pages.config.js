/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import AIAssistant from './pages/AIAssistant';
import AIDocGenerator from './pages/AIDocGenerator';
import APIDocs from './pages/APIDocs';
import Analytics from './pages/Analytics';
import CloudStorage from './pages/CloudStorage';
import Collaboration from './pages/Collaboration';
import Compare from './pages/Compare';
import Convert from './pages/Convert';
import Dashboard from './pages/Dashboard';
import Files from './pages/Files';
import FormFiller from './pages/FormFiller';
import History from './pages/History';
import LegalDocs from './pages/LegalDocs';
import OCR from './pages/OCR';
import PDFEditor from './pages/PDFEditor';
import PDFTools from './pages/PDFTools';
import ProjectFiles from './pages/ProjectFiles';
import Security from './pages/Security';
import Settings from './pages/Settings';
import Templates from './pages/Templates';
import TranslationMemory from './pages/TranslationMemory';
import Webhooks from './pages/Webhooks';
import __Layout from './Layout.jsx';


export const PAGES = {
    "AIAssistant": AIAssistant,
    "AIDocGenerator": AIDocGenerator,
    "APIDocs": APIDocs,
    "Analytics": Analytics,
    "CloudStorage": CloudStorage,
    "Collaboration": Collaboration,
    "Compare": Compare,
    "Convert": Convert,
    "Dashboard": Dashboard,
    "Files": Files,
    "FormFiller": FormFiller,
    "History": History,
    "LegalDocs": LegalDocs,
    "OCR": OCR,
    "PDFEditor": PDFEditor,
    "PDFTools": PDFTools,
    "ProjectFiles": ProjectFiles,
    "Security": Security,
    "Settings": Settings,
    "Templates": Templates,
    "TranslationMemory": TranslationMemory,
    "Webhooks": Webhooks,
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
    Layout: __Layout,
};