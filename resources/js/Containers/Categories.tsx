import React from "react";
import { CategoryInterface } from "@/Interfaces/Category";
import { Link } from "@inertiajs/react";

type Props = {
    categories: CategoryInterface[];
};

const Categories: React.FC<Props> = ({ categories }) => {
    // Ordenar por productos y tomar las primeras 5
    const sortedCategories = [...categories]
        .sort((a, b) => b.products_count - a.products_count)
        .slice(0, 5);

    // La primera categoría será la grande
    const mainCategory = sortedCategories[0];

    // Las siguientes cuatro categorías serán las pequeñas
    const smallCategories = sortedCategories.slice(1);

    return (
        <section className="overflow-hidden">
            <div className="flex flex-wrap mt-24">
                {/* Categoría grande */}
                {mainCategory && (
                    <div className="w-full lg:w-1/2 p-0">
                        <div
                            className="h-[638px] flex items-center pl-[70px] mb-2 bg-cover bg-center"
                            style={{
                                backgroundImage: `url(${mainCategory.photo})`,
                            }}
                        >
                            <div className="max-w-[480px]">
                                <h1 className="font-cookie text-[#111111] mb-[5px]">
                                    {mainCategory.title}
                                </h1>
                                {/*<p className="mb-[15px]">
                  {mainCategory.summary || "Descubre nuestra selección exclusiva"}
                </p>*/}
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: mainCategory.summary,
                                    }}
                                />
                                <Link
                                    href={route(
                                        "product.cat",
                                        mainCategory.slug
                                    )}
                                    className="text-[14px] text-[#111111] uppercase font-semibold relative pb-[3px] inline-block after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-accent after:content-['']"
                                >
                                    Shop now
                                </Link>
                            </div>
                        </div>
                    </div>
                )}

                {/* Categorías pequeñas */}
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-wrap">
                        {smallCategories.map((category, index) => (
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
                                        <p>
                                            {category.products_count} productos
                                        </p>
                                        <Link
                                            href={route(
                                                "product.cat",
                                                category.slug
                                            )}
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
