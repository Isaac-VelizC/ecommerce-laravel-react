import Breadcrumb from "@/Components/Client/Breadcrumb";
import ProductCard from "@/Components/Client/ProductCard";
import Instagram from "@/Containers/Instagram";
import Client from "@/Layouts/ClientLayout";
import { Head } from "@inertiajs/react";
import React, { useEffect, useState } from "react";

type Props = {};

export default function ListFavorite({}: Props) {
    const [favorites, setFavorites] = useState<any[]>([]);

    const breadcrumbLinks = [
        { href: "/", label: "Home" },
        { href: "/favorites", label: "Favorite" },
    ];

    useEffect(() => {
        // Recuperar productos del Local Storage
        const storedFavorites = JSON.parse(
            localStorage.getItem("favorites") || "[]"
        );
        setFavorites(storedFavorites);
    }, []);

    return (
        <Client>
            <Head title="Favoritos" />
            <Breadcrumb links={breadcrumbLinks} />
            <section className="product pt-[60px] pb-[50px]">
                <div className="mx-4 sm:mx-10 xl:mx-44">
                    <div className="flex flex-wrap mb-[50px]">
                        <div className="w-full lg:w-1/4 md:w-1/3 p-0">
                            <div className="section-title mb-[20px]">
                                <h4 className="text-[20px]">Tus Favoritos</h4>
                            </div>
                        </div>
                    </div>
                    {favorites.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                            {favorites.map((product) => (
                                <ProductCard
                                    key={product.slug}
                                    product={product}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="w-full text-center">
                            <p>No tienes productos favoritos guardados.</p>
                        </div>
                    )}
                </div>
            </section>
            <Instagram />
        </Client>
    );
}
