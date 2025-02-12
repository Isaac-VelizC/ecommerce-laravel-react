import axios, { AxiosError } from 'axios';

interface HandleDeleteFavoriteProps {
  id: number;
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
}

const handleDeleteFavorite = async ({
  id,
  onSuccess,
  onError,
}: HandleDeleteFavoriteProps) => {
  try {
    const response = await axios.delete(route('wishlist-delete', id));

    if (response.status === 200) {
      const successMessage = response.data.success || 'Producto eliminado de favoritos.';
      console.log(successMessage);
      onSuccess?.(successMessage); // Llama al callback onSuccess si existe
    } else {
      // Mostrar mensaje de error
      const errorMessage = response.data.error || `Error al eliminar: ${response.status}`;
      console.error(errorMessage);
      onError?.(errorMessage); // Llama al callback onError si existe
    }
  } catch (error: any) {
    // Manejar errores de red u otros errores inesperados
    const errorMessage =
      (error as AxiosError)?.message || 'Error de red al eliminar de favoritos.';
    console.error(errorMessage, error);
    onError?.(errorMessage); // Llama al callback onError si existe
  }
};

export default handleDeleteFavorite;
