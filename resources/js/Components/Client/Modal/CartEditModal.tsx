import PrimaryButton from "@/Components/Dashboard/Buttons/PrimaryButton";
import SecondaryButton from "@/Components/Dashboard/Buttons/SecondaryButton";
import InputLabel from "@/Components/Dashboard/Form/InputLabel";
import TextInput from "@/Components/Dashboard/Form/TextInput";
import Modal from "@/Components/Modal";
import { CartInterface } from "@/Interfaces/Cart";
import { SizesInterface } from "@/Interfaces/Product";
import { router } from "@inertiajs/react";
import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";

type Props = {
    showModal: boolean;
    sizes: SizesInterface[];
    closeModal: () => void;
    cartItem: CartInterface | null;
};

const CartEditModal = ({ showModal, sizes, closeModal, cartItem }: Props) => {
    const [error, setError] = useState<string | null>(null);
    const [quantity, setQuantity] = useState<number>(cartItem?.quantity || 1);
    const [selectedSize, setSelectedSize] = useState<number | null>(
        cartItem?.inventario_con_detalles.talla_id ?? null
    );
    const [stockAvailable, setStockAvailable] = useState<boolean>(true);
    const [stockQuantity, setStockQuantity] = useState<number>(0);

    useEffect(() => {
        if (cartItem) {
            setQuantity(cartItem.quantity);
            setSelectedSize(cartItem.inventario_con_detalles.talla_id);
        }
    }, [cartItem]);

    const checkAvailability = async (size: number) => {
        if (!cartItem || !size) return;
        try {
            const response = await axios.get(`/inventory/check`, {
                params: {
                    color: cartItem.inventario_con_detalles.color_id,
                    size,
                    product_id: cartItem.product.id,
                },
            });
            setStockAvailable(response.data.stock > 0);
            setStockQuantity(response.data.stock);
        } catch (error) {
            console.error("Error al consultar la disponibilidad", error);
        }
    };

    const handleSizeChange = (sizeId: number) => {
        setSelectedSize(sizeId);
        checkAvailability(sizeId);
        setError(null);
    };

    const handleSubmit = async () => {
        if (!cartItem || !selectedSize) return;
        if (quantity > stockQuantity)
            setError(
                `Cantidad ${quantity} no disponible en stock, maximo ${stockQuantity}`
            );
        try {
            await router.post(route("cart.update", cartItem.id), {
                size_id: selectedSize,
                quantity,
            });
        } catch (error) {
            console.error("Error de red al actualizar el carrito:", error);
        }
    };

    const cancelAll = () => {
        setError(null);
        setQuantity(1);
        setSelectedSize(null);
        setStockAvailable(true);
        setStockQuantity(0);
        closeModal();
    }

    return (
        <Modal show={showModal} onClose={closeModal} maxWidth="md">
            <form onSubmit={handleSubmit} className="p-5">
                <h1 className="text-xl font-bold mb-4">Cambiar Tamaño</h1>
                {error && <p className="text-red-600">{error}</p>}
                {/* Selección de Talla */}
                <div className="mb-4">
                    <div className="flex gap-2 mt-2">
                        {sizes.length === 0 ? (
                            <p>Cargando...</p>
                        ) : (
                            sizes.map((size) => (
                                <button
                                    key={size.id}
                                    className={`px-2 py-1 border rounded-md 
                                        ${
                                            selectedSize === size.id
                                                ? "bg-black text-white"
                                                : "bg-gray-200"
                                        }`}
                                    onClick={() => handleSizeChange(size.id)}
                                    type="button"
                                >
                                    {size.name}
                                </button>
                            ))
                        )}
                    </div>

                    {/* Input de Cantidad */}
                    <InputLabel
                        htmlFor="quantity"
                        value="Cantidad:"
                        className="mt-2"
                        required
                    />
                    <TextInput
                        id="quantity"
                        type="number"
                        min="1"
                        max={stockQuantity}
                        className={`w-full rounded-md px-2 py-1 mt-2 ${
                            !stockAvailable || stockQuantity == 0 && "opacity-25"
                        }`}
                        value={quantity}
                        onChange={(e) =>
                            setQuantity(Number(e.target.value) || 1)
                        }
                        disabled={!stockAvailable || stockQuantity == 0}
                    />
                </div>

                {/* Disponibilidad */}
                <p
                    className={`text-sm ${
                        stockAvailable ? "text-green-500" : "text-red-500"
                    }`}
                >
                    {stockAvailable
                        ? `Stock disponible: ${stockQuantity}`
                        : "No disponible"}
                </p>

                {/* Botón de Confirmar */}
                <div className="flex justify-end gap-4">
                    <SecondaryButton type="button" onClick={cancelAll}>Cancelar</SecondaryButton>
                    <PrimaryButton
                        type="submit"
                        className=""
                        disabled={!stockAvailable}
                    >
                        Confirmar
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
};

export default CartEditModal;
