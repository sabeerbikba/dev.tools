import { useEffect, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import { isMobile } from 'react-device-detect';
import 'react-toastify/dist/ReactToastify.css';

import Layout from "./Layout";
import NoPage from "./pages/NoPage";
import useSuspenseWithFallback from "./hooks/useSuspenseWithFallback.jsx";

import SearchEngine from "./pages/SearchEngine.jsx";
import LiveHtml from "./pages/LiveHtml.jsx";
const MetaTagsGenrator = lazy(() => import("./pages/MetaTagsGenrator.jsx"));
const GrapesJSEditor = lazy(() => import("./pages/GrapesJSEditor.jsx"));
import UnitConverter from "./pages/UnitConverter.jsx";
import CharacterAndWordCounterComponent from "./pages/CharacterAndWordCounterComponent.jsx";
import ColorConverterComponent from './pages/ColorConverterComponent.jsx';
const AutoprefixerTool = lazy(() => import("./pages/AutoPrefixer.jsx"));
import StringConverterComponent from './pages/StringConverterComponent.jsx';
import QrCodeGeneratorComponent from './pages/QRCodeGenratorComponent.jsx';
const HashGeneratorComponent = lazy(() => import('./pages/HashGeneratorComponent.jsx'));
import Websites from "./pages/Websites.jsx";
// import Test from "./pages/testing/Test.jsx";

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
            <Route path="*" element={<NoPage />} />
            <Route index path="SearchEngine" element={<SearchEngine />} />
            <Route path="LiveHtml" element={<LiveHtml />} />
            <Route path="MetaTagsGenrator" element={useSuspenseWithFallback(<MetaTagsGenrator />)} />
            <Route path="GrapesJSEditor" element={useSuspenseWithFallback(<GrapesJSEditor />)} />
            <Route path="UnitConverter" element={<UnitConverter />} />
            <Route path="CharacterAndWordCounter" element={<CharacterAndWordCounterComponent />} />
            <Route path="ColorConverter" element={<ColorConverterComponent />} />
            <Route path="Browser-Ready-CSS" element={useSuspenseWithFallback(<AutoprefixerTool />)} />
            <Route path="StringConverter" element={<StringConverterComponent />} />
            <Route path="QrCodeGenerator" element={<QrCodeGeneratorComponent />} />
            <Route path="HashGenerator" element={useSuspenseWithFallback(<HashGeneratorComponent />)} />
            <Route path="Websites" element={<Websites />} />
            {/* <Route path="Test" element={<Test />} /> */}
          </Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </>
  );
}