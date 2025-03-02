import Procesando from "@/Common/Procesando";
import Breadcrumb from "@/Components/Client/Breadcrumb";
import ColorFilter from "@/Components/Client/Filters/ColorFilter";
import PriceRangeSlider from "@/Components/Client/Filters/PriceRangeSlider";
import SizeFilter from "@/Components/Client/Filters/SizeFilter";
import ProductCard from "@/Components/Client/ProductCard";
import RecentCard from "@/Components/Client/RecentCard";
import Instagram from "@/Containers/Instagram";
import { BrandInterface } from "@/Interfaces/Brand";
import {
    ColorsInterface,
    PaginatedResponse,
    ProductInterface,
    SizesInterface,
} from "@/Interfaces/Product";
import Client from "@/Layouts/ClientLayout";
import { Head, Link } from "@inertiajs/react";
import axios from "axios";
import { debounce } from "lodash";
import { useCallback, useEffect, useState } from "react";

type Props = {
    products: PaginatedResponse<ProductInterface>;
    recent_products: ProductInterface[];
    brands: BrandInterface[];
    colors: ColorsInterface[];
    sizes: SizesInterface[];
    slug: string;
};

export default function Shop({
    products,
    slug,
    brands,
    recent_products,
    sizes,
    colors,
}: Props) {
    const [productsList, setProductsList] = useState<ProductInterface[]>(
        products.data
    );
    const [selectedSizes, setSelectedSizes] = useState<number[]>([]);
    const [selectedColors, setSelectedColors] = useState<number[]>([]);
    const [selectedBrands, setSelectedBrands] = useState<number | null>(null);
    const [priceRange, setPriceRange] = useState({ min: 10, max: 500 });
    const [loading, setLoading] = useState(false);

    const breadcrumbLinks = [
        { href: "/", label: "Home" },
        { href: "#", label: "Categorias" },
        { href: "#", label: slug },
    ];

    const fetchFilteredProducts = async () => {
        try {
            setLoading(true);
            if (
                selectedSizes ||
                selectedColors ||
                selectedBrands ||
                priceRange
            ) {
                const response = await axios.get("/products/filter", {
                    params: {
                        min_price: priceRange.min,
                        max_price: priceRange.max,
                        sizes: selectedSizes.join(","),
                        colors: selectedColors.join(","),
                        brand_id: selectedBrands
                            ? selectedBrands.toString()
                            : "",
                    },
                });
                setProductsList(response.data.data);
                setLoading(false);
            }
        } catch (error) {
            console.error("Error al obtener productos filtrados:", error);
        }
    };

    // Usa useCallback y debounce para evitar crear una nueva función en cada render
    const debouncedFetch = useCallback(debounce(fetchFilteredProducts, 300), [
        selectedSizes,
        selectedColors,
        selectedBrands,
        priceRange,
    ]);

    useEffect(() => {
        debouncedFetch();
    }, [debouncedFetch]);

    const handleSizeChange = (size: number) => {
        setSelectedSizes(
            (prevSizes) =>
                prevSizes.includes(size)
                    ? prevSizes.filter((s) => s !== size) // Quitar si ya está seleccionado
                    : [...prevSizes, size] // Agregar si no está seleccionado
        );
    };

    const handleColorChange = (color: number) => {
        setSelectedColors((prevColors) =>
            prevColors.includes(color)
                ? prevColors.filter((c) => c !== color)
                : [...prevColors, color]
        );
    };

    const handlePriceChange = (values: { min: number; max: number }) => {
        setPriceRange(values);
    };

    return (
        <Client>
            <Head title="Shop" />
            <Breadcrumb links={breadcrumbLinks} />
            <section className=" pt-18 pb-20 spad">
                <div className="mx-4 sm:mx-10 xl:mx-44">
                    <div className="flex flex-wrap">
                        <div className="w-full md:w-1/4 md:pr-6">
                            <div className="shop__sidebar bg-white p-6 rounded-md shadow-md">
                                {/* Filtro por Precio */}
                                <PriceRangeSlider
                                    onPriceChange={handlePriceChange}
                                    onPriceRange={priceRange}
                                />
                                <SizeFilter
                                    sizes={sizes}
                                    selectedSizes={selectedSizes}
                                    onSizeChange={handleSizeChange}
                                    onSelectAll={() =>
                                        setSelectedSizes(
                                            sizes.map((size) => size.id)
                                        )
                                    }
                                />

                                <ColorFilter
                                    colors={colors}
                                    selectedColors={selectedColors}
                                    onColorChange={handleColorChange}
                                    onSelectAll={() =>
                                        setSelectedColors(
                                            colors.map((color) => color.id)
                                        )
                                    }
                                />

                                {/* Productos Recientes */}
                                <div className="mb-10">
                                    <div className="section-title mb-9">
                                        <h4 className="text-lg font-bold">
                                            Recientes
                                        </h4>
                                    </div>
                                    <div>
                                        {recent_products.map((item, index) => (
                                            <RecentCard
                                                key={index}
                                                title={item.title}
                                                img={item.photo}
                                                price={item.price}
                                                discount={item.discount}
                                                slug={item.slug}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Marcas */}
                                <div className="mb-10">
                                    <div className="section-title mb-9">
                                        <h4 className="text-lg font-bold">
                                            Filtro por Marca
                                        </h4>
                                    </div>
                                    {brands.map((brand, index) => (
                                        <div
                                            key={index}
                                            className="border-b border-gray-200"
                                            onClick={() =>
                                                setSelectedBrands(brand.id)
                                            }
                                        >
                                            <button className="flex w-full py-2">
                                                <span className="text-sm font-medium text-[#111111] block">
                                                    {brand.title}
                                                </span>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="w-full md:w-3/4 md:pl-6">
                            {loading && <Procesando />}
                            {productsList.length === 0 ? (
                                <div className="font-bold text-lg text-center w-full relative">
                                    <p>No hay productos disponibles.</p>
                                </div>
                            ) : (
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {productsList.map((product) => (
                                        <ProductCard
                                            key={product.id}
                                            product={product}
                                        />
                                    ))}
                                </div>
                            )}

                            <div className="w-full text-center py-10">
                                {Array.from(
                                    { length: products.last_page },
                                    (_, index) => (
                                        <Link
                                            key={index}
                                            href={`/shop?page=${index + 1}`}
                                            className={`
                                                inline-flex
                                                items-center
                                                justify-center
                                                px-4
                                                py-2
                                                text-sm
                                                font-medium
                                                font-mono  // Added monospace font
                                                rounded-full
                                                bg-accent
                                                border
                                                border-gray-300
                                                text-gray-700
                                                hover:bg-gray-50
                                                mr-2
                                                transition-colors
                                                duration-200
                                                focus:outline-none
                                                focus:ring-2
                                                focus:ring-rose-500
                                                focus:ring-opacity-50
                                                ${
                                                    products.current_page ===
                                                    index + 1
                                                        ? "bg-rose-600 text-white hover:bg-rose-700 border-rose-600"
                                                        : ""
                                                }
                                            `}
                                        >
                                            {index + 1}
                                        </Link>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Instagram />
        </Client>
    );
}
