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