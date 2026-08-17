import { Outlet } from "react-router-dom";

import "./MainLayout.css";

import HomeHeader from "./HomeHeader";

function MainLayout()
{
    return (
        <>
            <HomeHeader />

            <main className="main-layout">
                <Outlet />
            </main>
        </>
    );
}

export default MainLayout;