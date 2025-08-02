import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Analytics } from "@vercel/analytics/react";

import Layout from "@/Layout";
import SuspenseWithFallback from "@/components/SuspenseWithFallback";
import { routes } from "@/routes";

const App = () => (
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
    {process.env.NODE_ENV === "production" && <Analytics />}
  </>
);

export default App;
