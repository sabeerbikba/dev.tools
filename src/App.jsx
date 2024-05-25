import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from '@vercel/analytics/react';

import { lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Layout from "./Layout";
import NoPage from "./pages/NoPage";
import SuspenseWithFallback from "./components/SuspenseWithFallback.jsx";

import SearchEngine from "./pages/SearchEngine.jsx";
const LiveHtml = lazy(() => import("./pages/LiveHtml.jsx"));
import LiveReact from './pages/LiveReact.jsx';
const MetaTagsGenrator = lazy(() => import("./pages/MetaTagsGenrator.jsx"));
const TypescriptPlayground = lazy(() => import('./pages/TypescriptPlayground.jsx'));
const GrapesJSEditor = lazy(() => import("./pages/GrapesJSEditor.jsx"));
const LoremIpsumGenerator = lazy(() => import("./pages/LoremIpsumGenrator.jsx"));
import UnitConverter from "./pages/UnitConverter.jsx";
const MarkdownEditor = lazy(() => import("./pages/MarkdownEditor.jsx"));
import CharacterAndWordCounter from "./pages/CharacterAndWordCounter.jsx";
const ColorConverter = lazy(() => import('./pages/ColorConverter.jsx'));
const AutoprefixerTool = lazy(() => import("./pages/AutoPrefixer.jsx"));
import StringConverter from './pages/StringConverter.jsx';
const QrCodeGenerator = lazy(() => import('./pages/QRCodeGenrator.jsx'));
const HashGenerator = lazy(() => import('./pages/HashGenerator.jsx'));
import Websites from "./pages/Websites.jsx";
// import Test from "./pages/testing/Test.jsx" // Testing purpose

const routes = [
   { path: "/", element: <SearchEngine />, index: true },
   { path: "SearchEngine", element: <SearchEngine /> },
   { path: "LiveHtml", element: <LiveHtml />, isLazy: true },
   { path: "LiveReact", element: <LiveReact /> },
   { path: "MetaTagsGenrator", element: <MetaTagsGenrator />, isLazy: true },
   { path: "TypescriptPlayground", element: <TypescriptPlayground />, isLazy: true, fallbackText: 'Downloading TypeScript...' },
   { path: "GrapesjsEditor", element: <GrapesJSEditor />, isLazy: true },
   { path: "LoremIpsumGenrator", element: <LoremIpsumGenerator />, isLazy: true },
   { path: "UnitConverter", element: <UnitConverter /> },
   { path: "MarkdownEditor", element: <MarkdownEditor />, isLazy: true },
   { path: "CharacterAndWordCounter", element: <CharacterAndWordCounter /> },
   { path: "ColorConverter", element: <ColorConverter />, isLazy: true },
   { path: "Browser-Ready-CSS", element: <AutoprefixerTool />, isLazy: true },
   { path: "StringConverter", element: <StringConverter /> },
   { path: "QrCodeGenerator", element: <QrCodeGenerator />, isLazy: true },
   { path: "HashGenerator", element: <HashGenerator />, isLazy: true },
   { path: "Websites", element: <Websites /> },
   // { path: "Test", element: <Test /> },
   { path: "*", element: <NoPage /> },
];

export default function App() {

   return (
      <>
         <BrowserRouter>
            <Routes>
               <Route path="/" element={<Layout />}>
                  {routes.map(({ path, element, isLazy, index, fallbackText }) => (
                     <Route
                        key={path}
                        path={path}
                        index={index}
                        element={
                           isLazy ? (
                              <SuspenseWithFallback text={fallbackText}>
                                 {element}
                              </SuspenseWithFallback>
                           ) : (
                              element
                           )
                        }
                     />
                  ))}
               </Route>
            </Routes>
         </BrowserRouter>
         <ToastContainer />
         {/* // vercel */}
         <SpeedInsights />
         <Analytics />
      </>
   );
}