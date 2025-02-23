import React from "react";
import { IconCart } from "./IconSvgClient";
import IconButton from "../Dashboard/Buttons/IconButton";
import { Link } from "@inertiajs/react";
import { ProductInterface } from "@/Interfaces/Product";
import axios from "axios";
import { useCart } from "@/Context/CartContext";
import { IconTrash } from "../IconSvg";

type Props = {
    product: ProductInterface;
    deleteFavorite: () => void;
};

const CardFavorite: React.FC<Props> = ({ product, deleteFavorite }) => {
    const { setCart } = useCart();
    const originalPrice = product.price;
    const discountAmount = (originalPrice * product.discount) / 100;
    const finalPrice = originalPrice - discountAmount;
    const handleAddCart = async () => {
        try {
            const response = await axios.get(
                route("add-to-cart", product.slug)
            );
            if (response.status === 200) {
                setCart(response.data.cartItems);
            } else {
                console.error(
                    "Error al añadir el producto al carrito:",
                    response.status
                );
            }
        } catch (error: any) {
            console.error(
                "Error de red al añadir el producto al carrito:",
                error
            );
        }
    };

    return (
        <div className="flex justify-between h-36 p-3 shadow-lg rounded-xl transition-transform transform hover:scale-105 hover:shadow-2xl bg-white">
            {/* Link al detalle del producto */}
            <Link
                className="flex"
                href={route("page.product.detail", product.slug)}
            >
                {/* Imagen del producto */}
                <img
                    className="relative object-cover rounded-l-xl"
                    src={product.photo}
                    width={100}
                    height={96}
                />

                {/* Contenido del producto */}
                <div className="flex flex-col justify-center p-2 md:p-4 flex-grow">
                    <h6 className="text-sm md:text-lg font-semibold text-gray-800 hover:text-gray-600 transition-colors">
                        {product.title}
                    </h6>

                    {/* Precio y descuento */}
                    <div className="mt-2 flex items-center">
                        <span className={`font-semibold text-sm md:text-lg text-[#ca1515]`}>
                            {finalPrice.toFixed(2)} €
                        </span>
                        {product.discount > 0 && (
                            <span className="text-gray-400 line-through ml-2 text-sm">
                                {originalPrice.toFixed(2)} €
                            </span>
                        )}
                    </div>

                    {/* Resumen del producto */}
                    <div className="mt-1 text-xs text-gray-600 line-clamp-2">
                        <span
                            dangerouslySetInnerHTML={{
                                __html: product.summary,
                            }}
                        />
                    </div>
                </div>
            </Link>

            {/* Botones de acción */}
            <div className="flex flex-col justify-between items-center gap-3 p-2">
                {/* Eliminar de favoritos */}
                <IconButton
                    event={deleteFavorite}
                    color="hover:bg-gray-200 transition-all"
                    icon={<IconTrash size={22} color="#4b5563" />}
                />

                {/* Agregar al carrito */}
                <IconButton
                    event={() => handleAddCart()}
                    color="hover:bg-gray-200 transition-all"
                    icon={<IconCart size={26} color="#4b5563" />}
                />
            </div>
        </div>
    );
};

export default CardFavorite;
