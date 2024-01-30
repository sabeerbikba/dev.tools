import { Outlet, Link } from "react-router-dom";

export default function Layout() {
    return (
        <>
            <nav>
                <ul className="sidnav">
                    <li>
                        <Link to="/Practice1">Practice1</Link>
                    </li>
                    <li>
                        <Link to="/practice2">practice2</Link>
                    </li>
                    <li>
                        <Link to="/Practice3">Practice3</Link>
                    </li>
                    <li>
                        <Link to="/practice4">practice4</Link>
                    </li>
                    <li>
                        <Link to="/practice5">practice5</Link>
                    </li>
                    <li>
                        <Link to="/practice6">practice6</Link>
                    </li>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                </ul>
            </nav>
            <div className="main">
                <Outlet />
            </div>
        </>
    )
}