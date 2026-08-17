import { supabase } from "./supabase";

export interface InscripcionVisible
{
    id: number;
    convocatoria_id: number;
    perfil_id: string;

    estado:
        | "confirmado"
        | "espera";

    orden: number;

    nickname: string;

    posicion:
        | "jugador"
        | "portero";

    equipo_id: number | null;

    equipo_partido:
        | "blanco"
        | "rojo"
        | null;
}

export interface MiInscripcion
{
    convocatoria_id: number;

    estado:
        | "confirmado"
        | "espera";

    orden: number;

    posicion:
        | "jugador"
        | "portero";

    equipo_partido:
        | "blanco"
        | "rojo"
        | null;
}
export interface ResultadoInscripcion
{
    estado:
        | "confirmado"
        | "espera";

    orden: number;

    mensaje: string;
}

export async function obtenerInscripciones(
    convocatoriaId: number,
): Promise<InscripcionVisible[]>
{
    const { data, error } = await supabase
        .from("inscripciones_visibles")
        .select("*")
        .eq(
            "convocatoria_id",
            convocatoriaId,
        )
        .order("estado")
        .order("posicion")
        .order("orden");

    if (error)
    {
        throw error;
    }

    return data ?? [];
}

export async function obtenerMiInscripcion(
    convocatoriaId: number,
): Promise<MiInscripcion | null>
{
    const { data, error } = await supabase.rpc(
        "obtener_mi_inscripcion",
        {
            p_convocatoria_id: convocatoriaId,
        },
    );

    if (error)
    {
        throw error;
    }

    if (!data || data.length === 0)
    {
        return null;
    }

    return data[0];
}

export async function apuntarse(
    convocatoriaId: number,
): Promise<ResultadoInscripcion>
{
    const { data, error } = await supabase.rpc(
        "apuntarse_convocatoria",
        {
            p_convocatoria_id: convocatoriaId,
        },
    );

    if (error)
    {
        throw error;
    }

    if (!data || data.length === 0)
    {
        throw new Error(
            "Supabase no ha devuelto el resultado de la inscripción.",
        );
    }

    return data[0];
}

export async function retirarse(
    convocatoriaId: number,
): Promise<void>
{
    const { error } = await supabase.rpc(
        "retirarse_convocatoria",
        {
            p_convocatoria_id: convocatoriaId,
        },
    );

    if (error)
    {
        throw error;
    }
}

export async function asignarEquipoPartido(
    inscripcionId: number,
    equipoPartido: "blanco" | "rojo",
): Promise<void>
{
    const { error } = await supabase.rpc(
        "asignar_equipo_partido",
        {
            p_inscripcion_id: inscripcionId,
            p_equipo_partido: equipoPartido,
        },
    );

    if (error)
    {
        throw error;
    }
}