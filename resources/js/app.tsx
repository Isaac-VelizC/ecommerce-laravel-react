import "../css/app.css";
import "./bootstrap";

import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot } from "react-dom/client";
import { CartProvider } from "./Context/CartContext";
import { SettingProvider } from "./Context/SettingsContext";
import { HelmetProvider } from "react-helmet-async";

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob("./Pages/**/*.tsx")
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <HelmetProvider>
                <SettingProvider>
                    <CartProvider>
                        <App {...props} />
                    </CartProvider>
                </SettingProvider>
            </HelmetProvider>
        );
    },
    progress: {
        color: "#ff6b8e",
    },
});
