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
import AIContentGen from './pages/AIContentGen';
import AIDocGenerator from './pages/AIDocGenerator';
import APIDocs from './pages/APIDocs';
import APIIntegrations from './pages/APIIntegrations';
import AdvancedFeatures from './pages/AdvancedFeatures';
import Analytics from './pages/Analytics';
import CloudStorage from './pages/CloudStorage';
import Collaboration from './pages/Collaboration';
import Compare from './pages/Compare';
import Convert from './pages/Convert';
import CustomDashboard from './pages/CustomDashboard';
import Dashboard from './pages/Dashboard';
import Files from './pages/Files';
import FormFiller from './pages/FormFiller';
import Guide from './pages/Guide';
import History from './pages/History';
import LegalDocs from './pages/LegalDocs';
import OCR from './pages/OCR';
import Offline from './pages/Offline';
import PDFEditor from './pages/PDFEditor';
import PDFTools from './pages/PDFTools';
import Profile from './pages/Profile';
import ProjectFiles from './pages/ProjectFiles';
import Search from './pages/Search';
import Security from './pages/Security';
import Settings from './pages/Settings';
import Subscription from './pages/Subscription';
import TaskAutomation from './pages/TaskAutomation';
import TeamDashboard from './pages/TeamDashboard';
import Templates from './pages/Templates';
import TranslationMemory from './pages/TranslationMemory';
import Webhooks from './pages/Webhooks';
import OAuthSetupGuide from './pages/OAuthSetupGuide';
import __Layout from './Layout.jsx';


export const PAGES = {
    "AIAssistant": AIAssistant,
    "AIContentGen": AIContentGen,
    "AIDocGenerator": AIDocGenerator,
    "APIDocs": APIDocs,
    "APIIntegrations": APIIntegrations,
    "AdvancedFeatures": AdvancedFeatures,
    "Analytics": Analytics,
    "CloudStorage": CloudStorage,
    "Collaboration": Collaboration,
    "Compare": Compare,
    "Convert": Convert,
    "CustomDashboard": CustomDashboard,
    "Dashboard": Dashboard,
    "Files": Files,
    "FormFiller": FormFiller,
    "Guide": Guide,
    "History": History,
    "LegalDocs": LegalDocs,
    "OCR": OCR,
    "Offline": Offline,
    "PDFEditor": PDFEditor,
    "PDFTools": PDFTools,
    "Profile": Profile,
    "ProjectFiles": ProjectFiles,
    "Search": Search,
    "Security": Security,
    "Settings": Settings,
    "Subscription": Subscription,
    "TaskAutomation": TaskAutomation,
    "TeamDashboard": TeamDashboard,
    "Templates": Templates,
    "TranslationMemory": TranslationMemory,
    "Webhooks": Webhooks,
    "OAuthSetupGuide": OAuthSetupGuide,
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
    Layout: __Layout,
};