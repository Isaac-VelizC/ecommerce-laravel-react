import React, { useState } from "react";
import { IconCart, IconExpanded, IconHeart } from "./IconSvgClient";
import IconButton from "../Dashboard/Buttons/IconButton";
import { Link, usePage } from "@inertiajs/react";
import { ProductInterface } from "@/Interfaces/Product";
import PreviewImage from "../PreviewImage";

type Props = {
    product: ProductInterface;
    rating?: number;
};

const ProductCard: React.FC<Props> = ({ product, rating = 5 }) => {
    const { user } = usePage().props.auth;
    const originalPrice = product.price;
    const discountAmount = (originalPrice * product.discount) / 100;
    const finalPrice = originalPrice - discountAmount;

    const [isOpen, setIsOpen] = useState(false);
    const [imageUrl, setImageUrl] = useState("");

    const openModal = (url: string) => {
        setImageUrl(url);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
    };

    const saveFavoriteProduct = () => {
        if (!user) {
            // Guardar en Local Storage
            const favorites = JSON.parse(
                localStorage.getItem("favorites") || "[]"
            );

            // Comprobar si ya existe en favoritos
            if (
                !favorites.find(
                    (item: ProductInterface) => item.slug === product.slug
                )
            ) {
                favorites.push(product);
                localStorage.setItem("favorites", JSON.stringify(favorites));
                alert("Producto guardado como favorito.");
            } else {
                alert("Este producto ya está en tus favoritos.");
            }
        } else {
            //
            console.log("Enviar al backend");
        }
    };

    return (
        <>
            <div className="p-0 mb-5 shadow-lg rounded-xl transition-transform transform hover:scale-105">
                <div className="mb-4">
                    <div
                        className="relative h-90 overflow-hidden bg-cover bg-center rounded-t-xl"
                        style={{ backgroundImage: `url(${product.photo})` }}
                    >
                        {product.discount > 0 && (
                            <div className="bg-[#ca1515] text-white rounded-md text-xs font-semibold absolute left-3 top-3 px-2 py-1 uppercase shadow-md">
                                Descuento {product.discount}%
                            </div>
                        )}
                        {/* Efecto Hover */}
                        <div className="absolute w-full h-full opacity-0 transition-opacity duration-400 hover:opacity-100 bg-black/40 flex items-center justify-center">
                            <ul className="flex space-x-4">
                                <li>
                                    <IconButton
                                        event={() => openModal(product.photo)}
                                        color="bg-white"
                                        icon={
                                            <IconExpanded
                                                size={26}
                                                color="black"
                                            />
                                        }
                                    />
                                </li>
                                <li>
                                    <IconButton
                                        event={() => saveFavoriteProduct()}
                                        color="bg-white"
                                        icon={
                                            <IconHeart
                                                size={26}
                                                color="black"
                                            />
                                        }
                                    />
                                </li>
                                <li>
                                    <IconButton
                                        event={() => {}}
                                        color="bg-white"
                                        icon={
                                            <IconCart size={26} color="black" />
                                        }
                                    />
                                </li>
                            </ul>
                        </div>
                    </div>
                    {/* Contenido del producto */}
                    <div className="px-4 py-3 bg-white rounded-b-xl">
                        <div className="flex justify-end">
                            <div
                                className={`font-semibold ${
                                    product.discount != 0
                                        ? "text-[#ca1515]"
                                        : "text-black"
                                }`}
                            >
                                {finalPrice.toFixed(2)} €
                                {product.discount > 0 && (
                                    <span className="text-gray-400 line-through ml-2 text-xs">
                                        {originalPrice.toFixed(2)} €
                                    </span>
                                )}
                            </div>
                        </div>
                        <h6 className="font-semibold text-base">
                            <Link
                                href={route(
                                    "page.product.detail",
                                    product.slug
                                )}
                                className="hover:text-gray-700 transition-colors"
                            >
                                {product.title}
                            </Link>
                        </h6>
                        {/* Estrellas de calificación */}
                        <div className="flex mt-2">
                            {[...Array(5)].map((_, i) => (
                                <i
                                    key={i}
                                    className={`fa fa-star text-[10px] ${
                                        i < rating
                                            ? "text-[#e3c01c]"
                                            : "text-gray-300"
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <PreviewImage
                imageUrl={imageUrl}
                isOpen={isOpen}
                onClose={closeModal}
            />
        </>
    );
};

export default ProductCard;
