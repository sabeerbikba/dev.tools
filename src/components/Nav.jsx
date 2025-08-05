import { useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Star, AlignJustify, AlignLeft } from "lucide-react";

import cn from "@/utils/cn";
import { routes, formatToolName } from "@/routes";
import ExternalLink from "@/common/ExternalLink";
import useOnlineStatus from "@/hooks/useOnlineStatus";
import { mobileResponsivePaths } from "@/routes";
import useMediaQuery from "@/hooks/useMediaQuery";
import useLocalStorageState from "@/hooks/useLocalStorageState";

const NavBar = () => {
  const navRef = useRef(null);
  const isMobile = useMediaQuery("max-width: 640px");
  const location = useLocation();
  const isCurrentRouteMoibleResponsive = mobileResponsivePaths.includes(
    location.pathname
  );
  const [isNavOpen, setNavOpen] = useLocalStorageState("nav:isOpen", true);

  useEffect(() => {
    if (isMobile && isCurrentRouteMoibleResponsive) {
      setNavOpen(false);
    } else {
      setNavOpen(true);
    }
  }, [isMobile]);

  useEffect(() => {
    const handlePointerDown = (e) => {
      if (
        navRef.current &&
        !navRef.current.contains(e.target) &&
        isCurrentRouteMoibleResponsive &&
        isMobile
      ) {
        setNavOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [location.pathname, isMobile]);

  return (
    <>
      <nav ref={navRef} className={isNavOpen ? "block" : "hidden"}>
        <ul className="sidenav pb-[72px]">
          {routes.slice(1, -1).map(({ path }) => (
            <li key={path}>
              <NavLink className="nav-a" to={"/" + path}>
                {formatToolName(path).pascalCase}
              </NavLink>
            </li>
          ))}
          <Status />
          <GithubStar />
        </ul>
      </nav>
      {isCurrentRouteMoibleResponsive && isMobile && (
        <div
          onClick={() => setNavOpen(!isNavOpen)}
          className={cn(
            "cursor-pointer fixed bottom-5 z-[50] text-5xl text-white border-[1px] border-white/70 rounded-sm p-0.5",
            isNavOpen ? "left-[220px]" : "left-4"
          )}
        >
          {isNavOpen ? <AlignJustify /> : <AlignLeft />}
        </div>
      )}
    </>
  );
};

const Status = () => {
  const isOnline = useOnlineStatus();

  return (
    <div className="bg-[#374151] fixed left-0 bottom-[37px] text-white m-auto text-center w-[210px] border-t py-1 border-black">
      <div className="inline-flex items-center gap-2 text-sm font-medium z-50">
        <span
          className={`h-3 w-3 rounded-full inline-block ${
            isOnline ? "bg-green-500" : "bg-red-500 animate-pulse"
          }`}
        ></span>
        <span className="text-gray-800 dark:text-gray-100">
          {isOnline ? "Connected" : "Disconnected"}
        </span>
      </div>
    </div>
  );
};

const GithubStar = () => (
  <ul>
    <li className="border-none text-[#d9d9d9]">
      <ExternalLink
        className="fixed bottom-0 left-0 bg-[#2a3951] text-[1.1rem] border-t border-black block w-[210px] decoration-none py-1.5 px-5 rounded-[10px_10px_0_0]"
        href="https://github.com/sabeerbikba/dev.tools"
      >
        <Star className="!w-5 !h-5 inline !stroke-[1.5px] pb-px" /> Star On
        Github
      </ExternalLink>
    </li>
  </ul>
);

export default NavBar;
