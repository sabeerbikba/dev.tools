import { NavLink } from "react-router-dom";

import { routes, formatToolName } from "@/routes";
import ExternalLink from "@/common/ExternalLink";
import useOnlineStatus from "@/hooks/useOnlineStatus";

const NavBar = () => (
  <nav>
    <ul className="sidenav">
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
);

const Status = () => {
  const isOnline = useOnlineStatus();

  return (
    <div className="fixed left-0 bottom-[47px] text-white m-auto text-center w-[210px] border-t pt-1 border-black">
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

export default NavBar;
