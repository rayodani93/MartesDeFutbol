import { supabase } from "./supabase";

export interface PenalizacionJugador
{
    id: string;
    nombre: string;
    apellidos: string;
    nickname: string;

    retiradas_penalizables: number;

    penalizado_hasta: string | null;

    activo: boolean;
    bloqueado: boolean;
}

export async function obtenerPenalizaciones():
    Promise<PenalizacionJugador[]>
{
    const { data, error } =
        await supabase
            .from("perfiles")
            .select(`
                id,
                nombre,
                apellidos,
                nickname,
                retiradas_penalizables,
                penalizado_hasta,
                activo,
                bloqueado
            `)
            .order(
                "nombre",
                {
                    ascending: true,
                },
            )
            .order(
                "apellidos",
                {
                    ascending: true,
                },
            );

    if (error)
    {
        throw error;
    }

    return data ?? [];
}

export async function sancionarUnaSemana(
    perfilId: string,
): Promise<void>
{
    const { error } =
        await supabase.rpc(
            "admin_sancionar_proximo_partido",
            {
                p_perfil_id: perfilId,
            },
        );

    if (error)
    {
        throw error;
    }
}

export async function quitarSancion(
    perfilId: string,
): Promise<void>
{
    const { error } =
        await supabase.rpc(
            "admin_quitar_sancion",
            {
                p_perfil_id: perfilId,
            },
        );

    if (error)
    {
        throw error;
    }
}