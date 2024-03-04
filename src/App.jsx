// import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { isMobile } from 'react-device-detect';

import Layout from "./Layout";
import NoPage from "./pages/NoPage";
import GrapesJSEditor from "./pages/GrapesJSEditor.jsx";
import CharacterAndWordCounterComponent from "./pages/CharacterAndWordCounterComponent.jsx";
import ColorConverterComponent from './pages/ColorConverterComponent.jsx';
import HashGeneratorComponent from './pages/HashGeneratorComponent.jsx';
import QrCodeGeneratorComponent from './pages/QRCodeGenratorComponent.jsx';
import StringConverterComponent from './pages/StringConverterComponent.jsx';
import UnitConverter from "./pages/UnitConverter.jsx";
import Websites from "./pages/Websites.jsx";
import AutoprefixerTool from "./pages/AutoPrefixer.jsx";
import SearchEngine from "./pages/SearchEngine.jsx";
import MetaTagsGenrator from "./pages/MetaTagsGenrator.jsx";
import Test from "./pages/testing/Test.jsx";
import LiveHtml from "./pages/LiveHtml.jsx";

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
            <Route index element={<SearchEngine />} />
            <Route path="UnitConverter" element={<UnitConverter />} />
            <Route path="GrapesJSEditor" element={<GrapesJSEditor />} />
            <Route path="CharacterAndWordCounter" element={<CharacterAndWordCounterComponent />} />
            <Route path="ColorConverter" element={<ColorConverterComponent />} />
            <Route path="HashGenerator" element={<HashGeneratorComponent />} />
            <Route path=" QrCodeGenerator" element={< QrCodeGeneratorComponent />} />
            <Route path="StringConverter" element={<StringConverterComponent />} />
            <Route path="Websites" element={<Websites />} />
            <Route path="Browser-Ready-CSS" element={<AutoprefixerTool />} />
            <Route path="SearchEngine" element={<SearchEngine />} />
            <Route path="MetaTagsGenrator" element={<MetaTagsGenrator />} />
            <Route path="LiveHtml" element={<LiveHtml />} />
            <Route path="Test" element={<Test />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </>
  );
}

