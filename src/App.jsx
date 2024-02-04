// import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
// import Home from "./pages/Home.jsx";
import NoPage from "./pages/NoPage";
import GrapesJSEditor from "./pages/GrapesJSEditor.jsx";
import CharacterAndWordCounterComponent from "./pages/CharacterAndWordCounterComponent.jsx";
import ColorConverterComponent from './pages/ColorConverterComponent.jsx';
import HashGeneratorComponent from './pages/HashGeneratorComponent.jsx';
import  QrCodeGeneratorComponent from './pages/QRCodeGenratorComponent.jsx';
import StringConverterComponent from './pages/StringConverterComponent.jsx';
import UnitConverter from "./pages/UnitConverter.jsx";
// import SvgToReactNative from "./pages/testing/svg-to-react-native.jsx";
import Websites from "./pages/Websites.jsx";
import Apis from "./pages/Apis.jsx";
import SimmilarWebsites from "./pages/SimmilarWebsites.jsx";
import AutoprefixerTool from "./pages/Autoprefixer.jsx";
// import SearchWord from "./pages/SearchWord.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="*" element={<NoPage />} />
          <Route index element={<UnitConverter />} />
          <Route path="UnitConverter" element={<UnitConverter />} />
          <Route path="GrapesJSEditor" element={<GrapesJSEditor />} />
          <Route path="CharacterAndWordCounter" element={<CharacterAndWordCounterComponent />} />
          <Route path="ColorConverter" element={<ColorConverterComponent />} />
          <Route path="HashGenerator" element={<HashGeneratorComponent />} />
          <Route path=" QrCodeGenerator" element={< QrCodeGeneratorComponent />} />
          <Route path="StringConverter" element={<StringConverterComponent />} />
          {/* <Route path="SvgToReactNative" element={<SvgToReactNative />} /> */}
          <Route path="Apis" element={<Apis/>} />
          <Route path="Websites" element={<Websites/>} />
          <Route path="SimmilarWebsites" element={<SimmilarWebsites/>} />
          <Route path="Browser-Ready-CSS" element={<AutoprefixerTool/>} />
          {/* <Route path="SearchWord" element={<SearchWord/>} /> */} {/* not possible beacaus it's backen product  */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

