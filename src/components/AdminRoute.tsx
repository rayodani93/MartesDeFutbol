import { Navigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

interface AdminRouteProps
{
    children: React.ReactNode;
}

function AdminRoute(
    {
        children,
    }: AdminRouteProps,
)
{
    const { perfil, loading } = useAuth();

    if (loading)
    {
        return null;
    }

    if (perfil?.rol !== "admin")
    {
        return (
            <Navigate
                to="/"
                replace
            />
        );
    }

    return children;
}

export default AdminRoute;