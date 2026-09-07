import { createClient } from "npm:@supabase/supabase-js@2";
import webpush from "npm:web-push";

const corsHeaders =
{
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type, x-cron-secret",
};

Deno.serve(
    async (req) =>
    {
        if (req.method === "OPTIONS")
        {
            return new Response(
                "ok",
                {
                    headers: corsHeaders,
                },
            );
        }

        try
        {
            const cronSecret =
                Deno.env.get(
                    "CRON_SECRET",
                );

            const requestSecret =
                req.headers.get(
                    "x-cron-secret",
                );

            if (
                !cronSecret ||
                requestSecret !== cronSecret
            )
            {
                return new Response(
                    JSON.stringify(
                        {
                            ok: false,
                            error: "No autorizado",
                        },
                    ),
                    {
                        status: 401,
                        headers:
                        {
                            ...corsHeaders,
                            "Content-Type":
                                "application/json",
                        },
                    },
                );
            }

            const supabaseUrl =
                Deno.env.get(
                    "SUPABASE_URL",
                );

            const serviceRoleKey =
                Deno.env.get(
                    "SUPABASE_SERVICE_ROLE_KEY",
                );

            const vapidPublicKey =
                Deno.env.get(
                    "VAPID_PUBLIC_KEY",
                );

            const vapidPrivateKey =
                Deno.env.get(
                    "VAPID_PRIVATE_KEY",
                );

            if (
                !supabaseUrl ||
                !serviceRoleKey ||
                !vapidPublicKey ||
                !vapidPrivateKey
            )
            {
                throw new Error(
                    "Faltan variables de entorno.",
                );
            }

            webpush.setVapidDetails(
                "mailto:admin@martesdefutbol.app",
                vapidPublicKey,
                vapidPrivateKey,
            );

            const supabase =
                createClient(
                    supabaseUrl,
                    serviceRoleKey,
                );

            const body =
                await req.json();

            const titulo =
                body.titulo ??
                "⚽ Martes de Fútbol";

            const mensaje =
                body.mensaje ??
                "Notificación";

            const userId =
                body.user_id ??
                null;

            let consulta =
                supabase
                    .from(
                        "push_subscriptions",
                    )
                    .select(
                        `
                            id,
                            user_id,
                            endpoint,
                            p256dh,
                            auth
                        `,
                    );

            if (userId)
            {
                consulta =
                    consulta.eq(
                        "user_id",
                        userId,
                    );
            }

            const
            {
                data: suscripciones,
                error,
            } = await consulta;

            if (error)
            {
                throw error;
            }

            const payload =
                JSON.stringify(
                    {
                        title: titulo,
                        body: mensaje,
                    },
                );

            const resultados =
                await Promise.allSettled(
                    (suscripciones ?? []).map(
                        async (suscripcion) =>
                        {
                            await webpush.sendNotification(
                                {
                                    endpoint:
                                        suscripcion.endpoint,

                                    keys:
                                    {
                                        p256dh:
                                            suscripcion.p256dh,

                                        auth:
                                            suscripcion.auth,
                                    },
                                },
                                payload,
                            );
                        },
                    ),
                );

            const enviados =
                resultados.filter(
                    (resultado) =>
                        resultado.status ===
                        "fulfilled",
                ).length;

            const fallidos =
                resultados.filter(
                    (resultado) =>
                        resultado.status ===
                        "rejected",
                ).length;

            return new Response(
                JSON.stringify(
                    {
                        ok: true,
                        enviados,
                        fallidos,
                    },
                ),
                {
                    headers:
                    {
                        ...corsHeaders,
                        "Content-Type":
                            "application/json",
                    },
                },
            );
        }
        catch (error)
        {
            console.error(
                "Error enviando push:",
                error,
            );

            return new Response(
                JSON.stringify(
                    {
                        ok: false,
                        error:
                            error instanceof Error
                                ? error.message
                                : "Error desconocido",
                    },
                ),
                {
                    status: 500,
                    headers:
                    {
                        ...corsHeaders,
                        "Content-Type":
                            "application/json",
                    },
                },
            );
        }
    },
);