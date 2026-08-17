import
{
    ChartColumn,
    House,
    LogOut,
    ShieldCheck,
} from "lucide-react";

import
{
    NavLink,
    useNavigate,
} from "react-router-dom";

import "./HomeHeader.css";

import { useAuth } from "../contexts/AuthContext";

function HomeHeader()
{
    const
    {
        perfil,
        cerrarSesion,
    } = useAuth();

    const navigate = useNavigate();

    const handleCerrarSesion = async () =>
    {
        try
        {
            await cerrarSesion();

            navigate(
                "/login",
                {
                    replace: true,
                },
            );
        }
        catch (error)
        {
            console.error(
                "Error al cerrar sesión:",
                error,
            );
        }
    };

    return (
        <header className="home-header">

            <div className="home-header-identidad">

                <h1>
                    ⚽ Martes de Fútbol
                </h1>

                <p>
                    Hola, {perfil?.nickname ?? "Jugador"} 👋
                </p>

            </div>

            <nav
                className="header-navigation"
                aria-label="Navegación principal"
            >

                <NavLink
                    to="/"
                    end
                    className={
                        ({ isActive }) =>
                            isActive
                                ? "nav-item nav-item-activo"
                                : "nav-item"
                    }
                    aria-label="Inicio"
                    title="Inicio"
                >
                    <House aria-hidden="true" />

                    <span>
                        Inicio
                    </span>
                </NavLink>

                <NavLink
                    to="/stats"
                    className={
                        ({ isActive }) =>
                            isActive
                                ? "nav-item nav-item-activo"
                                : "nav-item"
                    }
                    aria-label="Estadísticas"
                    title="Estadísticas"
                >
                    <ChartColumn aria-hidden="true" />

                    <span>
                        Stats
                    </span>
                </NavLink>

                {
                    perfil?.rol === "admin" &&
                    (
                        <NavLink
                            to="/admin"
                            className={
                                ({ isActive }) =>
                                    isActive
                                        ? "nav-item nav-item-activo"
                                        : "nav-item"
                            }
                            aria-label="Administración"
                            title="Administración"
                        >
                            <ShieldCheck aria-hidden="true" />

                            <span>
                                Admin
                            </span>
                        </NavLink>
                    )
                }

                <button
                    type="button"
                    className="nav-item nav-item-salir"
                    onClick={handleCerrarSesion}
                    aria-label="Cerrar sesión"
                    title="Cerrar sesión"
                >
                    <LogOut aria-hidden="true" />

                    <span>
                        Salir
                    </span>
                </button>

            </nav>

        </header>
    );
}

export default HomeHeader;