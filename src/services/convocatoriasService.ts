import { supabase } from "./supabase";

import type {
    Convocatoria,
} from "../types/convocatoria";

export async function obtenerConvocatoriaActual()
: Promise<Convocatoria | null>
{
    const { data, error } = await supabase.rpc(
        "obtener_convocatoria_actual",
    );

    if (error)
    {
        throw new Error(
            `Error al obtener la convocatoria actual: ${error.message}`,
        );
    }

    return data ?? null;
}

export async function cerrarConvocatoria()
: Promise<Convocatoria>
{
    const { data, error } = await supabase.rpc(
        "cerrar_convocatoria_actual",
    );

    if (error)
    {
        throw new Error(
            `Error al cerrar la convocatoria: ${error.message}`,
        );
    }

    if (!data)
    {
        throw new Error(
            "No se ha encontrado ninguna convocatoria para cerrar.",
        );
    }

    return data;
}

export async function reabrirConvocatoria()
: Promise<Convocatoria>
{
    const { data, error } = await supabase.rpc(
        "reabrir_convocatoria_actual",
    );

    if (error)
    {
        throw new Error(
            `Error al reabrir la convocatoria: ${error.message}`,
        );
    }

    if (!data)
    {
        throw new Error(
            "No se ha encontrado ninguna convocatoria para reabrir.",
        );
    }

    return data;
}

export async function cancelarConvocatoria()
: Promise<Convocatoria>
{
    const { data, error } = await supabase.rpc(
        "cancelar_convocatoria_actual",
    );

    if (error)
    {
        throw new Error(
            `Error al cancelar la convocatoria: ${error.message}`,
        );
    }

    if (!data)
    {
        throw new Error(
            "No se ha encontrado ninguna convocatoria para cancelar.",
        );
    }

    return data;
}