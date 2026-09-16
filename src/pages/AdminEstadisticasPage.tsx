import {
    useEffect,
    useState,
} from "react";

import "./AdminPage.css";

import {
    obtenerHistorialPartidos,
} from "../services/estadisticasService";

import {
    finalizarConvocatoria,
} from "../services/convocatoriasService";

import {
    obtenerEstadisticasVisitasNoticias,
    obtenerUltimasVisitasNoticias,
} from "../services/noticiasService";

import type {
    PartidoHistorico,
} from "../services/estadisticasService";

import type {
    EstadisticasVisitasNoticias,
    VisitaNoticia,
} from "../services/noticiasService";

type ResultadoPartido =
    | "blanco"
    | "rojo"
    | "empate";

function AdminEstadisticasPage()
{
    const [partidos, setPartidos] =
        useState<PartidoHistorico[]>([]);

    const [partidoAbierto, setPartidoAbierto] =
        useState<number | null>(null);

    const [partidoEditando, setPartidoEditando] =
        useState<number | null>(null);

    const [procesando, setProcesando] =
        useState<number | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [mensaje, setMensaje] =
        useState("");

    const [
        estadisticasNoticias,
        setEstadisticasNoticias,
    ] = useState<EstadisticasVisitasNoticias>({
        visitas_totales: 0,
        visitantes_unicos: 0,
        visitas_hoy: 0,
    });

    const [
        ultimasVisitasNoticias,
        setUltimasVisitasNoticias,
    ] = useState<VisitaNoticia[]>([]);

    const [
        mostrarTodasVisitas,
        setMostrarTodasVisitas,
    ] = useState(false);

    /*
     * =========================================================
     * CARGAR HISTÓRICO
     * =========================================================
     */

    async function cargarHistorial()
    {
        try
        {
            setLoading(true);
            setError("");

            const historial =
                await obtenerHistorialPartidos();

            setPartidos(historial);
        }
        catch (error)
        {
            console.error(
                "Error cargando histórico:",
                error,
            );

            setError(
                "No se ha podido cargar el histórico de partidos.",
            );
        }
        finally
        {
            setLoading(false);
        }
    }

    /*
     * =========================================================
     * CARGAR VISITAS A NOTICIAS
     * =========================================================
     */

    async function cargarVisitasNoticias()
    {
        try
        {
            const [
                estadisticas,
                visitas,
            ] = await Promise.all([
                obtenerEstadisticasVisitasNoticias(),
                obtenerUltimasVisitasNoticias(50),
            ]);

            setEstadisticasNoticias(
                estadisticas,
            );

            setUltimasVisitasNoticias(
                visitas,
            );
        }
        catch (error)
        {
            console.error(
                "Error cargando visitas de noticias:",
                error,
            );
        }
    }

    useEffect(() =>
    {
        cargarHistorial();
        cargarVisitasNoticias();
    }, []);

    /*
     * =========================================================
     * FORMATEAR FECHAS
     * =========================================================
     */

    function formatearFecha(
        fecha: string,
    )
    {
        return new Intl.DateTimeFormat(
            "es-ES",
            {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
                timeZone: "Europe/Madrid",
            },
        ).format(
            new Date(fecha),
        );
    }

    function formatearFechaVisita(
        fecha: string,
    )
    {
        return new Intl.DateTimeFormat(
            "es-ES",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                timeZone: "Europe/Madrid",
            },
        ).format(
            new Date(fecha),
        );
    }

    /*
     * =========================================================
     * RESULTADOS
     * =========================================================
     */

    function textoResultado(
        resultado:
            | ResultadoPartido
            | null,
    )
    {
        if (resultado === "blanco")
        {
            return "⚪ Ganó Blanco";
        }

        if (resultado === "rojo")
        {
            return "🔴 Ganó Rojo";
        }

        if (resultado === "empate")
        {
            return "🤝 Empate";
        }

        return "Resultado no disponible";
    }

    async function corregirResultado(
        partido: PartidoHistorico,
        nuevoResultado: ResultadoPartido,
    )
    {
        if (
            partido.resultado ===
            nuevoResultado
        )
        {
            setPartidoEditando(null);
            return;
        }

        const resultadoAnterior =
            textoResultado(
                partido.resultado,
            );

        const resultadoNuevo =
            textoResultado(
                nuevoResultado,
            );

        const fecha =
            formatearFecha(
                partido.fecha_inicio,
            );

        const confirmar =
            window.confirm(
                `¿Seguro que quieres cambiar el resultado de ${fecha}?\n\n` +
                `Resultado actual: ${resultadoAnterior}\n` +
                `Nuevo resultado: ${resultadoNuevo}\n\n` +
                `Las estadísticas de los participantes se actualizarán automáticamente.`,
            );

        if (!confirmar)
        {
            return;
        }

        try
        {
            setProcesando(partido.id);
            setError("");
            setMensaje("");

            await finalizarConvocatoria(
                partido.id,
                nuevoResultado,
            );

            const historialActualizado =
                await obtenerHistorialPartidos();

            setPartidos(
                historialActualizado,
            );

            setPartidoEditando(null);

            setMensaje(
                `Resultado corregido: ${resultadoNuevo}.`,
            );
        }
        catch (error)
        {
            console.error(
                "Error corrigiendo resultado:",
                error,
            );

            setError(
                "No se ha podido corregir el resultado.",
            );
        }
        finally
        {
            setProcesando(null);
        }
    }

    /*
     * =========================================================
     * LOADING
     * =========================================================
     */

    if (loading)
    {
        return (
            <main className="admin-page">
                <div className="admin-container">
                    <p>
                        Cargando estadísticas...
                    </p>
                </div>
            </main>
        );
    }

    /*
     * =========================================================
     * PÁGINA
     * =========================================================
     */

    return (
        <main className="admin-page">
            <div className="admin-container">

                <div className="admin-header">
                    <h1>
                        📊 Estadísticas
                    </h1>

                    <p>
                        Consulta el histórico de partidos,
                        resultados, participantes y visitas
                        a Noticias.
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
                    <p
                        className="admin-mensaje-ok"
                        role="status"
                    >
                        {mensaje}
                    </p>
                )}

                {/*
                 * =================================================
                 * RESUMEN DE PARTIDOS
                 * =================================================
                 */}

                <div className="admin-estadisticas-resumen">
                    <div>
                        <strong>
                            {partidos.length}
                        </strong>

                        <span>
                            Partidos disputados
                        </span>
                    </div>

                    <div>
                        <strong>
                            {
                                partidos.reduce(
                                    (
                                        total,
                                        partido,
                                    ) =>
                                        total +
                                        partido
                                            .participantes
                                            .length,
                                    0,
                                )
                            }
                        </strong>

                        <span>
                            Asistencias totales
                        </span>
                    </div>

                    <div>
                        <strong>
                            {
                                partidos.filter(
                                    (partido) =>
                                        partido.resultado ===
                                        "empate",
                                ).length
                            }
                        </strong>

                        <span>
                            Empates
                        </span>
                    </div>
                </div>

                {/*
                 * =================================================
                 * VISITAS A NOTICIAS
                 * =================================================
                 */}

                <section className="admin-visitas-noticias">
                    <h2>
                        📰 Visitas a Noticias
                    </h2>

                    <div className="admin-estadisticas-resumen">
                        <div>
                            <strong>
                                {
                                    estadisticasNoticias
                                        .visitas_totales
                                }
                            </strong>

                            <span>
                                Visitas totales
                            </span>
                        </div>

                        <div>
                            <strong>
                                {
                                    estadisticasNoticias
                                        .visitantes_unicos
                                }
                            </strong>

                            <span>
                                Visitantes únicos
                            </span>
                        </div>

                        <div>
                            <strong>
                                {
                                    estadisticasNoticias
                                        .visitas_hoy
                                }
                            </strong>

                            <span>
                                Visitas hoy
                            </span>
                        </div>
                    </div>

                    <div className="admin-ultimas-visitas">
                        <h3>
                            👀 Últimas visitas
                        </h3>

                        {
                            ultimasVisitasNoticias.length === 0
                                ? (
                                    <p>
                                        Todavía no hay visitas
                                        registradas.
                                    </p>
                                )
                                : (
                                    <>
                                        {
                                            ultimasVisitasNoticias
                                                .slice(
                                                    0,
                                                    mostrarTodasVisitas
                                                        ? ultimasVisitasNoticias.length
                                                        : 10,
                                                )
                                                .map(
                                                    (visita) => (
                                                        <div
                                                            key={visita.id}
                                                            className="admin-visita-noticia"
                                                        >
                                                            <strong>
                                                                {
                                                                    visita.nickname
                                                                }
                                                            </strong>

                                                            <span>
                                                                {
                                                                    formatearFechaVisita(
                                                                        visita
                                                                            .visitado_en,
                                                                    )
                                                                }
                                                            </span>
                                                        </div>
                                                    ),
                                                )
                                        }

                                        {
                                            ultimasVisitasNoticias.length >
                                                10 && (
                                                <button
                                                    type="button"
                                                    className="admin-ver-visitas"
                                                    onClick={() =>
                                                        setMostrarTodasVisitas(
                                                            (
                                                                valorActual,
                                                            ) =>
                                                                !valorActual,
                                                        )
                                                    }
                                                >
                                                    {
                                                        mostrarTodasVisitas
                                                            ? "Mostrar solo las últimas 10"
                                                            : `Ver todas las visitas (${ultimasVisitasNoticias.length})`
                                                    }
                                                </button>
                                            )
                                        }
                                    </>
                                )
                        }
                    </div>
                </section>

                {/*
                 * =================================================
                 * HISTORIAL DE PARTIDOS
                 * =================================================
                 */}

                <section className="admin-historial">
                    <h2>
                        ⚽ Historial de partidos
                    </h2>

                    {partidos.length === 0 && (
                        <p>
                            Todavía no hay partidos
                            finalizados.
                        </p>
                    )}

                    {partidos.map(
                        (partido) =>
                        {
                            const abierto =
                                partidoAbierto ===
                                partido.id;

                            const editando =
                                partidoEditando ===
                                partido.id;

                            const trabajando =
                                procesando ===
                                partido.id;

                            const blancos =
                                partido.participantes
                                    .filter(
                                        (participante) =>
                                            participante
                                                .equipo_partido ===
                                            "blanco",
                                    );

                            const rojos =
                                partido.participantes
                                    .filter(
                                        (participante) =>
                                            participante
                                                .equipo_partido ===
                                            "rojo",
                                    );

                            return (
                                <article
                                    key={partido.id}
                                    className="admin-partido-card"
                                >
                                    <div className="admin-partido-cabecera">
                                        <div>
                                            <h3>
                                                {
                                                    formatearFecha(
                                                        partido
                                                            .fecha_inicio,
                                                    )
                                                }
                                            </h3>

                                            <strong className="admin-partido-resultado">
                                                {
                                                    textoResultado(
                                                        partido.resultado,
                                                    )
                                                }
                                            </strong>
                                        </div>

                                        <div className="admin-partido-datos">
                                            👥{" "}
                                            {
                                                partido
                                                    .participantes
                                                    .length
                                            }{" "}
                                            participantes
                                        </div>
                                    </div>

                                    <div className="admin-partido-botones">
                                        <button
                                            type="button"
                                            className="admin-ver-participantes"
                                            onClick={() =>
                                                setPartidoAbierto(
                                                    abierto
                                                        ? null
                                                        : partido.id,
                                                )
                                            }
                                        >
                                            {
                                                abierto
                                                    ? "Ocultar participantes"
                                                    : "Ver participantes"
                                            }
                                        </button>

                                        <button
                                            type="button"
                                            className="admin-corregir-resultado"
                                            disabled={trabajando}
                                            onClick={() =>
                                                setPartidoEditando(
                                                    editando
                                                        ? null
                                                        : partido.id,
                                                )
                                            }
                                        >
                                            ✏️ Corregir resultado
                                        </button>
                                    </div>

                                    {editando && (
                                        <div className="admin-editor-resultado">
                                            <p>
                                                Selecciona el resultado correcto:
                                            </p>

                                            <div className="admin-opciones-resultado">
                                                <button
                                                    type="button"
                                                    className={
                                                        partido.resultado ===
                                                        "blanco"
                                                            ? "resultado-seleccionado"
                                                            : ""
                                                    }
                                                    disabled={trabajando}
                                                    onClick={() =>
                                                        corregirResultado(
                                                            partido,
                                                            "blanco",
                                                        )
                                                    }
                                                >
                                                    ⚪ Ganó Blanco
                                                </button>

                                                <button
                                                    type="button"
                                                    className={
                                                        partido.resultado ===
                                                        "rojo"
                                                            ? "resultado-seleccionado"
                                                            : ""
                                                    }
                                                    disabled={trabajando}
                                                    onClick={() =>
                                                        corregirResultado(
                                                            partido,
                                                            "rojo",
                                                        )
                                                    }
                                                >
                                                    🔴 Ganó Rojo
                                                </button>

                                                <button
                                                    type="button"
                                                    className={
                                                        partido.resultado ===
                                                        "empate"
                                                            ? "resultado-seleccionado"
                                                            : ""
                                                    }
                                                    disabled={trabajando}
                                                    onClick={() =>
                                                        corregirResultado(
                                                            partido,
                                                            "empate",
                                                        )
                                                    }
                                                >
                                                    🤝 Empate
                                                </button>
                                            </div>

                                            {trabajando && (
                                                <p className="admin-guardando-resultado">
                                                    Actualizando resultado...
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {abierto && (
                                        <div className="admin-partido-equipos">
                                            <div className="admin-equipo-historico admin-equipo-blanco">
                                                <h4>
                                                    ⚪ Equipo Blanco
                                                </h4>

                                                <span className="admin-equipo-contador">
                                                    {
                                                        blancos.length
                                                    }{" "}
                                                    jugadores
                                                </span>

                                                {
                                                    blancos.map(
                                                        (
                                                            participante,
                                                        ) => (
                                                            <div
                                                                key={
                                                                    participante
                                                                        .inscripcion_id
                                                                }
                                                                className="admin-participante"
                                                            >
                                                                <span>
                                                                    {
                                                                        participante
                                                                            .nickname
                                                                    }
                                                                </span>

                                                                <small>
                                                                    {
                                                                        participante
                                                                            .posicion ===
                                                                        "portero"
                                                                            ? "🧤 Portero"
                                                                            : "⚽ Jugador"
                                                                    }
                                                                </small>
                                                            </div>
                                                        ),
                                                    )
                                                }
                                            </div>

                                            <div className="admin-equipo-historico admin-equipo-rojo">
                                                <h4>
                                                    🔴 Equipo Rojo
                                                </h4>

                                                <span className="admin-equipo-contador">
                                                    {
                                                        rojos.length
                                                    }{" "}
                                                    jugadores
                                                </span>

                                                {
                                                    rojos.map(
                                                        (
                                                            participante,
                                                        ) => (
                                                            <div
                                                                key={
                                                                    participante
                                                                        .inscripcion_id
                                                                }
                                                                className="admin-participante"
                                                            >
                                                                <span>
                                                                    {
                                                                        participante
                                                                            .nickname
                                                                    }
                                                                </span>

                                                                <small>
                                                                    {
                                                                        participante
                                                                            .posicion ===
                                                                        "portero"
                                                                            ? "🧤 Portero"
                                                                            : "⚽ Jugador"
                                                                    }
                                                                </small>
                                                            </div>
                                                        ),
                                                    )
                                                }
                                            </div>
                                        </div>
                                    )}
                                </article>
                            );
                        },
                    )}
                </section>
            </div>
        </main>
    );
}

export default AdminEstadisticasPage;