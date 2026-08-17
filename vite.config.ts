import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
    plugins: [
        react(),

        VitePWA({
            registerType: "autoUpdate",

            devOptions: {
                enabled: true,
            },

            manifest: {
                name: "Martes de Fútbol",
                short_name: "Martes Fútbol",

                description:
                    "Gestión de convocatorias de Martes de Fútbol",

                start_url: "/",

                display: "standalone",

                theme_color: "#2f9147",
                background_color: "#101216",

                icons: [
                    {
                        src: "/icon-192.png",
                        sizes: "192x192",
                        type: "image/png",
                        purpose: "any",
                    },
                    {
                        src: "/icon-512.png",
                        sizes: "512x512",
                        type: "image/png",
                        purpose: "any",
                    },
                    {
                        src: "/icon-512.png",
                        sizes: "512x512",
                        type: "image/png",
                        purpose: "maskable",
                    },
                ],
            },
        }),
    ],
});