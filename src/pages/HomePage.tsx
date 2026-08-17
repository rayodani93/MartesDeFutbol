import { useEffect, useState } from "react";

import "./HomePage.css";

import ConvocatoriaCard from "../components/ConvocatoriaCard";
import EquiposPartido from "../components/EquiposPartido";
import ListaInscripciones from "../components/ListaInscripciones";

import { useAuth } from "../contexts/AuthContext";

import
{
    obtenerConvocatoriaActual,
} from "../services/convocatoriasService";

import
{
    apuntarse,
    obtenerInscripciones,
    obtenerMiInscripcion,
    retirarse,
} from "../services/inscripcionesService";

import type
{
    InscripcionVisible,
    MiInscripcion,
} from "../services/inscripcionesService";

import type { Convocatoria } from "../types/convocatoria";

function HomePage()
{
    const { perfil } = useAuth();

    const [convocatoria, setConvocatoria] =
        useState<Convocatoria | null>(null);

    const [inscripciones, setInscripciones] =
        useState<InscripcionVisible[]>([]);

    const [miInscripcion, setMiInscripcion] =
        useState<MiInscripcion | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [procesando, setProcesando] =
        useState(false);

    const [error, setError] =
        useState("");

    const [mensaje, setMensaje] =
        useState("");

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

    async function cargarDatos()
    {
        try
        {
            setError("");

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

    return (
        <section className="home-page">
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
                        No hay convocatoria abierta
                    </h2>

                    <p>
                        Todavía no se ha abierto la
                        inscripción para el próximo
                        entrenamiento.
                    </p>
                </section>
            )}

            {convocatoria && (
                <>
                    <ConvocatoriaCard
                        convocatoria={convocatoria}
                        miInscripcion={miInscripcion}
                        procesando={procesando}
                        onApuntarse={handleApuntarse}
                        onRetirarse={handleRetirarse}
                    />

                    <ListaInscripciones
                        inscripciones={inscripciones}
                        nicknameUsuario={
                            perfil?.nickname
                        }
                    />

                    <EquiposPartido
                        inscripciones={inscripciones}
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