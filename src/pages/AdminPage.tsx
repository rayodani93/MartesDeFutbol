import { useNavigate } from "react-router-dom";

import "./AdminPage.css";

import AdminCard from "../components/AdminCard";

function AdminPage()
{
    const navigate = useNavigate();

    return (
        <main className="admin-page">
            <div className="admin-container">
                <header className="admin-header">
                    <h1>
                        ⚙️ Panel de Administración
                    </h1>

                    <p>
                        Gestiona convocatorias, jugadores,
                        estadísticas y penalizaciones.
                    </p>
                </header>

                <section className="admin-grid">
                    <AdminCard
                        icono="📅"
                        titulo="Convocatorias"
                        descripcion="Crear, abrir y cerrar entrenamientos."
                        onClick={() =>
                            navigate("/admin/convocatorias")
                        }
                    />

                    <AdminCard
                        icono="👥"
                        titulo="Jugadores"
                        descripcion="Gestionar jugadores y administradores."
                        onClick={() =>
                            navigate("/admin/jugadores")
                        }
                    />

                    <AdminCard
                        icono="📊"
                        titulo="Estadísticas"
                        descripcion="Consultar asistencia y resultados."
                        onClick={() =>
                            navigate("/admin/estadisticas")
                        }
                    />

                    <AdminCard
                        icono="⚠️"
                        titulo="Penalizaciones"
                        descripcion="Gestionar retiradas y sanciones."
                        onClick={() =>
                            navigate("/admin/penalizaciones")
                        }
                    />
                </section>
            </div>
        </main>
    );
}

export default AdminPage;