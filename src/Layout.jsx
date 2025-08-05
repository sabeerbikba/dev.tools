import { Outlet, useLocation } from "react-router-dom";

import cn from "@/utils/cn";
import { mobileResponsivePaths } from "@/routes";
import NavBar from "@/components/Nav";
import Footer from "@/components/Footer";
import MobileInfoModal from "@/components/MobileInfoModel";
// import useMediaQuery from "@/hooks/useMediaQuery";

const Layout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  //   const isMobile = useMediaQuery("max-width: 640px");

  return (
    <>
      <MobileInfoModal />
      {!isHomePage && <NavBar />}
      <main
        className={cn(
          !isHomePage &&
            mobileResponsivePaths.includes(location.pathname) &&
            "sm:ml-[210px]",
          !mobileResponsivePaths.includes(location.pathname) && "ml-[210px]",
          !isHomePage ? "text-sm !text-white h-screen" : "!p-0 overflow-hidden"
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
