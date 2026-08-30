self.addEventListener(
    "push",
    (event) =>
    {
        let data =
        {
            title: "⚽ Martes de Fútbol",
            body: "Tienes una nueva notificación.",
        };

        if (event.data)
        {
            try
            {
                data =
                    event.data.json();
            }
            catch
            {
                data.body =
                    event.data.text();
            }
        }

        const options =
        {
            body: data.body,

            icon:
                "/icon-192.png",

            badge:
                "/icon-192.png",

            data:
            {
                url: "/",
            },
        };

        event.waitUntil(
            self.registration.showNotification(
                data.title,
                options,
            ),
        );
    },
);

self.addEventListener(
    "notificationclick",
    (event) =>
    {
        event.notification.close();

        event.waitUntil(
            clients.openWindow(
                event.notification.data?.url ?? "/",
            ),
        );
    },
);