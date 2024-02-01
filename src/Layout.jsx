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
                </ul>
            </nav>
            <div className="main">
                <Outlet />
            </div>
        </>
    )
}