import { router } from "@inertiajs/react";
import axios, { AxiosError } from "axios";

interface SaveFavoriteProductProps {
    slug: string;
    onSuccess?: (data: any) => void; // Callback para éxito
    onError?: (error: AxiosError) => void; // Callback para error
}

export const saveFavoriteProduct = async ({
    slug,
    onSuccess,
    onError,
}: SaveFavoriteProductProps) => {
    try {
        const response = await axios.get(route("add-to-wishlist", slug));
        if (response.status === 200) {
            // Ejecutar el callback de éxito si está definido
            onSuccess && onSuccess(response.data);
        } else {
            // Manejar casos de estado no exitosos (ej. 400, 500)
            console.error(
                "Error al guardar el favorito: Estado de respuesta inesperado:",
                response.status
            );
            onError &&
                onError(
                    new AxiosError(`Unexpected status code: ${response.status}`)
                );
        }
    } catch (error: any) {
        if (error.response.status === 401) {
            console.warn("Usuario no autenticado, redirigiendo al login...");
            router.visit("/login"); // Redirigir al login si no está autenticado
        } else {
            onError && onError(error);
            console.error("Error de red:", error);
        }
    }
};
