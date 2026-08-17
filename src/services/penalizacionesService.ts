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
    const ahora = new Date();

    const penalizadoHasta =
        new Date(
            ahora.getTime() +
            7 * 24 * 60 * 60 * 1000,
        );

    const { error } =
        await supabase
            .from("perfiles")
            .update({
                penalizado_hasta:
                    penalizadoHasta.toISOString(),
            })
            .eq(
                "id",
                perfilId,
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
        await supabase
            .from("perfiles")
            .update({
                penalizado_hasta: null,
            })
            .eq(
                "id",
                perfilId,
            );

    if (error)
    {
        throw error;
    }
}