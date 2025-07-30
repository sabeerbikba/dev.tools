import { lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Analytics } from '@vercel/analytics/react';

import Layout from "@/Layout";
import NoPage from "@/pages/NoPage";
import SuspenseWithFallback from "@/components/SuspenseWithFallback";

import SearchEngine from "./pages/SearchEngine";
const LiveHtml = lazy(() => import("./pages/LiveHtml"));
import LiveReact from './pages/LiveReact';
const MetaTagsGenrator = lazy(() => import("@/pages/MetaTagsGenrator"));
const ImgPlaceholderGen = lazy(() => import("@/pages/ImgPlaceholderGen"));
const SQIPPreviewer = lazy(() => import("@/pages/SQIPPreviewer"));
const TypescriptPlayground = lazy(() => import('@/pages/TypescriptPlayground'));
const GrapesJSEditor = lazy(() => import("@/pages/GrapesJSEditor"));
const LoremIpsumGenerator = lazy(() => import("@/pages/LoremIpsumGenrator"));
import UnitConverter from "@/pages/UnitConverter";
const MarkdownEditor = lazy(() => import("@/pages/MarkdownEditor"));
const DiffViewer = lazy(() => import("@/pages/DiffViewer"));
import CharacterAndWordCounter from "@/pages/CharacterAndWordCounter";
const ColorConverter = lazy(() => import('@/pages/ColorConverter'));
const AutoprefixerTool = lazy(() => import("@/pages/AutoPrefixer"));
import StringConverter from '@/pages/StringConverter';
const QrCodeGenerator = lazy(() => import('@/pages/QRCodeGenrator'));
const HashGenerator = lazy(() => import('@/pages/HashGenerator'));
const ImageMetadataViewer = lazy(() => import('@/pages/ImageMetadataViewer'));
import Websites from "@/pages/Websites";
// import Test from "./pages/testing/Test" // Testing purpose

const routes = [
   { path: "/", element: <SearchEngine />, index: true },
   { path: "search-engines", element: <SearchEngine /> },
   { path: "live-html", element: <LiveHtml />, isLazy: true },
   { path: "live-react", element: <LiveReact /> },
   { path: "meta-tags-genrator", element: <MetaTagsGenrator />, isLazy: true },
   { path: "image-placeholder-generator", element: <ImgPlaceholderGen />, isLazy: true },
   { path: "sqip-lqip-previewer", element: <SQIPPreviewer />, isLazy: true },
   { path: "typescript-playground", element: <TypescriptPlayground />, isLazy: true, fallbackText: 'Downloading TypeScript...' },
   { path: "grapes-js-editor", element: <GrapesJSEditor />, isLazy: true },
   { path: "lorem-ipsum-genrator", element: <LoremIpsumGenerator />, isLazy: true },
   { path: "unit-converter", element: <UnitConverter /> },
   { path: "markdown-editor", element: <MarkdownEditor />, isLazy: true },
   { path: "diff-viewer", element: <DiffViewer />, isLazy: true },
   { path: "character-and-word-counter", element: <CharacterAndWordCounter /> },
   { path: "color-converter", element: <ColorConverter />, isLazy: true },
   { path: "browser-ready-css", element: <AutoprefixerTool />, isLazy: true },
   { path: "string-converter", element: <StringConverter /> },
   { path: "qr-code-generator", element: <QrCodeGenerator />, isLazy: true },
   { path: "hash-generator", element: <HashGenerator />, isLazy: true },
   { path: "image-metadata-viewer", element: <ImageMetadataViewer />, isLazy: true },
   { path: "websites", element: <Websites /> },
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
         {process.env.NODE_ENV === 'production' && <Analytics />}
      </>
   );
}
