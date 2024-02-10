import { Outlet, NavLink } from "react-router-dom";

export default function Layout() {
    const classs = 'nav-a';
    return (
        <>
            <nav>
                <ul className="sidnav">
                    <li><NavLink className={classs} to="/UnitConverter">UnitConverter</NavLink></li>
                    <li><NavLink className={classs} to="/GrapesJSEditor">GrapesJSEditor</NavLink></li>
                    <li><NavLink className={classs} to="/CharacterAndWordCounter">WordCounter</NavLink></li>
                    <li><NavLink className={classs} to="/ColorConverter">ColorConverter</NavLink></li>
                    <li><NavLink className={classs} to="/HashGenerator">HashGenerator</NavLink></li>
                    <li><NavLink className={classs} to="/ QrCodeGenerator"> QRCodeGenerator</NavLink></li>
                    <li><NavLink className={classs} to="/StringConverter">StringConverter</NavLink></li>
                    {/* <li><NavLink to="/">Home</NavLink></li> */}
                    {/* removed because don't need home page  */}
                    {/* <li><NavLink to="SvgToReactNative">SvgToReactNative</NavLink></li> */}
                    <li><NavLink className={classs} to="Websites">Websites</NavLink></li>
                    <li><NavLink className={classs} to="Apis">Apis</NavLink></li>
                    <li><NavLink className={classs} to="SimmilarWebsites">SimmilarWebsites</NavLink></li>
                    <li><NavLink className={classs} to="Browser-Ready-CSS">Browser-Ready-CSS</NavLink></li>
                    {/* <li><NavLink to="SearchWord">SearchWord</NavLink></li> */} 
                    {/* <li><NavLink to="SVGeditor"/>SVGeditor</li> */}
                    <li><NavLink className={classs} to="SearchEngine">SearchEngines</NavLink></li>
                    <li><NavLink className={classs} to="Test" >Test</NavLink></li>
                </ul>
            </nav>
            <div className="main">
                <Outlet />
            </div>
        </>
    )
}