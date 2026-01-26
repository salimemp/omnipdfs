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
import OCR from './pages/OCR';
import PDFEditor from './pages/PDFEditor';
import PDFTools from './pages/PDFTools';
import Settings from './pages/Settings';
import Templates from './pages/Templates';
import TranslationMemory from './pages/TranslationMemory';
import Webhooks from './pages/Webhooks';
import LegalDocs from './pages/LegalDocs';
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
    "OCR": OCR,
    "PDFEditor": PDFEditor,
    "PDFTools": PDFTools,
    "Settings": Settings,
    "Templates": Templates,
    "TranslationMemory": TranslationMemory,
    "Webhooks": Webhooks,
    "LegalDocs": LegalDocs,
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
    Layout: __Layout,
};