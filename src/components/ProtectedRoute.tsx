import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface ProtectedRouteProps
{
    children: React.ReactNode;
}

function ProtectedRoute(
    {
        children,
    }: ProtectedRouteProps,
)
{
    const { session, loading } = useAuth();

    if (loading)
    {
        return (
            <main className="auth-page">
                <p>Cargando...</p>
            </main>
        );
    }

    if (!session)
    {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    return children;
}

export default ProtectedRoute;