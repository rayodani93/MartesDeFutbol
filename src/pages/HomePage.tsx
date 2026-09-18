import {
    useEffect,
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import "./HomePage.css";

import ConvocatoriaCard from "../components/ConvocatoriaCard";
import EquiposPartido from "../components/EquiposPartido";
import ListaInscripciones from "../components/ListaInscripciones";

import {
    useAuth,
} from "../contexts/AuthContext";

import {
    obtenerConvocatoriaActual,
} from "../services/convocatoriasService";

import {
    apuntarse,
    obtenerInscripciones,
    obtenerMiInscripcion,
    retirarse,
} from "../services/inscripcionesService";

import {
    obtenerUltimaNoticiaNoLeida,
} from "../services/noticiasService";

import type {
    InscripcionVisible,
    MiInscripcion,
} from "../services/inscripcionesService";

import type {
    Convocatoria,
} from "../types/convocatoria";

import type {
    Noticia,
} from "../types/noticia";

function HomePage()
{
    const { perfil } = useAuth();

    const navigate =
        useNavigate();

    const [convocatoria, setConvocatoria] =
        useState<Convocatoria | null>(null);

    const [inscripciones, setInscripciones] =
        useState<InscripcionVisible[]>([]);

    const [miInscripcion, setMiInscripcion] =
        useState<MiInscripcion | null>(null);

    const [ultimaNoticiaNoLeida, setUltimaNoticiaNoLeida] =
        useState<Noticia | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [procesando, setProcesando] =
        useState(false);

    const [error, setError] =
        useState("");

    const [mensaje, setMensaje] =
        useState("");

    /*
     * =========================================================
     * CARGAR INSCRIPCIONES
     * =========================================================
     */

    async function cargarInscripciones(
        convocatoriaId: number,
    )
    {
        const [
            miInscripcionActual,
            inscripcionesActuales,
        ] = await Promise.all([
            obtenerMiInscripcion(
                convocatoriaId,
            ),
            obtenerInscripciones(
                convocatoriaId,
            ),
        ]);

        setMiInscripcion(
            miInscripcionActual,
        );

        setInscripciones(
            inscripcionesActuales,
        );
    }

    /*
     * =========================================================
     * CARGAR ÚLTIMA NOTICIA NO LEÍDA
     * =========================================================
     */

    async function cargarUltimaNoticiaNoLeida()
    {
        try
        {
            const noticia =
                await obtenerUltimaNoticiaNoLeida();

            setUltimaNoticiaNoLeida(
                noticia,
            );
        }
        catch (error)
        {
            /*
             * Si falla la comprobación de noticias,
             * no bloqueamos la Home ni mostramos
             * un error general al usuario.
             */

            console.error(
                "Error comprobando noticias no leídas:",
                error,
            );

            setUltimaNoticiaNoLeida(null);
        }
    }

    /*
     * =========================================================
     * CARGAR DATOS
     * =========================================================
     */

    async function cargarDatos()
    {
        try
        {
            setError("");

            /*
             * La noticia y la convocatoria son independientes,
             * por lo que podemos consultarlas al entrar
             * en la Home.
             */

            cargarUltimaNoticiaNoLeida();

            const convocatoriaActual =
                await obtenerConvocatoriaActual();

            setConvocatoria(
                convocatoriaActual,
            );

            if (!convocatoriaActual)
            {
                setMiInscripcion(null);
                setInscripciones([]);
                setMensaje("");

                return;
            }

            await cargarInscripciones(
                convocatoriaActual.id,
            );
        }
        catch (error)
        {
            console.error(
                "Error al cargar la convocatoria:",
                error,
            );

            setError(
                "No se ha podido cargar la convocatoria.",
            );
        }
        finally
        {
            setLoading(false);
        }
    }

    useEffect(() =>
    {
        cargarDatos();
    }, []);

    /*
     * =========================================================
     * LEER NOTICIA
     * =========================================================
     *
     * Aquí NO la marcamos todavía como leída.
     *
     * Simplemente llevamos al usuario a /noticias.
     * NoticiasPage será quien la marque como leída
     * cuando la página se haya cargado correctamente.
     */

    function handleLeerNoticia()
    {
        navigate(
            "/noticias",
        );
    }

    /*
     * =========================================================
     * APUNTARSE
     * =========================================================
     */

    const handleApuntarse = async () =>
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

            const resultado =
                await apuntarse(
                    convocatoria.id,
                );

            setMensaje(
                resultado.mensaje,
            );

            await cargarInscripciones(
                convocatoria.id,
            );
        }
        catch (error)
        {
            console.error(
                "Error al apuntarse:",
                error,
            );

            if (
                error instanceof Error &&
                error.message !== ""
            )
            {
                setError(
                    error.message,
                );
            }
            else
            {
                setError(
                    "No se ha podido completar la inscripción.",
                );
            }
        }
        finally
        {
            setProcesando(false);
        }
    };

    /*
     * =========================================================
     * RETIRARSE
     * =========================================================
     */

    const handleRetirarse = async () =>
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

            await retirarse(
                convocatoria.id,
            );

            setMensaje(
                "Te has retirado de la convocatoria.",
            );

            await cargarInscripciones(
                convocatoria.id,
            );
        }
        catch (error)
        {
            console.error(
                "Error al retirarse:",
                error,
            );

            if (
                error instanceof Error &&
                error.message !== ""
            )
            {
                setError(
                    error.message,
                );
            }
            else
            {
                setError(
                    "No se ha podido retirar la inscripción.",
                );
            }
        }
        finally
        {
            setProcesando(false);
        }
    };

    /*
     * =========================================================
     * LOADING
     * =========================================================
     */

    if (loading)
    {
        return (
            <section className="home-page">
                <p>
                    Cargando convocatoria...
                </p>
            </section>
        );
    }

    /*
     * =========================================================
     * HOME
     * =========================================================
     */

    return (
        <section className="home-page">

            {/*
             * =================================================
             * BANNER NUEVA NOTICIA
             * =================================================
             */}

            {ultimaNoticiaNoLeida && (
                <section
                    className="home-noticia-banner"
                    onClick={
                        handleLeerNoticia
                    }
                >
                    <div className="home-noticia-icono">
                        📰
                    </div>

                    <div className="home-noticia-info">
                        <span className="home-noticia-etiqueta">
                            NUEVA NOTICIA
                        </span>

                        <h2>
                            {
                                ultimaNoticiaNoLeida.titulo
                            }
                        </h2>

                        <p>
                            {
                                ultimaNoticiaNoLeida.contenido
                            }
                        </p>

                        <button
                            type="button"
                            className="home-noticia-leer"
                            onClick={
                                handleLeerNoticia
                            }
                        >
                            Leer noticia →
                        </button>
                    </div>
                </section>
            )}

            {/*
             * =================================================
             * MENSAJES
             * =================================================
             */}

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

            {/*
             * =================================================
             * SIN CONVOCATORIA
             * =================================================
             */}

            {!convocatoria && (
                <section>
                    <h2>
                        No hay convocatoria abierta
                    </h2>

                    <p>
                        Todavía no se ha abierto la
                        inscripción para el próximo
                        entrenamiento.
                    </p>
                </section>
            )}

            {/*
             * =================================================
             * CONVOCATORIA
             * =================================================
             */}

            {convocatoria && (
                <>
                    <ConvocatoriaCard
                        convocatoria={
                            convocatoria
                        }
                        miInscripcion={
                            miInscripcion
                        }
                        procesando={
                            procesando
                        }
                        onApuntarse={
                            handleApuntarse
                        }
                        onRetirarse={
                            handleRetirarse
                        }
                    />

                    <ListaInscripciones
                        inscripciones={
                            inscripciones
                        }
                        nicknameUsuario={
                            perfil?.nickname
                        }
                    />

                    <EquiposPartido
                        inscripciones={
                            inscripciones
                        }
                        nicknameUsuario={
                            perfil?.nickname
                        }
                    />
                </>
            )}

        </section>
    );
}

export default HomePage;