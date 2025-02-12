import React from "react";
import Img1 from "@/assets/img/categories/category-1.jpg";
import { CategoryInterface } from "@/Interfaces/Category";
import { Link } from "@inertiajs/react";

type Props = {
    categories: CategoryInterface[];
};

const Categories: React.FC<Props> = ({ categories }) => {
    return (
        <section className="overflow-hidden">
            <div className="flex flex-wrap mt-24">
                {/* Categoría grande */}
                <div className="w-full lg:w-1/2 p-0">
                    <div
                        className="h-[638px] flex items-center pl-[70px] mb-2 bg-cover bg-center"
                        style={{ backgroundImage: `url(${Img1})` }}
                    >
                        <div className="max-w-[480px]">
                            <h1 className="font-cookie text-[#111111] mb-[5px]">
                                Women’s fashion
                            </h1>
                            <p className="mb-[15px]">
                                Sit amet, consectetur adipiscing elit, sed do
                                eiusmod tempor incididunt ut labore et dolore
                                magna aliqua.
                            </p>
                            <a
                                href="#"
                                className="text-[14px] text-[#111111] uppercase font-semibold relative pb-[3px] inline-block after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-accent after:content-['']"
                            >
                                Shop now
                            </a>
                        </div>
                    </div>
                </div>

                {/* Categorías pequeñas */}
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-wrap">
                        {categories.map((category, index) => (
                            <div key={index} className="w-full md:w-1/2 p-0">
                                <div
                                    className="h-[314px] flex items-center pl-8 mb-2 md:ml-2 bg-cover bg-center"
                                    style={{
                                        backgroundImage: `url('${category.photo}')`,
                                    }}
                                >
                                    <div>
                                        <h4 className="text-[#111111] font-bold">
                                            {category.title}
                                        </h4>
                                        <p>{category.products_count} productos</p>
                                        <Link
                                            href={route('product.cat', category.slug)}
                                            className="text-[14px] text-[#111111] uppercase font-semibold relative pb-[3px] inline-block after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-accent after:content-['']"
                                        >
                                            Shop now
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Categories;
