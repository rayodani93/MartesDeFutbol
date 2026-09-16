import { supabase } from "./supabase";

export interface EstadisticasUsuario
{
    entrenamientos: number;
    victorias: number;
    empates: number;
    derrotas: number;
    porcentaje_victorias: number;
    porcentaje_asistencia: number;
}

export async function obtenerEstadisticasUsuario(
    perfilId: string,
): Promise<EstadisticasUsuario>
{
    const { data, error } =
        await supabase.rpc(
            "obtener_estadisticas_usuario",
            {
                p_perfil_id: perfilId,
            },
        );

    if (error)
    {
        throw error;
    }

    const estadisticas = data?.[0];

    if (!estadisticas)
    {
        return {
            entrenamientos: 0,
            victorias: 0,
            empates: 0,
            derrotas: 0,
            porcentaje_victorias: 0,
            porcentaje_asistencia: 0,
        };
    }

    return {
        entrenamientos:
            Number(estadisticas.entrenamientos) || 0,

        victorias:
            Number(estadisticas.victorias) || 0,

        empates:
            Number(estadisticas.empates) || 0,

        derrotas:
            Number(estadisticas.derrotas) || 0,

        porcentaje_victorias:
            Number(estadisticas.porcentaje_victorias) || 0,

        porcentaje_asistencia:
            Number(estadisticas.porcentaje_asistencia) || 0,
    };
}

export interface RankingAsistencia
{
    posicion: number;
    perfil_id: string;
    nickname: string;
    entrenamientos: number;
    porcentaje_asistencia: number;
}

export async function obtenerRankingAsistencia():
    Promise<RankingAsistencia[]>
{
    const { data, error } =
        await supabase.rpc(
            "obtener_ranking_asistencia",
        );

    if (error)
    {
        throw error;
    }

    const jugadores =
        (data ?? []) as RankingAsistencia[];

    return jugadores.map(
        (jugador: RankingAsistencia) =>
        {
            return {
                posicion:
                    Number(jugador.posicion),

                perfil_id:
                    jugador.perfil_id,

                nickname:
                    jugador.nickname,

                entrenamientos:
                    Number(jugador.entrenamientos) || 0,

                porcentaje_asistencia:
                    Number(
                        jugador.porcentaje_asistencia,
                    ) || 0,
            };
        },
    );
}
export interface ParticipantePartido
{
    inscripcion_id: number;
    perfil_id: string;
    nickname: string;
    posicion: "jugador" | "portero";
    equipo_partido: "blanco" | "rojo";
    resultado: "victoria" | "derrota" | "empate";
}

export interface PartidoHistorico
{
    id: number;
    fecha_inicio: string;
    resultado: "blanco" | "rojo" | "empate" | null;
    participantes: ParticipantePartido[];
}

interface InscripcionHistorica
{
    id: number;
    convocatoria_id: number;
    perfil_id: string;
    equipo_partido: "blanco" | "rojo" | null;
    resultado: "victoria" | "derrota" | "empate" | null;

    perfiles:
        | {
            nickname: string;
            posicion: "jugador" | "portero";
        }
        | {
            nickname: string;
            posicion: "jugador" | "portero";
        }[]
        | null;
}

export async function obtenerHistorialPartidos()
: Promise<PartidoHistorico[]>
{
    /*
     * Primero obtenemos únicamente las convocatorias
     * que ya han sido finalizadas.
     */
    const {
        data: convocatorias,
        error: errorConvocatorias,
    } = await supabase
        .from("convocatorias")
        .select(
            `
                id,
                fecha_inicio
            `,
        )
        .eq("estado", "finalizada")
        .order(
            "fecha_inicio",
            {
                ascending: false,
            },
        );

    if (errorConvocatorias)
    {
        throw errorConvocatorias;
    }

    if (!convocatorias?.length)
    {
        return [];
    }

    const convocatoriaIds =
        convocatorias.map(
            (convocatoria) =>
                convocatoria.id,
        );

    /*
     * Recuperamos los participantes confirmados
     * de esos partidos.
     *
     * También traemos nickname y posición
     * desde perfiles.
     */
    const {
        data,
        error: errorInscripciones,
    } = await supabase
        .from("inscripciones")
        .select(
            `
                id,
                convocatoria_id,
                perfil_id,
                equipo_partido,
                resultado,
                perfiles (
                    nickname,
                    posicion
                )
            `,
        )
        .in(
            "convocatoria_id",
            convocatoriaIds,
        )
        .eq(
            "estado",
            "confirmado",
        );

    if (errorInscripciones)
    {
        throw errorInscripciones;
    }

    const inscripciones =
        (data ?? []) as InscripcionHistorica[];

    return convocatorias.map(
        (convocatoria) =>
        {
            const inscripcionesPartido =
                inscripciones.filter(
                    (inscripcion) =>
                        inscripcion.convocatoria_id ===
                        convocatoria.id,
                );

            /*
             * Solo incluimos participantes que tengan
             * equipo y resultado registrados.
             */
            const participantes =
                inscripcionesPartido
                    .filter(
                        (inscripcion) =>
                            (
                                inscripcion.equipo_partido ===
                                    "blanco" ||
                                inscripcion.equipo_partido ===
                                    "rojo"
                            ) &&
                            (
                                inscripcion.resultado ===
                                    "victoria" ||
                                inscripcion.resultado ===
                                    "derrota" ||
                                inscripcion.resultado ===
                                    "empate"
                            ),
                    )
                    .map(
                        (inscripcion) =>
                        {
                            const perfil =
                                Array.isArray(
                                    inscripcion.perfiles,
                                )
                                    ? inscripcion.perfiles[0]
                                    : inscripcion.perfiles;

                            return {
                                inscripcion_id:
                                    inscripcion.id,

                                perfil_id:
                                    inscripcion.perfil_id,

                                nickname:
                                    perfil?.nickname ??
                                    "Jugador",

                                posicion:
                                    perfil?.posicion ??
                                    "jugador",

                                equipo_partido:
                                    inscripcion.equipo_partido as
                                        "blanco" | "rojo",

                                resultado:
                                    inscripcion.resultado as
                                        "victoria" |
                                        "derrota" |
                                        "empate",
                            };
                        },
                    );

            /*
             * Reconstruimos el resultado global
             * a partir de los resultados individuales.
             */
            let resultado:
                "blanco" |
                "rojo" |
                "empate" |
                null = null;

            if (
                participantes.some(
                    (participante) =>
                        participante.resultado ===
                        "empate",
                )
            )
            {
                resultado = "empate";
            }
            else
            {
                const ganador =
                    participantes.find(
                        (participante) =>
                            participante.resultado ===
                            "victoria",
                    );

                if (ganador)
                {
                    resultado =
                        ganador.equipo_partido;
                }
            }

            return {
                id: convocatoria.id,
                fecha_inicio:
                    convocatoria.fecha_inicio,
                resultado,
                participantes,
            };
        },
    );
}