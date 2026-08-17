import { supabase } from "./supabase";
import type { Equipo } from "../types/equipo";

export async function obtenerEquipos(): Promise<Equipo[]>
{
    const { data, error } = await supabase
        .from("equipos")
        .select("*")
        .order("orden");

    if (error)
    {
        throw error;
    }

    return data ?? [];
}