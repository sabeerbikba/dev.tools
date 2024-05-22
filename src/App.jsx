import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from '@vercel/analytics/react';

import { useEffect, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import { isMobile } from 'react-device-detect';
import 'react-toastify/dist/ReactToastify.css';

import Layout from "./Layout";
import NoPage from "./pages/NoPage";
import SuspenseWithFallback from "./components/SuspenseWithFallback.jsx";
import { TypescriptPlaygroundFallback } from './pages/TypescriptPlayground.jsx';

import SearchEngine from "./pages/SearchEngine.jsx";
const LiveHtml = lazy(() => import("./pages/LiveHtml.jsx"));
const MetaTagsGenrator = lazy(() => import("./pages/MetaTagsGenrator.jsx"));
const TypescriptPlayground = lazy(() => import('./pages/TypescriptPlayground.jsx'));
const GrapesJSEditor = lazy(() => import("./pages/GrapesJSEditor.jsx"));
import UnitConverter from "./pages/UnitConverter.jsx";
import CharacterAndWordCounter from "./pages/CharacterAndWordCounter.jsx";
const ColorConverter = lazy(() => import('./pages/ColorConverter.jsx'));
const AutoprefixerTool = lazy(() => import("./pages/AutoPrefixer.jsx"));
import StringConverter from './pages/StringConverter.jsx';
const QrCodeGenerator = lazy(() => import('./pages/QRCodeGenrator.jsx'));
const HashGenerator = lazy(() => import('./pages/HashGenerator.jsx'));
import Websites from "./pages/Websites.jsx";
// import Test from "./pages/testing/Test.jsx" // Testing purpose

export default function App() {
   useEffect(() => {
      if (isMobile) {
         toast.warn('Warning: This website is best viewed on a larger screen.', {
            position: toast.POSITION.BOTTOM_CENTER,
            autoClose: 5000,
         });
      }
   }, []);

   return (
      <>
         <BrowserRouter>
            <Routes>
               <Route path="/" element={<Layout />}>
                  <Route index element={<SearchEngine />} />
                  <Route path="SearchEngine" element={<SearchEngine />} />
                  <Route path="LiveHtml" element={<SuspenseWithFallback><LiveHtml /></SuspenseWithFallback>} />
                  <Route path="MetaTagsGenrator" element={<SuspenseWithFallback><MetaTagsGenrator /></SuspenseWithFallback>} />
                  <Route path="TypescriptPlayground" element={<SuspenseWithFallback fallback={<TypescriptPlaygroundFallback />}><TypescriptPlayground /></SuspenseWithFallback>} />
                  <Route path="GrapesjsEditor" element={<SuspenseWithFallback><GrapesJSEditor /></SuspenseWithFallback>} />
                  <Route path="UnitConverter" element={<UnitConverter />} />
                  <Route path="CharacterAndWordCounter" element={<CharacterAndWordCounter />} />
                  <Route path="ColorConverter" element={<SuspenseWithFallback><ColorConverter /></SuspenseWithFallback>} />
                  <Route path="Browser-Ready-CSS" element={<SuspenseWithFallback><AutoprefixerTool /></SuspenseWithFallback>} />
                  <Route path="StringConverter" element={<StringConverter />} />
                  <Route path="QrCodeGenerator" element={<SuspenseWithFallback><QrCodeGenerator /></SuspenseWithFallback>} />
                  <Route path="HashGenerator" element={<SuspenseWithFallback><HashGenerator /></SuspenseWithFallback>} />
                  <Route path="Websites" element={<Websites />} />
                  {/* <Route path="Test" element={<Test />} /> */}
                  <Route path="*" element={<NoPage />} />
               </Route>
            </Routes>
         </BrowserRouter>
         <ToastContainer />
         {/* // vercel */}
         {/* <SpeedInsights /> */}
         {/* <Analytics /> */}
      </>
   );
}