import { supabase } from "./supabase";

interface DatosRegistro
{
    nombre: string;
    apellidos: string;
    nickname: string;
    email: string;
    password: string;
    equipoId: number;
    posicion: "jugador" | "portero";
}

interface DatosLogin
{
    email: string;
    password: string;
}

export async function registrarUsuario(
    datos: DatosRegistro,
)
{
    const { data, error } =
        await supabase.auth.signUp({
            email: datos.email,
            password: datos.password,
            options: {
                emailRedirectTo:
                    `${window.location.origin}/confirmado`,

                data: {
                    nombre: datos.nombre,
                    apellidos: datos.apellidos,
                    nickname: datos.nickname,
                    equipo_id: datos.equipoId,
                    posicion: datos.posicion,
                },
            },
        });

    if (error)
    {
        throw error;
    }

    return data;
}

export async function iniciarSesion(
    datos: DatosLogin,
)
{
    const { data, error } =
        await supabase.auth.signInWithPassword({
            email: datos.email,
            password: datos.password,
        });

    if (error)
    {
        throw error;
    }

    return data;
}