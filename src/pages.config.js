import Dashboard from './pages/Dashboard';
import Convert from './pages/Convert';
import PDFTools from './pages/PDFTools';
import Files from './pages/Files';
import History from './pages/History';
import Settings from './pages/Settings';
import AIAssistant from './pages/AIAssistant';
import Compare from './pages/Compare';
import CloudStorage from './pages/CloudStorage';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Dashboard": Dashboard,
    "Convert": Convert,
    "PDFTools": PDFTools,
    "Files": Files,
    "History": History,
    "Settings": Settings,
    "AIAssistant": AIAssistant,
    "Compare": Compare,
    "CloudStorage": CloudStorage,
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
    Layout: __Layout,
};