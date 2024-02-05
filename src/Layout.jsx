import { Outlet, NavLink } from "react-router-dom";

export default function Layout() {
    return (
        <>
            <nav>
                <ul className="sidnav">
                    <li><NavLink to="/UnitConverter">UnitConverter</NavLink></li>
                    <li><NavLink to="/GrapesJSEditor">GrapesJSEditor</NavLink></li>
                    <li><NavLink to="/CharacterAndWordCounter">WordCounter</NavLink></li>
                    <li><NavLink to="/ColorConverter">ColorConverter</NavLink></li>
                    <li><NavLink to="/HashGenerator">HashGenerator</NavLink></li>
                    <li><NavLink to="/ QrCodeGenerator"> QRCodeGenerator</NavLink></li>
                    <li><NavLink to="/StringConverter">StringConverter</NavLink></li>
                    {/* <li><NavLink to="/">Home</NavLink></li> */}
                    {/* removed because don't need home page  */}
                    {/* <li><NavLink to="SvgToReactNative">SvgToReactNative</NavLink></li> */}
                    <li><NavLink to="Websites">Websites</NavLink></li>
                    <li><NavLink to="Apis">Apis</NavLink></li>
                    <li><NavLink to="SimmilarWebsites">SimmilarWebsites</NavLink></li>
                    <li><NavLink to="Browser-Ready-CSS">Browser-Ready-CSS</NavLink></li>
                    {/* <li><NavLink to="SearchWord">SearchWord</NavLink></li> */} 
                    {/* <li><NavLink to="SVGeditor"/>SVGeditor</li> */}
                    <li><NavLink to="SearchEngine">SearchEngine</NavLink></li>
                </ul>
            </nav>
            <div className="main">
                <Outlet />
            </div>
        </>
    )
}