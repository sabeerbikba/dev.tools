import { useState, useEffect } from "react";

const useMediaQuery = (query) => {
   const [matches, setMatches] = useState(() =>
      typeof window !== "undefined" ? window.matchMedia(`(${query})`).matches : false
   );

   useEffect(() => {
      const media = window.matchMedia(`(${query})`);

      const listener = () => setMatches(media.matches);
      listener(); // set initial state

      media.addEventListener("change", listener);
      return () => media.removeEventListener("change", listener);
   }, [query]);

   return matches;
};

export default useMediaQuery;
