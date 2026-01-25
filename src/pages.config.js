import AIAssistant from './pages/AIAssistant';
import CloudStorage from './pages/CloudStorage';
import Compare from './pages/Compare';
import Convert from './pages/Convert';
import Dashboard from './pages/Dashboard';
import Files from './pages/Files';
import History from './pages/History';
import OCR from './pages/OCR';
import PDFEditor from './pages/PDFEditor';
import PDFTools from './pages/PDFTools';
import Settings from './pages/Settings';
import Templates from './pages/Templates';
import Webhooks from './pages/Webhooks';
import AIDocGenerator from './pages/AIDocGenerator';
import Collaboration from './pages/Collaboration';
import FormFiller from './pages/FormFiller';
import Analytics from './pages/Analytics';
import APIDocs from './pages/APIDocs';
import TranslationMemory from './pages/TranslationMemory';
import __Layout from './Layout.jsx';


export const PAGES = {
    "AIAssistant": AIAssistant,
    "CloudStorage": CloudStorage,
    "Compare": Compare,
    "Convert": Convert,
    "Dashboard": Dashboard,
    "Files": Files,
    "History": History,
    "OCR": OCR,
    "PDFEditor": PDFEditor,
    "PDFTools": PDFTools,
    "Settings": Settings,
    "Templates": Templates,
    "Webhooks": Webhooks,
    "AIDocGenerator": AIDocGenerator,
    "Collaboration": Collaboration,
    "FormFiller": FormFiller,
    "Analytics": Analytics,
    "APIDocs": APIDocs,
    "TranslationMemory": TranslationMemory,
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
    Layout: __Layout,
};