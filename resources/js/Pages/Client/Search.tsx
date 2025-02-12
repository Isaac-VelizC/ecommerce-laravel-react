import Breadcrumb from "@/Components/Client/Breadcrumb";
import ProductCard from "@/Components/Client/ProductCard";
import { ProductInterface } from "@/Interfaces/Product";
import Client from "@/Layouts/ClientLayout";
import { Head } from "@inertiajs/react";

type Props = {
    products: ProductInterface[] | [];
    query: string;
};

export default function SearchPage({ products, query }: Props) {
    const breadcrumbLinks = [
        { href: "/", label: "Home" },
        { href: "#", label: query },
    ];
    return (
        <Client>
            <Head title={query} />
            <Breadcrumb links={breadcrumbLinks} />
            <section className="product pt-[60px] pb-[50px]">
                <div className="mx-4 sm:mx-10 xl:mx-44">
                    <div className="flex flex-wrap justify-between md:mb-4 mb-10">
                        <div className="w-full p-0">
                            <div className="section-title mb-[20px]">
                                <h4 className="text-[20px]">Resultados de busqueda para {query}</h4>
                            </div>
                        </div>
                    </div>
                    {products.length > 0 ? (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {products.map((item, index) => (
                                <ProductCard key={index} product={item} />
                            ))}
                        </div>
                    ) : (
                        <div className="w-full text-center">
                            <p>No hay resultados para la busqueda de {query}.</p>
                        </div>
                    )}
                </div>
            </section>
        </Client>
    );
}
