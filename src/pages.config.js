import Dashboard from './pages/Dashboard';
import Convert from './pages/Convert';
import PDFTools from './pages/PDFTools';
import Files from './pages/Files';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Dashboard": Dashboard,
    "Convert": Convert,
    "PDFTools": PDFTools,
    "Files": Files,
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
    Layout: __Layout,
};