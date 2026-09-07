import { useEffect, useState } from "react";

import "./AdminPage.css";

import ConvocatoriaCard from "../components/ConvocatoriaCard";

import {
    cancelarConvocatoria,
    cerrarConvocatoria,
    finalizarConvocatoria,
    obtenerConvocatoriaActual,
    reabrirConvocatoria,
} from "../services/convocatoriasService";

import {
    asignarEquipoPartido,
    obtenerInscripciones,
} from "../services/inscripcionesService";

import type {
    InscripcionVisible,
} from "../services/inscripcionesService";

import type { Convocatoria } from "../types/convocatoria";

function AdminConvocatoriasPage()
{
    const [convocatoria, setConvocatoria] =
        useState<Convocatoria | null>(null);

    const [inscripciones, setInscripciones] =
        useState<InscripcionVisible[]>([]);

    const [loading, setLoading] = useState(true);
    const [procesando, setProcesando] = useState(false);
    const [error, setError] = useState("");
    const [mensaje, setMensaje] = useState("");

    async function cargarInscripciones(
        convocatoriaId: number,
    )
    {
        try
        {
            const inscripcionesActuales =
                await obtenerInscripciones(
                    convocatoriaId,
                );

            setInscripciones(
                inscripcionesActuales,
            );
        }
        catch (error)
        {
            console.error(
                "Error al cargar las inscripciones:",
                error,
            );

            setError(
                "No se han podido cargar las inscripciones.",
            );
        }
    }

    async function cargarConvocatoria()
    {
        try
        {
            setLoading(true);
            setError("");

            const convocatoriaActual =
                await obtenerConvocatoriaActual();

            setConvocatoria(convocatoriaActual);

            if (convocatoriaActual)
            {
                await cargarInscripciones(
                    convocatoriaActual.id,
                );
            }
            else
            {
                setInscripciones([]);
            }
        }
        catch (error)
        {
            console.error(
                "Error al cargar la convocatoria:",
                error,
            );

            setError(
                "No se ha podido cargar la convocatoria actual.",
            );
        }
        finally
        {
            setLoading(false);
        }
    }

    useEffect(() =>
    {
        cargarConvocatoria();
    }, []);

    const handleCerrar = async () =>
    {
        if (!convocatoria)
        {
            return;
        }

        try
        {
            setProcesando(true);
            setError("");
            setMensaje("");

            const convocatoriaActualizada =
                await cerrarConvocatoria();

            setConvocatoria(convocatoriaActualizada);

            setMensaje(
                "La inscripción se ha cerrado correctamente.",
            );
        }
        catch (error)
        {
            console.error(
                "Error al cerrar la convocatoria:",
                error,
            );

            setError(
                "No se ha podido cerrar la convocatoria.",
            );
        }
        finally
        {
            setProcesando(false);
        }
    };

    const handleReabrir = async () =>
    {
        if (!convocatoria)
        {
            return;
        }

        try
        {
            setProcesando(true);
            setError("");
            setMensaje("");

            const convocatoriaActualizada =
                await reabrirConvocatoria();

            setConvocatoria(convocatoriaActualizada);

            setMensaje(
                "La inscripción se ha reabierto correctamente.",
            );
        }
        catch (error)
        {
            console.error(
                "Error al reabrir la convocatoria:",
                error,
            );

            setError(
                "No se ha podido reabrir la convocatoria.",
            );
        }
        finally
        {
            setProcesando(false);
        }
    };

    const handleCancelar = async () =>
    {
        if (!convocatoria)
        {
            return;
        }

        const confirmarCancelacion = window.confirm(
            "¿Seguro que quieres cancelar esta convocatoria?",
        );

        if (!confirmarCancelacion)
        {
            return;
        }

        try
        {
            setProcesando(true);
            setError("");
            setMensaje("");

            const convocatoriaActualizada =
                await cancelarConvocatoria();

            setConvocatoria(convocatoriaActualizada);

            setMensaje(
                "La convocatoria se ha cancelado correctamente.",
            );
        }
        catch (error)
        {
            console.error(
                "Error al cancelar la convocatoria:",
                error,
            );

            setError(
                "No se ha podido cancelar la convocatoria.",
            );
        }
        finally
        {
            setProcesando(false);
        }
    };

    const handleFinalizar = async (
        resultado: "blanco" | "rojo" | "empate",
    ) =>
    {
        if (!convocatoria)
        {
            return;
        }

        const confirmados =
            inscripciones.filter(
                (inscripcion) =>
                    inscripcion.estado === "confirmado",
            );

        if (confirmados.length === 0)
        {
            setError(
                "No puedes finalizar el partido porque no hay jugadores confirmados.",
            );

            return;
        }

        const jugadoresSinEquipo =
            confirmados.filter(
                (inscripcion) =>
                    inscripcion.equipo_partido !== "blanco" &&
                    inscripcion.equipo_partido !== "rojo",
            );

        if (jugadoresSinEquipo.length > 0)
        {
            setError(
                `No puedes finalizar el partido. Hay ${jugadoresSinEquipo.length} jugador(es) sin equipo asignado.`,
            );

            return;
        }

        const textoConfirmacion =
            resultado === "empate"
                ? "¿Confirmas que el partido terminó en empate?"
                : resultado === "blanco"
                    ? "¿Confirmas que ganó el equipo blanco?"
                    : "¿Confirmas que ganó el equipo rojo?";

        const confirmar =
            window.confirm(
                textoConfirmacion,
            );

        if (!confirmar)
        {
            return;
        }

        try
        {
            setProcesando(true);
            setError("");
            setMensaje("");

            await finalizarConvocatoria(
                convocatoria.id,
                resultado,
            );

            setMensaje(
                "Partido finalizado y estadísticas actualizadas correctamente.",
            );

            await cargarConvocatoria();
        }
        catch (error)
        {
            console.error(
                "Error al finalizar el partido:",
                error,
            );

            setError(
                "No se ha podido finalizar el partido.",
            );
        }
        finally
        {
            setProcesando(false);
        }
    };

    const handleCambiarEquipo = async (
        inscripcionId: number,
        equipoPartido: "blanco" | "rojo",
    ) =>
    {
        if (!convocatoria)
        {
            return;
        }

        try
        {
            setProcesando(true);
            setError("");
            setMensaje("");

            await asignarEquipoPartido(
                inscripcionId,
                equipoPartido,
            );

            await cargarInscripciones(
                convocatoria.id,
            );

            setMensaje(
                "Equipo actualizado correctamente.",
            );
        }
        catch (error)
        {
            console.error(
                "Error al asignar el equipo:",
                error,
            );

            setError(
                "No se ha podido asignar el equipo.",
            );
        }
        finally
        {
            setProcesando(false);
        }
    };

    if (loading)
    {
        return (
            <main className="admin-page">
                <div className="admin-container">
                    <p>
                        Cargando convocatoria...
                    </p>
                </div>
            </main>
        );
    }
        return (
        <main className="admin-page">
            <div className="admin-container">
                <div className="admin-header">
                    <h1>
                        📅 Convocatorias
                    </h1>

                    <p>
                        La convocatoria semanal se genera
                        automáticamente al acceder a la aplicación.
                    </p>

                    <p>
                        La inscripción se abre el Domingo a
                        las 22:00 y se cierra el Martes a
                        las 19:00.
                    </p>
                </div>

                {error && (
                    <p
                        className="form-error"
                        role="alert"
                    >
                        {error}
                    </p>
                )}

                {mensaje && (
                    <p role="status">
                        {mensaje}
                    </p>
                )}

                {!convocatoria && (
                    <section>
                        <h2>
                            No hay convocatoria actual
                        </h2>

                        <p>
                            Todavía no existe una
                            convocatoria programada,
                            abierta o cerrada.
                        </p>
                    </section>
                )}

                {convocatoria && (
                    <>
                        <ConvocatoriaCard
                            convocatoria={convocatoria}
                            acciones={
                                <div className="admin-actions">
                                    {convocatoria.estado ===
                                        "abierta" && (
                                        <button
                                            type="button"
                                            className="primary-button"
                                            onClick={
                                                handleCerrar
                                            }
                                            disabled={
                                                procesando
                                            }
                                        >
                                            {procesando
                                                ? "Procesando..."
                                                : "Cerrar inscripción"}
                                        </button>
                                    )}

                                    {convocatoria.estado ===
                                        "cerrada" && (
                                        <button
                                            type="button"
                                            className="primary-button"
                                            onClick={
                                                handleReabrir
                                            }
                                            disabled={
                                                procesando
                                            }
                                        >
                                            {procesando
                                                ? "Procesando..."
                                                : "Reabrir inscripción"}
                                        </button>
                                    )}

                                    {convocatoria.estado !==
                                        "cancelada" &&
                                        convocatoria.estado !==
                                        "finalizada" && (
                                        <button
                                            type="button"
                                            className="danger-button"
                                            onClick={
                                                handleCancelar
                                            }
                                            disabled={
                                                procesando
                                            }
                                        >
                                            {procesando
                                                ? "Procesando..."
                                                : "Cancelar convocatoria"}
                                        </button>
                                    )}
                                </div>
                            }
                        />

                        <section className="admin-equipos">
                            <h2>
                                ⚽ Asignación de equipos
                            </h2>

                            {inscripciones.filter(
                                (inscripcion) =>
                                    inscripcion.estado ===
                                    "confirmado",
                            ).length === 0 && (
                                <p>
                                    Todavía no hay jugadores
                                    confirmados.
                                </p>
                            )}

                            {inscripciones
                                .filter(
                                    (inscripcion) =>
                                        inscripcion.estado ===
                                        "confirmado",
                                )
                                .map((inscripcion) => (
                                    <div
                                        key={inscripcion.id}
                                        className="admin-equipo-fila"
                                    >
                                        <div>
                                            <strong className="admin-jugador-nombre">
                                                <span
                                                    className={
                                                        inscripcion.equipo_partido === "rojo"
                                                            ? "equipo-indicador equipo-indicador-rojo"
                                                            : inscripcion.equipo_partido === "blanco"
                                                                ? "equipo-indicador equipo-indicador-blanco"
                                                                : "equipo-indicador equipo-indicador-sin-asignar"
                                                    }
                                                    aria-hidden="true"
                                                />

                                                {inscripcion.nickname}
                                            </strong>

                                            <span>
                                                {inscripcion.posicion ===
                                                "portero"
                                                    ? "Portero"
                                                    : "Jugador"}
                                            </span>
                                        </div>

                                        <select
                                            value={
                                                inscripcion.equipo_partido ??
                                                ""
                                            }
                                            onChange={(event) =>
                                            {
                                                const equipo =
                                                    event.target.value;

                                                if (
                                                    equipo === "blanco" ||
                                                    equipo === "rojo"
                                                )
                                                {
                                                    handleCambiarEquipo(
                                                        inscripcion.id,
                                                        equipo,
                                                    );
                                                }
                                            }}
                                            disabled={
                                                procesando ||
                                                convocatoria.estado ===
                                                    "finalizada"
                                            }
                                        >
                                            <option value="">
                                                Sin asignar
                                            </option>

                                            <option value="blanco">
                                                Equipo blanco
                                            </option>

                                            <option value="rojo">
                                                Equipo rojo
                                            </option>
                                        </select>
                                    </div>
                                ))}
                        </section>

                        {convocatoria.estado !== "finalizada" &&
                            convocatoria.estado !== "cancelada" && (
                            <section className="admin-resultado">
                                <h2>
                                    🏆 Resultado del partido
                                </h2>

                                <p>
                                    Cuando termine el partido,
                                    selecciona el resultado para
                                    actualizar las estadísticas.
                                </p>

                                <div className="admin-resultado-botones">
                                    <button
                                        type="button"
                                        className="primary-button"
                                        onClick={() =>
                                            handleFinalizar(
                                                "blanco",
                                            )
                                        }
                                        disabled={procesando}
                                    >
                                        ⚪ Ganó Blanco
                                    </button>

                                    <button
                                        type="button"
                                        className="danger-button"
                                        onClick={() =>
                                            handleFinalizar(
                                                "rojo",
                                            )
                                        }
                                        disabled={procesando}
                                    >
                                        🔴 Ganó Rojo
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleFinalizar(
                                                "empate",
                                            )
                                        }
                                        disabled={procesando}
                                    >
                                        🤝 Empate
                                    </button>
                                </div>
                            </section>
                        )}

                        {convocatoria.estado === "finalizada" && (
                            <section className="admin-resultado">
                                <h2>
                                    ✅ Partido finalizado
                                </h2>

                                <p>
                                    El resultado ya ha sido
                                    registrado y las estadísticas
                                    han sido actualizadas.
                                </p>
                            </section>
                        )}
                    </>
                )}
            </div>
        </main>
    );
}

export default AdminConvocatoriasPage;