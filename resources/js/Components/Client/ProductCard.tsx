import React, { useEffect, useState } from "react";
import { Link } from "@inertiajs/react";
import { ProductInterface } from "@/Interfaces/Product";
import { saveFavoriteProduct } from "@/Utils/api/consultas";
import LikeButton from "../Animated/ButtonLike";

type Props = {
    product: ProductInterface;
};

const ProductCard: React.FC<Props> = ({ product }) => {
    //const { setCart } = useCart();
    const [isInWishlist, setIsInWishlist] = useState(product.is_in_wishlist);
    const originalPrice = product.price;
    const discountAmount = (originalPrice * product.discount) / 100;
    const finalPrice = originalPrice - discountAmount;
    /*const handleAddCart = async () => {
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
    };*/

    useEffect(() => {
        setIsInWishlist(product.is_in_wishlist);
    }, [product.is_in_wishlist]);

    const handleLikeClick = () => {
        saveFavoriteProduct({
            slug: product.slug,
            onSuccess: () => {
                setIsInWishlist(!isInWishlist);
                // Notificar al componente padre si la función está definida
                //onWishlistChange?.(product_detail.id, !isInWishlist);
            },
            onError: (error) => {
                console.error("Error al actualizar la lista de deseos:", error);
                // Manejar el error (mostrar un mensaje al usuario, etc.)
                alert(
                    "No se pudo agregar/quitar de favoritos. Inténtalo de nuevo."
                );
            },
        });
    };

    return (
            <div className="mb-4">
                <Link href={route("page.product.detail", product.slug)}>
                    <div
                        className="relative h-90 overflow-hidden bg-cover bg-center"
                        style={{ backgroundImage: `url(${product.photo})` }}
                    >
                        {product.discount > 0 && (
                            <div className="bg-[#ca1515] text-white text-xs font-semibold absolute left-0 top-0 px-1 py-1 uppercase">
                                Descuento {product.discount}%
                            </div>
                        )}
                    </div>
                    {/* Contenido del producto */}
                </Link>
                <div className="px-4 py-3">
                    <div className="flex justify-between mb-4">
                        <div className={`font-semibold text-[#ca1515]`}>
                            {finalPrice.toFixed(2)} €
                            {product.discount > 0 && (
                                <span className="text-gray-400 line-through ml-2 text-xs">
                                    {originalPrice.toFixed(2)} €
                                </span>
                            )}
                        </div>
                        <LikeButton
                            isLiked={isInWishlist}
                            onClick={() => handleLikeClick()}
                        />
                    </div>
                    <h6 className="text-base font-semibold hover:text-gray-700 transition-colors">
                        {product.title}
                    </h6>
                </div>
            </div>
    );
};

export default ProductCard;
