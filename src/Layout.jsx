import { Outlet, NavLink } from "react-router-dom";

export default function Layout() {
    return (
        <>
            <nav>
                <ul className="sidnav">
                    <li><NavLink className='nav-a' to="/UnitConverter">UnitConverter</NavLink></li>
                    <li><NavLink className='nav-a' to="/GrapesJSEditor">GrapesJSEditor</NavLink></li>
                    <li><NavLink className='nav-a' to="/CharacterAndWordCounter">WordCounter</NavLink></li>
                    <li><NavLink className='nav-a' to="/ColorConverter">ColorConverter</NavLink></li>
                    <li><NavLink className='nav-a' to="/HashGenerator">HashGenerator</NavLink></li>
                    <li><NavLink className='nav-a' to="/ QrCodeGenerator"> QRCodeGenerator</NavLink></li>
                    <li><NavLink className='nav-a' to="/StringConverter">StringConverter</NavLink></li>
                    {/* <li><NavLink to="/">Home</NavLink></li> */}
                    {/* removed because don't need home page  */}
                    {/* <li><NavLink to="SvgToReactNative">SvgToReactNative</NavLink></li> */}
                    <li><NavLink className='nav-a' to="Websites">Websites</NavLink></li>
                    <li><NavLink className='nav-a' to="Apis">Apis</NavLink></li>
                    <li><NavLink className='nav-a' to="SimmilarWebsites">SimmilarWebsites</NavLink></li>
                    <li><NavLink className='nav-a' to="Browser-Ready-CSS">Browser-Ready-CSS</NavLink></li>
                    {/* <li><NavLink to="SearchWord">SearchWord</NavLink></li> */} 
                    {/* <li><NavLink to="SVGeditor"/>SVGeditor</li> */}
                    <li><NavLink className='nav-a' to="SearchEngine">SearchEngines</NavLink></li>
                </ul>
            </nav>
            <div className="main">
                <Outlet />
            </div>
        </>
    )
}