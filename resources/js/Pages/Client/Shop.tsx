import Breadcrumb from "@/Components/Client/Breadcrumb";
import ProductCard from "@/Components/Client/ProductCard";
import Instagram from "@/Containers/Instagram";
import { CategoryInterface } from "@/Interfaces/Category";
import { PaginatedResponse, ProductInterface } from "@/Interfaces/Product";
import Client from "@/Layouts/ClientLayout";
import { Head, Link, router } from "@inertiajs/react";
import React, { useState } from "react";

type Props = {
    products: PaginatedResponse<ProductInterface>;
    recent_products: ProductInterface[];
    categorias: CategoryInterface[];
};

export default function Shop({ products, categorias }: Props) {
    const [productsList, setProductsList] = useState<ProductInterface[]>(
        products.data
    );
    const [currentPage, setCurrentPage] = useState<number>(
        products.current_page
    );

    const [totalPages, setTotalPages] = useState<number>(products.last_page);

    const breadcrumbLinks = [
        { href: "/", label: "Home" },
        { href: "#", label: "Shop" },
    ];

    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const toggleAccordion = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <Client>
            <Head title="Shop" />
            <Breadcrumb links={breadcrumbLinks} />
            <section className=" pt-18 pb-20 spad">
                <div className="mx-4 sm:mx-10 xl:mx-44">
                    <div className="flex flex-wrap">
                        <div className="w-full md:w-1/4 md:pr-6">
                            <div className="shop__sidebar">
                                <div className="mb-12">
                                    <div className="section-title">
                                        <h4 className="text-lg">Categories</h4>
                                    </div>
                                    {categorias.map((item, index) => (
                                        <div key={index} className="border-b border-gray-200">
                                            {/* Título del acordeón */}
                                            <button onClick={() => toggleAccordion(index)}
                                                className="flex justify-between items-center w-full border-none rounded-none py-2 border-b-[1px] border-b-solid border-b-[#f2f2f2]"
                                            >
                                                <span className="text-sm font-medium text-[#111111] block">
                                                    {item.title}
                                                </span>
                                                <svg
                                                    className={`w-3 h-3 text-[#b4b3b3] transform transition-transform duration-300 ${
                                                        activeIndex === index
                                                            ? "rotate-180"
                                                            : "rotate-0"
                                                    }`}
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M19 9l-7 7-7-7"
                                                    />
                                                </svg>
                                            </button>

                                            {/* Contenido del acordeón */}
                                            <div
                                                className={`overflow-hidden pl-0 mb-2 transition-[max-height] duration-300 ease-in-out ${
                                                    activeIndex === index
                                                        ? "max-h-screen"
                                                        : "max-h-0"
                                                }`}
                                            >
                                                <ul className="text-[#818181] font-base py-1">
                                                    {item.children.map((child, index) => (
                                                        <li key={index} className="relative pl-4 text-sm ">
                                                            <a href="#">
                                                                - {child.title}
                                                            </a>
                                                        </li>
                                                    )
                                                    )}
                                                </ul>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="sidebar__filter relative mb-15">
                                    <div className="section-title mb-9">
                                        <h4 className="text-lg">
                                            Shop by price
                                        </h4>
                                    </div>
                                    <div className="filter-range-wrap">
                                        <div
                                            className="price-range rounded-none mb-7 border-none bg-[#000000] h-1 ui-slider ui-corner-all ui-slider-horizontal ui-widget ui-widget-content"
                                            data-min="33"
                                            data-max="99"
                                        ></div>
                                        <div className="range-slider">
                                            <div className="price-input relative">
                                                <p className="text-base font-medium inline-block mb-0">
                                                    Price:
                                                </p>
                                                <input
                                                    type="text"
                                                    id="minamount"
                                                    className="text-base max-w-[16%] border-none"
                                                />
                                                <input
                                                    type="text"
                                                    id="maxamount"
                                                    className="text-base max-w-[16%] border-none"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <a
                                        href="#"
                                        className="text-sm text-[#0d0d0d] uppercase px-3 py-1 tracking-[2px] font-bold inline-block border-2 border-rose-600 border-solid absolute right-0 -bottom-1 rounded-sm"
                                    >
                                        Filter
                                    </a>
                                </div>
                                <div className="sidebar__sizes">
                                    <div className="section-title mb-9">
                                        <h4 className="text-lg">
                                            Shop by size
                                        </h4>
                                    </div>
                                    <div className="size__list">
                                        <label
                                            className="block pl-5 text-sm uppercase text-[#444444] relative cursor-pointer"
                                            htmlFor="xxs"
                                        >
                                            xxs
                                            <input type="checkbox" id="xxs" />
                                            <span className="checkmark border-red-600 after:opacity-100"></span>
                                        </label>
                                        <label
                                            className="block pl-5 text-sm uppercase text-[#444444] relative cursor-pointer"
                                            htmlFor="xs"
                                        >
                                            xs
                                            <input type="checkbox" id="xs" />
                                            <span className="checkmark border-red-600 after:opacity-100"></span>
                                        </label>
                                        <label
                                            className="block pl-5 text-sm uppercase text-[#444444] relative cursor-pointer"
                                            htmlFor="xss"
                                        >
                                            xs-s
                                            <input type="checkbox" id="xss" />
                                            <span className="checkmark border-red-600 after:opacity-100"></span>
                                        </label>
                                        <label
                                            className="block pl-5 text-sm uppercase text-[#444444] relative cursor-pointer"
                                            htmlFor="s"
                                        >
                                            s
                                            <input type="checkbox" id="s" />
                                            <span className="checkmark border-red-600 after:opacity-100"></span>
                                        </label>
                                        <label
                                            className="block pl-5 text-sm uppercase text-[#444444] relative cursor-pointer"
                                            htmlFor="m"
                                        >
                                            m
                                            <input type="checkbox" id="m" />
                                            <span className="checkmark border-red-600 after:opacity-100"></span>
                                        </label>
                                        <label
                                            className="block pl-5 text-sm uppercase text-[#444444] relative cursor-pointer"
                                            htmlFor="ml"
                                        >
                                            m-l
                                            <input type="checkbox" id="ml" />
                                            <span className="checkmark border-red-600 after:opacity-100"></span>
                                        </label>
                                        <label
                                            className="block pl-5 text-sm uppercase text-[#444444] relative cursor-pointer"
                                            htmlFor="l"
                                        >
                                            l
                                            <input type="checkbox" id="l" />
                                            <span className="checkmark border-red-600 after:opacity-100"></span>
                                        </label>
                                        <label
                                            className="block pl-5 text-sm uppercase text-[#444444] relative cursor-pointer"
                                            htmlFor="xl"
                                        >
                                            xl
                                            <input type="checkbox" id="xl" />
                                            <span className="checkmark border-red-600 after:opacity-100"></span>
                                        </label>
                                    </div>
                                </div>
                                <div className="sidebar__color">
                                    <div className="section-title mb-9">
                                        <h4>Shop by size</h4>
                                    </div>
                                    <div className="size__list color__list">
                                        <label htmlFor="black">
                                            Blacks
                                            <input type="checkbox" id="black" />
                                            <span className="checkmark border-red-600 after:opacity-100"></span>
                                        </label>
                                        <label htmlFor="whites">
                                            Whites
                                            <input
                                                type="checkbox"
                                                id="whites"
                                            />
                                            <span className="checkmark border-red-600 after:opacity-100"></span>
                                        </label>
                                        <label htmlFor="reds">
                                            Reds
                                            <input type="checkbox" id="reds" />
                                            <span className="checkmark border-red-600 after:opacity-100"></span>
                                        </label>
                                        <label htmlFor="greys">
                                            Greys
                                            <input type="checkbox" id="greys" />
                                            <span className="checkmark border-red-600 after:opacity-100"></span>
                                        </label>
                                        <label htmlFor="blues">
                                            Blues
                                            <input type="checkbox" id="blues" />
                                            <span className="checkmark border-red-600 after:opacity-100"></span>
                                        </label>
                                        <label htmlFor="beige">
                                            Beige Tones
                                            <input type="checkbox" id="beige" />
                                            <span className="checkmark border-red-600 after:opacity-100"></span>
                                        </label>
                                        <label htmlFor="greens">
                                            Greens
                                            <input
                                                type="checkbox"
                                                id="greens"
                                            />
                                            <span className="checkmark border-red-600 after:opacity-100"></span>
                                        </label>
                                        <label htmlFor="yellows">
                                            Yellows
                                            <input
                                                type="checkbox"
                                                id="yellows"
                                            />
                                            <span className="checkmark border-red-600 after:opacity-100"></span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-full md:w-3/4 md:pl-6">
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

                            <div className="w-full text-center py-20">
                                {Array.from(
                                    { length: products.last_page },
                                    (_, index) => (
                                        <Link
                                            key={index}
                                            href={`/shop?page=${index + 1}`}
                                            className={` bg-white rounded-full px-4 py-2 border-gray-200 border-[1px] mr-2
                                                        ${
                                                            products.current_page ===
                                                            index + 1
                                                                ? "bg-rose-500"
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
