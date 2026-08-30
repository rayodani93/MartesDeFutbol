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