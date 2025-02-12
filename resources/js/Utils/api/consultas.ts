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
      console.log("Producto guardado como favorito.");
    } else {
      // Manejar casos de estado no exitosos (ej. 400, 500)
      console.error(
        "Error al guardar el favorito: Estado de respuesta inesperado:",
        response.status
      );
      onError && onError(new AxiosError(`Unexpected status code: ${response.status}`));
    }
  } catch (error: any) {
    console.error("Error al guardar el favorito:", error);
    // Ejecutar el callback de error si está definido
    onError && onError(error);
  }
};
