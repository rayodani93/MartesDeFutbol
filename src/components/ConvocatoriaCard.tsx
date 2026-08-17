import "./ConvocatoriaCard.css";

import type
{
    ReactNode,
} from "react";

import type
{
    Convocatoria,
} from "../types/convocatoria";

import type
{
    MiInscripcion,
} from "../services/inscripcionesService";

interface ConvocatoriaCardProps
{
    convocatoria: Convocatoria;
    miInscripcion?: MiInscripcion | null;
    procesando?: boolean;
    onApuntarse?: () => void;
    onRetirarse?: () => void;
    acciones?: ReactNode;
}

function ConvocatoriaCard(
    {
        convocatoria,
        miInscripcion,
        procesando = false,
        onApuntarse,
        onRetirarse,
        acciones,
    }: ConvocatoriaCardProps,
)
{
    const formatearFecha = (
        fecha: string,
    ) =>
    {
        return new Intl.DateTimeFormat(
            "es-ES",
            {
                weekday: "long",
                day: "numeric",
                month: "long",
                timeZone: "Europe/Madrid",
            },
        ).format(
            new Date(fecha),
        );
    };

    const formatearHora = (
        fecha: string,
    ) =>
    {
        return new Intl.DateTimeFormat(
            "es-ES",
            {
                hour: "2-digit",
                minute: "2-digit",
                timeZone: "Europe/Madrid",
            },
        ).format(
            new Date(fecha),
        );
    };

    const textosEstado: Record<
        Convocatoria["estado"],
        string
    > =
    {
        programada:
            "🟡 Convocatoria programada",
        abierta:
            "🟢 Inscripción abierta",
        cerrada:
            "🔴 Inscripción cerrada",
        finalizada:
            "⚪ Entrenamiento finalizado",
        cancelada:
            "⚫ Convocatoria cancelada",
    };

    const puedeApuntarse =
        convocatoria.estado === "abierta" &&
        miInscripcion === null &&
        onApuntarse !== undefined;

    const puedeRetirarse =
        convocatoria.estado === "abierta" &&
        miInscripcion !== null &&
        onRetirarse !== undefined;

    return (
        <section className="convocatoria-card">
            <h2>
                📅 Próximo entrenamiento
            </h2>

            <p className="convocatoria-fecha">
                {
                    formatearFecha(
                        convocatoria.fecha_inicio,
                    )
                }
            </p>

            <p className="convocatoria-horario">
                {
                    formatearHora(
                        convocatoria.fecha_inicio,
                    )
                }
                {" - "}
                {
                    formatearHora(
                        convocatoria.fecha_fin,
                    )
                }
            </p>

            <p className="convocatoria-estado">
                {
                    textosEstado[
                        convocatoria.estado
                    ]
                }
            </p>

            {
                puedeApuntarse &&
                (
                    <button
                        type="button"
                        className="primary-button"
                        onClick={onApuntarse}
                        disabled={procesando}
                    >
                        {
                            procesando
                                ? "Apuntando..."
                                : "Apuntarme"
                        }
                    </button>
                )
            }

            {
                miInscripcion?.estado === "confirmado" &&
                (
                    <p className="inscripcion-confirmada">
                        ✅ ¡Estás convocado!{" "}
                        <strong>
                            (Puesto {miInscripcion.orden})
                        </strong>
                    </p>
                )
            }

            {
                miInscripcion?.estado === "espera" &&
                (
                    <p className="inscripcion-espera">
                        🟠 Lista de espera{" "}
                        <strong>
                            (Posición {miInscripcion.orden})
                        </strong>
                    </p>
                )
            }

            {
                puedeRetirarse &&
                (
                    <button
                        type="button"
                        className="danger-button"
                        onClick={onRetirarse}
                        disabled={procesando}
                    >
                        {
                            procesando
                                ? "Retirando..."
                                : "Retirarme"
                        }
                    </button>
                )
            }

            {acciones}
        </section>
    );
}

export default ConvocatoriaCard;