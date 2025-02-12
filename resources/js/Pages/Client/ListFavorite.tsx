import Breadcrumb from "@/Components/Client/Breadcrumb";
import CardFavorite from "@/Components/Client/CardFavorite";
import ProductCard from "@/Components/Client/ProductCard";
import Loading from "@/Components/Loading";
import Instagram from "@/Containers/Instagram";
import { WishlistInterface } from "@/Interfaces/WishList";
import Client from "@/Layouts/ClientLayout";
import handleDeleteFavorite from "@/Utils/api/favorites";
import { Head, Link, usePage } from "@inertiajs/react";
import axios from "axios";
import React, { useEffect, useState } from "react";

type Props = {};

export default function ListFavorite({}: Props) {
    const [favorites, setFavorites] = useState<WishlistInterface[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = usePage().props.auth;

    const breadcrumbLinks = [
        { href: "/", label: "Home" },
        { href: "/favorites", label: "Favorite" },
    ];

    useEffect(() => {
        if (!user) {
            const favorites = JSON.parse(
                localStorage.getItem("favorites") || "[]"
            );
            setFavorites(favorites);
        } else {
            // Si el usuario está autenticado, obtener los favoritos desde el backend
            const fetchFavorites = async () => {
                try {
                    setLoading(true);
                    const response = await axios.get(route("get-favorites"));
                    if (response.status === 200) {
                        setFavorites(response.data.favorites);
                    }
                } catch (error) {
                    console.error("Error al obtener favoritos:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchFavorites();
        }
    }, [user]);

    const handleEliminarClick = (id: number) => {
        handleDeleteFavorite({
            id: id,
            onSuccess: (message) => {
                setFavorites((prevFavorites) =>
                    prevFavorites.filter((item) => item.id !== id)
                );
                console.log("Éxito:", message);
                // Mostrar una notificación al usuario
            },
            onError: (message) => {
                console.error("Error:", message);
                // Mostrar un mensaje de error al usuario
            },
        });
    };

    return (
        <Client>
            <Head title="Favoritos" />
            <Breadcrumb links={breadcrumbLinks} />
            <section className="product pt-[60px] pb-[50px]">
                <div className="mx-4 sm:mx-10 xl:mx-44">
                    <div className="flex flex-wrap justify-between md:mb-4 mb-10">
                        <div className="w-full lg:w-1/4 md:w-1/3 p-0">
                            <div className="section-title mb-[20px]">
                                <h4 className="text-[20px]">Tus Favoritos</h4>
                            </div>
                        </div>
                        <div className="text-accent font-semibold text-xs">
                            {favorites.length > 0 && (
                                    <Link
                                        className="border hover:bg-accent hover:text-white rounded-md px-4 py-2 ml-1 transition-colors duration-300 ease-in-out"
                                        href={route("delete.all.favorites")}
                                    >
                                        Eliminar todo
                                    </Link>
                            )}
                        </div>
                    </div>
                    {loading ? (
                        <Loading />
                    ) : favorites.length > 0 ? (
                        <div className="grid lg:grid-cols-2 gap-8">
                            {favorites.map((item, index) => (
                                <CardFavorite
                                    key={index}
                                    product={item.product}
                                    deleteFavorite={() =>
                                        handleEliminarClick(item.id)
                                    }
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
