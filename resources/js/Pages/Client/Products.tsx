import Breadcrumb from "@/Components/Client/Breadcrumb";
import ProductCard from "@/Components/Client/ProductCard";
import Instagram from "@/Containers/Instagram";
import { PaginatedResponse, ProductInterface } from "@/Interfaces/Product";
import Client from "@/Layouts/ClientLayout";
import { Head } from "@inertiajs/react";
import { useState } from "react";

type Props = {
    products: PaginatedResponse<ProductInterface>;
};

export default function Products({ products }: Props) {
    const [ listProducts ] = useState<ProductInterface[]>(products.data);
    const breadcrumbLinks = [
        { href: "/", label: "Home" },
        { href: "#", label: "Productos" },
    ];

    return (
        <Client>
            <Head title="Productos" />
            <Breadcrumb links={breadcrumbLinks} />
            <section className="pt-20 pb-20 contact">
                <div className="mx-4 sm:mx-10 xl:mx-44">
                    <div className="w-full md:pl-6">
                        {listProducts.length === 0 ? (
                            <div className="font-bold text-lg text-center w-full relative">
                                <p>No hay productos disponibles.</p>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {listProducts.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                    />
                                ))}
                            </div>
                        )}

                        <div className="w-full text-center py-10">
                            {listProducts.length > 0 && Array.from(
                                { length: products.last_page },
                                (_, index) => (
                                    <a
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
                                    </a>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </section>
            <Instagram />
        </Client>
    );
}
