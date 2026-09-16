import {
    Navigate,
    Route,
    Routes,
} from "react-router-dom";

import AdminRoute from "../components/AdminRoute";

import MainLayout from "../components/MainLayout";

import ProtectedRoute from "../components/ProtectedRoute";

import AdminConvocatoriasPage from "../pages/AdminConvocatoriasPage";

import AdminEstadisticasPage from "../pages/AdminEstadisticasPage";

import AdminJugadoresPage from "../pages/AdminJugadoresPage";

import AdminPage from "../pages/AdminPage";

import AdminPenalizacionesPage from "../pages/AdminPenalizacionesPage";

import BienvenidaPage from "../pages/BienvenidaPage";

import HomePage from "../pages/HomePage";

import LoginPage from "../pages/LoginPage";

import NoticiasPage from "../pages/NoticiasPage";

import RegisterPage from "../pages/RegisterPage";

import RegistroCompletadoPage from "../pages/RegistroCompletadoPage";

import StatsPage from "../pages/StatsPage";

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
                    path="noticias"
                    element={<NoticiasPage />}
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
                path="/registro-completado"
                element={<RegistroCompletadoPage />}
            />

            <Route
                path="/bienvenida"
                element={<BienvenidaPage />}
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