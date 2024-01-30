// import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Home from "./pages/Home";
import NoPage from "./pages/NoPage";
import Practice1 from "./pages/Practice1";
import Practice2 from "./pages/Practice2";
import Practice3 from './pages/Practice3';
import Practice4 from './pages/Practice4';
import Practice5 from './pages/Practice5';
import Practice6 from './pages/Practice6';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="*" element={<NoPage />} />
          <Route index element={<Home />} />
          <Route path="Practice1" element={<Practice1 />} />
          <Route path="Practice2" element={<Practice2 />} />
          <Route path="Practice3" element={<Practice3 />} />
          <Route path="Practice4" element={<Practice4 />} />
          <Route path="Practice5" element={<Practice5 />} />
          <Route path="Practice6" element={<Practice6 />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

