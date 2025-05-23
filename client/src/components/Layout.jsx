import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

function Layout() {
    return (
        <div className="d-flex">
            <Sidebar />
            <div className="flex-grow-1 p-3">
                <Outlet />
            </div>
        </div>
    );
}

export default Layout;
