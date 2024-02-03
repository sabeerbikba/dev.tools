import { Outlet, Link } from "react-router-dom";

export default function Layout() {
    return (
        <>
            <nav>
                <ul className="sidnav">
                    <li>
                        <Link to="/UnitConverter">UnitConverter</Link>
                    </li>
                    <li>
                        <Link to="/GrapesJSEditor">GrapesJSEditor</Link>
                    </li>
                    <li>
                        <Link to="/CharacterAndWordCounter">WordCounter</Link>
                    </li>
                    <li>
                        <Link to="/ColorConverter">ColorConverter</Link>
                    </li>
                    <li>
                        <Link to="/HashGenerator">HashGenerator</Link>
                    </li>
                    <li>
                        <Link to="/ QrCodeGenerator"> QRCodeGenerator</Link>
                    </li>
                    <li>
                        <Link to="/StringConverter">StringConverter</Link>
                    </li>
                    {/* <li>
                        <Link to="/">Home</Link>
                    </li> */}
                    {/* removed because don't need home page  */}
                    {/* <li>
                        <Link to="SvgToReactNative">SvgToReactNative</Link>
                    </li> */}
                    <li>
                        <Link to="Websites">Websites</Link>
                    </li>
                    <li>
                        <Link to="Apis">Apis</Link>
                    </li>
                    <li>
                        <Link to="SimmilarWebsites">SimmilarWebsites</Link>
                    </li>
                    <li>
                        <Link to="Browser-Ready-CSS">Browser-Ready-CSS</Link>
                    </li>
                </ul>
            </nav>
            <div className="main">
                <Outlet />
            </div>
        </>
    )
}