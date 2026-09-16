import { supabase } from "./supabase";

import type { Perfil } from "../types/perfil";

export async function obtenerPerfil(
    userId: string,
): Promise<Perfil>
{
    const { data, error } = await supabase
        .from("perfiles")
        .select("*")
        .eq("id", userId)
        .single();

    if (error)
    {
        console.error(error);
        throw error;
    }

    return data;
}

export async function obtenerPerfiles()
: Promise<Perfil[]>
{
    const { data, error } = await supabase
        .from("perfiles")
        .select("*")
        .order("nickname");

    if (error)
    {
        console.error(error);
        throw error;
    }

    return data ?? [];
}

export async function actualizarPerfilAdmin(
    userId: string,
    cambios: Partial<
        Pick<
            Perfil,
            | "nombre"
            | "apellidos"
            | "nickname"
            | "equipo_id"
            | "rol"
            | "posicion"
            | "activo"
            | "bloqueado"
            | "motivo_bloqueo"
        >
    >,
): Promise<void>
{
    const { error } = await supabase
        .from("perfiles")
        .update(cambios)
        .eq("id", userId);

    if (error)
    {
        console.error(
            "Error actualizando perfil:",
            error,
        );

        throw error;
    }
}