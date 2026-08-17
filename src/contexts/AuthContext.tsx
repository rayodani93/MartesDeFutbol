import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import type { Session } from "@supabase/supabase-js";
import type { Perfil } from "../types/perfil";

import { supabase } from "../services/supabase";
import { obtenerPerfil } from "../services/perfilesService";

interface AuthContextType
{
    session: Session | null;
    perfil: Perfil | null;
    loading: boolean;
    cerrarSesion: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    session: null,
    perfil: null,
    loading: true,
    cerrarSesion: async () =>
    {
        return;
    },
});

export function AuthProvider(
    {
        children,
    }: {
        children: React.ReactNode;
    },
)
{
    const [session, setSession] = useState<Session | null>(null);
    const [perfil, setPerfil] = useState<Perfil | null>(null);
    const [loading, setLoading] = useState(true);

    async function cargarPerfil(
        currentSession: Session | null,
    )
    {
        if (!currentSession)
        {
            setPerfil(null);
            return;
        }

        try
        {
            const perfilUsuario = await obtenerPerfil(
                currentSession.user.id,
            );

            setPerfil(perfilUsuario);
        }
        catch (error)
{
    console.error(error);

    setPerfil(null);
}
    }

    useEffect(() =>
    {
        async function cargarSesion()
        {
            const { data } = await supabase.auth.getSession();

            setSession(data.session);
            await cargarPerfil(data.session);
            setLoading(false);
        }

        cargarSesion();

        const { data: listener } =
            supabase.auth.onAuthStateChange(
                async (_event, currentSession) =>
                {
                    setSession(currentSession);
                    await cargarPerfil(currentSession);
                    setLoading(false);
                },
            );

        return () =>
        {
            listener.subscription.unsubscribe();
        };
    }, []);

    async function cerrarSesion()
    {
        const { error } = await supabase.auth.signOut();

        if (error)
        {
            throw error;
        }

        setSession(null);
        setPerfil(null);
    }

    return (
        <AuthContext.Provider
            value={{
                session,
                perfil,
                loading,
                cerrarSesion,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth()
{
    return useContext(AuthContext);
}