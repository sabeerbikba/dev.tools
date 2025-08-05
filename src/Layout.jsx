import { Outlet, useLocation } from "react-router-dom";

import cn from "@/utils/cn";
import NavBar from "@/components/Nav";
import Footer from "@/components/Footer";
import MobileInfoModal from "@/components/MobileInfoModel";

const Layout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <>
      <MobileInfoModal />
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
