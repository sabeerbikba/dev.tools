import { Outlet, useLocation } from "react-router-dom";

import cn from "@/utils/cn";
import NavBar from "@/components/Nav";
import Footer from "@/components/Footer";

const Layout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <>
      {!isHomePage && <NavBar />}
      <main
        className={cn(
          !isHomePage
            ? "!ml-[210px] text-sm !text-white h-screen"
            : "!p-0 overflow-hidden"
        )}
      >
        <Outlet />
      </main>
      {isHomePage && (
        <>
          <Footer />
        </>
      )}
    </>
  );
};

export default Layout;
