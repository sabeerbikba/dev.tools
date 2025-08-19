import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Analytics } from "@vercel/analytics/react";

import Layout from "@/Layout";
import ErrorBoundary from "@/components/ErrorBoundary";
import SuspenseWithFallback from "@/components/SuspenseWithFallback";
import { routes } from "@/routes";

const App = () => (
  <>
    <BrowserRouter>
      <ErrorBoundary>
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
      </ErrorBoundary>
    </BrowserRouter>
    <ToastContainer position="bottom-right" theme="dark" autoClose={2400} />
    {/* // vercel */}
    {process.env.NODE_ENV === "production" && <Analytics />}
  </>
);

export default App;
