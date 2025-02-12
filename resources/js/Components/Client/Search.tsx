import React, { useState, useEffect } from "react";
import axios from "axios";
import debounce from "lodash.debounce";
import { Link, router } from "@inertiajs/react";
import { IconClose } from "./IconSvgClient";

type Props = {
    toggleSearch: () => void;
};

const Search: React.FC<Props> = ({ toggleSearch }) => {
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [loadingSearching, setLoadingSearching] = useState(false);
    const [suggestions, setSuggestions] = useState<
        { id: number; title: string; slug: string }[]
    >([]);
    const [searches, setSearches] = useState<{
        recent: string[];
        popular: string[];
    }>({ recent: [], popular: [] });

    // Cargar búsquedas populares y recientes
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Carga de búsquedas populares
                const popularResponse = await axios.get(
                    "/api/popular-searches"
                );
                setSearches((prev) => ({
                    ...prev,
                    popular: popularResponse.data,
                }));

                // Carga de búsquedas recientes desde localStorage
                const storedRecent = JSON.parse(
                    localStorage.getItem("recentSearches") || "[]"
                );
                setSearches((prev) => ({ ...prev, recent: storedRecent }));
            } catch (e) {
                console.error("Error fetching data:", e);
                //setError(e); // Guarda el error en el estado
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Función para manejar cambios en el input con debounce
    useEffect(() => {
        const fetchSuggestions = debounce(async (searchTerm: string) => {
            if (searchTerm.length > 1) {
                const { data } = await axios.get(
                    `/api/product/suggestions?query=${searchTerm}`
                );
                setSuggestions(data);
            } else {
                setSuggestions([]);
            }
        }, 300);

        fetchSuggestions(query);
        return () => fetchSuggestions.cancel();
    }, [query]);

    // Guardar búsqueda en recientes y en el backend
    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoadingSearching(true);
        if (!query.trim()) return;

        const updatedRecent = [
            query,
            ...searches.recent.filter((q) => q !== query),
        ].slice(0, 5);

        setSearches((prev) => ({ ...prev, recent: updatedRecent }));
        localStorage.setItem("recentSearches", JSON.stringify(updatedRecent));
        axios.post("/api/save-search", { query });
        handleSearchSubmitProduct();
        setQuery("");
    };

    const handleSearchSubmitProduct = async () => {
        router.get(`/api/product/search/${query}`);
    };

    const handleDeleteSearch = (indexToDelete: number) => {
        const updatedRecent = searches.recent.filter(
            (_, index) => index !== indexToDelete
        ); // Filtra el elemento a eliminar
        setSearches((prev) => ({ ...prev, recent: updatedRecent })); // Actualiza el estado
        localStorage.setItem("recentSearches", JSON.stringify(updatedRecent)); // Actualiza localStorage
    };

    return (
        <div
            className={`fixed inset-0 z-99999 overflow-auto bg-gray-500 bg-opacity-75 transition-opacity`}
        >
            <div className="relative w-full max-w-screen-xl p-4 mx-auto my-10">
                <div className="relative bg-gray-100/80 rounded-xl shadow dark:bg-gray-700">
                    {loadingSearching ? (
                        <div className="flex items-center justify-center h-[500px]">
                            Buscando...
                        </div>
                    ) : (
                        <div className="p-4 lg:p-8">
                            <div className="flex justify-center mb-4">
                                <IconClose
                                    color="black"
                                    size={28}
                                    onClick={toggleSearch}
                                />
                            </div>
                            <form
                                onSubmit={handleSearchSubmit}
                                className="relative w-full"
                            >
                                <input
                                    type="text"
                                    placeholder="Buscar productos..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    //onKeyDown={handleKeyDown}
                                    className="w-full bg-gray-300 text-sm font-medium border-none p-3 rounded-lg focus:ring-0"
                                />
                                {suggestions.length > 0 && (
                                    <ul className="absolute left-0 mt-2 w-full p-3 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                        {suggestions.map((item) => (
                                            <Link
                                                key={item.id}
                                                href={route(
                                                    "page.product.detail",
                                                    item.slug
                                                )}
                                            >
                                                <li
                                                    className="px-3 py-1 text-sm hover:bg-gray-200 rounded cursor-pointer"
                                                    onClick={() => {
                                                        setQuery(item.title);
                                                        setSuggestions([]);
                                                    }}
                                                >
                                                    {item.title}
                                                </li>
                                            </Link>
                                        ))}
                                    </ul>
                                )}
                            </form>
                            <div className="mt-6 grid lg:grid-cols-2 gap-2">
                                <div className="p-4">
                                    <h3 className="text-base font-semibold">
                                        Búsquedas recientes
                                    </h3>
                                    <ul className="mt-2">
                                        {searches.recent.map(
                                            (search, index) => (
                                                <li
                                                    key={index}
                                                    className=" flex justify-between p-1 text-sm"
                                                >
                                                    <Link
                                                        href={route(
                                                            "product.search",
                                                            search
                                                        )}
                                                        className=" cursor-pointer hover:underline"
                                                    >
                                                        {search}
                                                    </Link>
                                                    <IconClose
                                                        color="#9ca3af"
                                                        size={16}
                                                        onClick={() =>
                                                            handleDeleteSearch(
                                                                index
                                                            )
                                                        }
                                                    />
                                                </li>
                                            )
                                        )}
                                    </ul>
                                </div>
                                <div className="p-4 mt-4 md:mt-0">
                                    <h3 className="text-base font-semibold">
                                        Más buscados
                                    </h3>
                                    <ul className="mt-2">
                                        {loading ? (
                                            <div className="mt-4 text-center text-xs font-medium ">
                                                Cargando
                                            </div>
                                        ) : (
                                            searches.popular.map(
                                                (search, index) => (
                                                    <Link
                                                        key={index}
                                                        href={route(
                                                            "product.search",
                                                            search
                                                        )}
                                                    >
                                                        <li className="p-2 text-sm cursor-pointer hover:underline">
                                                            {search}
                                                        </li>
                                                    </Link>
                                                )
                                            )
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Search;
