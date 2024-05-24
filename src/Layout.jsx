import { Outlet, NavLink } from "react-router-dom";

export default function Layout() {
   const classs = 'nav-a';
   return (
      <>
         <nav>
            <ul className="sidenav">
               <li><NavLink className={classs} to="/SearchEngine">SearchEngines</NavLink></li>
               <li><NavLink className={classs} to="/LiveHtml">LiveHtml</NavLink></li>
               <li><NavLink className={classs} to="/LiveReact">LiveReact</NavLink></li>
               <li><NavLink className={classs} to="/MetaTagsGenrator">MetaTagsGenrator</NavLink></li>
               <li><NavLink className={classs} to="/TypescriptPlayground">TypescriptPlayground</NavLink></li>
               <li><NavLink className={classs} to="/GrapesJSEditor">GrapesJSEditor</NavLink></li>
               <li><NavLink className={classs} to="/LoremIpsumGenrator">LoremIpsumGenrator</NavLink></li>
               <li><NavLink className={classs} to="/UnitConverter">UnitConverter</NavLink></li>
               <li><NavLink className={classs} to="/CharacterAndWordCounter">WordCounter</NavLink></li>
               <li><NavLink className={classs} to="/ColorConverter">ColorConverter</NavLink></li>
               <li><NavLink className={classs} to="/Browser-Ready-CSS">Browser-Ready-CSS</NavLink></li>
               <li><NavLink className={classs} to="/StringConverter">StringConverter</NavLink></li>
               <li><NavLink className={classs} to="/QrCodeGenerator"> QRCodeGenerator</NavLink></li>
               <li><NavLink className={classs} to="/HashGenerator">HashGenerator</NavLink></li>
               <li><NavLink className={classs} to="/Websites">Websites</NavLink></li>
               {/* <li><NavLink className={classs} to="/Test">Test</NavLink></li> */}
               <GithubStar />
            </ul>
         </nav >
         <main className="main">
            <Outlet />
         </main>
      </>
   )
}

function GithubStar() {
   const styles = {
      a: {
         position: 'fixed', bottom: '0', left: '0', backgroundColor: '#2a3951', fontSize: '1.1rem',
         padding: "6px 8px 6px 16px", textDecoration: 'none', borderTop: '2px solid black',
         borderRadius: '10px 10px 0 0', display: 'block', width: '210px'
      },
      li: { border: 'none', color: '#d9d9d9' },
      svg: { display: 'inline', marginBottom: '4px' },
   }

   return (
      <li>
         <a style={styles.a}
            href="https://github.com/sabeerbikba/dev.tools" target="__blank"><li style={styles.li}>
               <svg style={styles.svg} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                  stroke="currentColor" aria-hidden="true" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round"
                     d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z">
                  </path>
               </svg>{' '}
               Star Us On Github
            </li>
         </a>
      </li>
   );
}