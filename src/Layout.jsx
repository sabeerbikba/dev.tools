import { Outlet, NavLink, useLocation } from "react-router-dom";

import cn from "@/utils/cn";
import { routes, formatToolName } from "@/routes";
import Footer from "@/components/Footer";
import ExternalLink from "@/common/ExternalLink";

const Layout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <>
      {!isHomePage && (
        <nav>
          <ul className="sidenav">
            {routes.slice(1, -1).map(({ path }) => (
              <li key={path}>
                <NavLink className="nav-a" to={"/" + path}>
                  {formatToolName(path).pascalCase}
                </NavLink>
              </li>
            ))}
            <GithubStar />
          </ul>
        </nav>
      )}
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
          {/* <SimpleFooter /> */}
        </>
      )}
    </>
  );
};

const GithubStar = () => {
  const styles = {
    a: {
      position: "fixed",
      bottom: "0",
      left: "0",
      backgroundColor: "#2a3951",
      fontSize: "1.1rem",
      padding: "6px 8px 6px 16px",
      textDecoration: "none",
      borderTop: "2px solid black",
      borderRadius: "10px 10px 0 0",
      display: "block",
      width: "210px",
    },
    li: { border: "none", color: "#d9d9d9" },
    svg: { display: "inline", marginBottom: "4px" },
  };

  return (
    <ul>
      <li style={styles.li}>
        <ExternalLink
          style={styles.a}
          href="https://github.com/sabeerbikba/dev.tools"
        >
          <svg
            style={styles.svg}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            aria-hidden="true"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
            ></path>
          </svg>{" "}
          Star Us On Github
        </ExternalLink>
      </li>
    </ul>
  );
};

export default Layout;
