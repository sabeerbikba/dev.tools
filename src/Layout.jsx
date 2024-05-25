import { Outlet, NavLink } from "react-router-dom";

const links = [
   { to: "/SearchEngine", text: "SearchEngines" },
   { to: "/LiveHtml", text: "LiveHtml" },
   { to: "/LiveReact", text: "LiveReact" },
   { to: "/MetaTagsGenrator", text: "MetaTagsGenrator" },
   { to: "/TypescriptPlayground", text: "TypescriptPlayground" },
   { to: "/GrapesJSEditor", text: "GrapesJSEditor" },
   { to: "/LoremIpsumGenrator", text: "LoremIpsumGenrator" },
   { to: "/UnitConverter", text: "UnitConverter" },
   { to: "/MarkdownEditor", text: "MarkdownEditor" },
   { to: "/CharacterAndWordCounter", text: "WordCounter" },
   { to: "/ColorConverter", text: "ColorConverter" },
   { to: "/Browser-Ready-CSS", text: "Browser-Ready-CSS" },
   { to: "/StringConverter", text: "StringConverter" },
   { to: "/QrCodeGenerator", text: "QRCodeGenerator" },
   { to: "/HashGenerator", text: "HashGenerator" },
   { to: "/Websites", text: "Websites" },
   // { to: "/Test", text: "Test" },
];


export default function Layout() {
   return (
      <>
         <nav>
            <ul className="sidenav">
               {links.map((link, index) => (
                  <li key={index}><NavLink className="nav-a" to={link.to}>{link.text}</NavLink></li>
               ))}
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
      <ul>
         <li style={styles.li}>
            <a style={styles.a} href="https://github.com/sabeerbikba/dev.tools" target="__blank">
               <svg style={styles.svg} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"></path>
               </svg>{' '}
               Star Us On Github
            </a>
         </li>
      </ul>
   );
}