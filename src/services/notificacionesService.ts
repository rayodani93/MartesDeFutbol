import { supabase } from "./supabase";

function urlBase64ToUint8Array(
    base64String: string,
)
{
    const padding =
        "=".repeat(
            (4 - base64String.length % 4) % 4,
        );

    const base64 =
        (
            base64String +
            padding
        )
            .replace(/-/g, "+")
            .replace(/_/g, "/");

    const rawData =
        window.atob(base64);

    return Uint8Array.from(
        [...rawData].map(
            (char) =>
                char.charCodeAt(0),
        ),
    );
}

export async function activarNotificaciones()
{
    if (
        !("serviceWorker" in navigator) ||
        !("PushManager" in window)
    )
    {
        throw new Error(
            "Este dispositivo no permite notificaciones push.",
        );
    }

    const permiso =
        await Notification.requestPermission();

    if (permiso !== "granted")
    {
        throw new Error(
            "No se han permitido las notificaciones.",
        );
    }

    const registration =
        await navigator.serviceWorker.ready;

    const vapidPublicKey =
        import.meta.env.VITE_VAPID_PUBLIC_KEY;

    if (!vapidPublicKey)
    {
        throw new Error(
            "Falta configurar la clave pública de notificaciones.",
        );
    }

    let subscription =
        await registration.pushManager.getSubscription();

    if (!subscription)
    {
        subscription =
            await registration.pushManager.subscribe({
                userVisibleOnly: true,

                applicationServerKey:
                    urlBase64ToUint8Array(
                        vapidPublicKey,
                    ),
            });
    }

    const {
        data:
        {
            user,
        },
        error: userError,
    } =
        await supabase.auth.getUser();

    if (userError)
    {
        throw userError;
    }

    if (!user)
    {
        throw new Error(
            "No hay ningún usuario autenticado.",
        );
    }

    const json =
        subscription.toJSON();

    const p256dh =
        json.keys?.p256dh;

    const auth =
        json.keys?.auth;

    if (
        !p256dh ||
        !auth
    )
    {
        throw new Error(
            "No se han podido obtener las claves de la suscripción.",
        );
    }

    const { error } =
        await supabase
            .from("push_subscriptions")
            .upsert(
                {
                    user_id: user.id,
                    endpoint:
                        subscription.endpoint,
                    p256dh,
                    auth,
                },
                {
                    onConflict: "endpoint",
                },
            );

    if (error)
    {
        throw error;
    }
}