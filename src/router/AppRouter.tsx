import { Navigate, Route, Routes } from "react-router-dom";

import AdminRoute from "../components/AdminRoute";
import MainLayout from "../components/MainLayout";
import ProtectedRoute from "../components/ProtectedRoute";

import AdminConvocatoriasPage from "../pages/AdminConvocatoriasPage";
import AdminEstadisticasPage from "../pages/AdminEstadisticasPage";
import AdminJugadoresPage from "../pages/AdminJugadoresPage";
import AdminPage from "../pages/AdminPage";
import AdminPenalizacionesPage from "../pages/AdminPenalizacionesPage";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import StatsPage from "../pages/StatsPage";
import ConfirmadoPage from "../pages/ConfirmadoPage";

function AppRouter()
{
    return (
        <Routes>
            <Route
                element={
                    <ProtectedRoute>
                        <MainLayout />
                    </ProtectedRoute>
                }
            >
                <Route
                    index
                    element={<HomePage />}
                />
                
                <Route
                    path="stats"
                    element={<StatsPage />}
                 />

                <Route
                    path="/admin"
                    element={
                        <AdminRoute>
                            <AdminPage />
                        </AdminRoute>
                    }
                />

                <Route
                    path="/admin/convocatorias"
                    element={
                        <AdminRoute>
                            <AdminConvocatoriasPage />
                        </AdminRoute>
                    }
                />

                <Route
                    path="/admin/jugadores"
                    element={
                        <AdminRoute>
                            <AdminJugadoresPage />
                        </AdminRoute>
                    }
                />

                <Route
                    path="/admin/estadisticas"
                    element={
                        <AdminRoute>
                            <AdminEstadisticasPage />
                        </AdminRoute>
                    }
                />

                <Route
                    path="/admin/penalizaciones"
                    element={
                        <AdminRoute>
                            <AdminPenalizacionesPage />
                        </AdminRoute>
                    }
                />
            </Route>

            <Route
                path="/login"
                element={<LoginPage />}
            />

            <Route
            
                path="/register"
                element={<RegisterPage />}
            />

            <Route
               path="/confirmado"
               element={<ConfirmadoPage />}
            />

            <Route
                path="*"
                element={
                    <Navigate
                        to="/"
                        replace
                    />
                }
            />
        </Routes>
    );
}

export default AppRouter;