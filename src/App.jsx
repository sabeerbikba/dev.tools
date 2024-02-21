// import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { isMobile } from 'react-device-detect';
import Layout from "./Layout";
// import Home from "./pages/Home.jsx";
import NoPage from "./pages/NoPage";
import GrapesJSEditor from "./pages/GrapesJSEditor.jsx";
import CharacterAndWordCounterComponent from "./pages/CharacterAndWordCounterComponent.jsx";
import ColorConverterComponent from './pages/ColorConverterComponent.jsx';
import HashGeneratorComponent from './pages/HashGeneratorComponent.jsx';
import QrCodeGeneratorComponent from './pages/QRCodeGenratorComponent.jsx';
import StringConverterComponent from './pages/StringConverterComponent.jsx';
import UnitConverter from "./pages/UnitConverter.jsx";
// import SvgToReactNative from "./pages/testing/svg-to-react-native.jsx";
import Websites from "./pages/Websites.jsx";
// import Apis from "./pages/Apis.jsx";
import SimmilarWebsites from "./pages/SimmilarWebsites.jsx";
import AutoprefixerTool from "./pages/AutoPrefixer.jsx";
// import SearchWord from "./pages/SearchWord.jsx";
// import SVGEditor from "./pages/SVGeditor.jsx";
import SearchEngine from "./pages/SearchEngine.jsx";
import MetaTagsGenrator from "./pages/MetaTagsGenrator.jsx";
import Test from "./pages/testing/Test.jsx";
// import BrowserExtensions from "./pages/BrowserExtensions.jsx";

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
            {/* <Route path="SvgToReactNative" element={<SvgToReactNative />} /> */}
            {/* <Route path="Apis" element={<Apis />} /> */} {/* not a good idea  */}
            <Route path="Websites" element={<Websites />} />
            <Route path="SimmilarWebsites" element={<SimmilarWebsites />} />
            <Route path="Browser-Ready-CSS" element={<AutoprefixerTool />} />
            {/* <Route path="SearchWord" element={<SearchWord/>} /> */} {/* not possible beacaus it's backen product  */}
            {/* <Route path="SVGeditor" element={<SVGEditor/>} /> */} {/* not possible not better lib avialable */}
            <Route path="SearchEngine" element={<SearchEngine />} />
            <Route path="MetaTagsGenrator" element={<MetaTagsGenrator />} />
            {/* <Route path="BrowserExtensions" element={<BrowserExtensions />} /> */} {/* not a good idea */}
            <Route path="Test" element={<Test />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </>
  );
}

