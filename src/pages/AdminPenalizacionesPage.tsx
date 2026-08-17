import
{
    useEffect,
    useState,
} from "react";

import "./AdminPage.css";
import "./AdminPenalizacionesPage.css";

import
{
    obtenerPenalizaciones,
    quitarSancion,
    sancionarUnaSemana,
} from "../services/penalizacionesService";

import type
{
    PenalizacionJugador,
} from "../services/penalizacionesService";

function AdminPenalizacionesPage()
{
    const [jugadores, setJugadores] =
        useState<PenalizacionJugador[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [procesandoId, setProcesandoId] =
        useState<string | null>(null);

    const [error, setError] =
        useState("");

    const [mensaje, setMensaje] =
        useState("");

    async function cargarJugadores()
    {
        try
        {
            setError("");

            const datos =
                await obtenerPenalizaciones();

            setJugadores(datos);
        }
        catch (error)
        {
            console.error(
                "Error al cargar penalizaciones:",
                error,
            );

            setError(
                "No se han podido cargar las penalizaciones.",
            );
        }
        finally
        {
            setLoading(false);
        }
    }

    useEffect(() =>
    {
        cargarJugadores();
    }, []);

    const handleSancionar = async (
        jugador: PenalizacionJugador,
    ) =>
    {
        const confirmar =
            window.confirm(
                `¿Sancionar a ${jugador.nickname} durante una semana?`,
            );

        if (!confirmar)
        {
            return;
        }

        try
        {
            setProcesandoId(
                jugador.id,
            );

            setError("");
            setMensaje("");

            await sancionarUnaSemana(
                jugador.id,
            );

            setMensaje(
                `${jugador.nickname} ha sido sancionado durante una semana.`,
            );

            await cargarJugadores();
        }
        catch (error)
        {
            console.error(
                "Error al sancionar jugador:",
                error,
            );

            if (error instanceof Error)
            {
                setError(
                    error.message,
                );
            }
            else
            {
                setError(
                    "No se ha podido aplicar la sanción.",
                );
            }
        }
        finally
        {
            setProcesandoId(null);
        }
    };

    const handleQuitarSancion = async (
        jugador: PenalizacionJugador,
    ) =>
    {
        const confirmar =
            window.confirm(
                `¿Quitar la sanción a ${jugador.nickname}?`,
            );

        if (!confirmar)
        {
            return;
        }

        try
        {
            setProcesandoId(
                jugador.id,
            );

            setError("");
            setMensaje("");

            await quitarSancion(
                jugador.id,
            );

            setMensaje(
                `Se ha eliminado la sanción de ${jugador.nickname}.`,
            );

            await cargarJugadores();
        }
        catch (error)
        {
            console.error(
                "Error al quitar sanción:",
                error,
            );

            if (error instanceof Error)
            {
                setError(
                    error.message,
                );
            }
            else
            {
                setError(
                    "No se ha podido quitar la sanción.",
                );
            }
        }
        finally
        {
            setProcesandoId(null);
        }
    };

    function estaSancionado(
        jugador: PenalizacionJugador,
    )
    {
        if (!jugador.penalizado_hasta)
        {
            return false;
        }

        return (
            new Date(
                jugador.penalizado_hasta,
            ).getTime() >
            Date.now()
        );
    }

    function formatearFecha(
        fecha: string | null,
    )
    {
        if (!fecha)
        {
            return "Sin sanción";
        }

        return new Intl.DateTimeFormat(
            "es-ES",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            },
        ).format(
            new Date(fecha),
        );
    }

    if (loading)
    {
        return (
            <main className="admin-page">
                <div className="admin-container">
                    <p>
                        Cargando penalizaciones...
                    </p>
                </div>
            </main>
        );
    }

    return (
        <main className="admin-page">

            <div className="admin-container">

                <h1>
                    ⚠️ Penalizaciones
                </h1>

                <p>
                    Gestiona retiradas y sanciones de los
                    jugadores.
                </p>

                {error && (
                    <p
                        className="form-error"
                        role="alert"
                    >
                        {error}
                    </p>
                )}

                {mensaje && (
                    <p
                        className="admin-success"
                        role="status"
                    >
                        {mensaje}
                    </p>
                )}

                <div className="penalizaciones-lista">

                    {jugadores.map(
                        (jugador) =>
                        {
                            const sancionado =
                                estaSancionado(
                                    jugador,
                                );

                            return (
                                <article
                                    key={jugador.id}
                                    className={
                                        sancionado
                                            ? "penalizacion-card penalizacion-card-activa"
                                            : "penalizacion-card"
                                    }
                                >

                                    <div className="penalizacion-info">

                                        <div>
                                            <h2>
                                                {jugador.nickname}
                                            </h2>

                                            <p>
                                                {jugador.nombre}{" "}
                                                {jugador.apellidos}
                                            </p>
                                        </div>

                                        <div className="penalizacion-datos">

                                            <span>
                                                Retiradas penalizables
                                            </span>

                                            <strong>
                                                {
                                                    jugador
                                                        .retiradas_penalizables
                                                }
                                            </strong>

                                        </div>

                                        <div className="penalizacion-datos">

                                            <span>
                                                Estado
                                            </span>

                                            <strong>
                                                {
                                                    sancionado
                                                        ? "🔴 Sancionado"
                                                        : "🟢 Disponible"
                                                }
                                            </strong>

                                        </div>

                                        <div className="penalizacion-datos">

                                            <span>
                                                Penalizado hasta
                                            </span>

                                            <strong>
                                                {
                                                    sancionado
                                                        ? formatearFecha(
                                                            jugador
                                                                .penalizado_hasta,
                                                        )
                                                        : "—"
                                                }
                                            </strong>

                                        </div>

                                    </div>

                                    <div className="penalizacion-acciones">

                                        <button
                                            type="button"
                                            disabled={
                                                procesandoId ===
                                                jugador.id
                                            }
                                            onClick={() =>
                                                handleSancionar(
                                                    jugador,
                                                )
                                            }
                                        >
                                            🚫 Sancionar 1 semana
                                        </button>

                                        {sancionado && (
                                            <button
                                                type="button"
                                                disabled={
                                                    procesandoId ===
                                                    jugador.id
                                                }
                                                onClick={() =>
                                                    handleQuitarSancion(
                                                        jugador,
                                                    )
                                                }
                                            >
                                                ✅ Quitar sanción
                                            </button>
                                        )}

                                    </div>

                                </article>
                            );
                        },
                    )}

                </div>

            </div>

        </main>
    );
}

export default AdminPenalizacionesPage;