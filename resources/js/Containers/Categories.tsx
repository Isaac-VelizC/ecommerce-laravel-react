import React from "react";
import Img1 from "@/assets/img/categories/category-1.jpg";
import Img2 from "@/assets/img/categories/category-2.jpg";
import Img3 from "@/assets/img/categories/category-3.jpg";
import Img4 from "@/assets/img/categories/category-4.jpg";
import Img5 from "@/assets/img/categories/category-5.jpg";

type Props = {};

const Categories: React.FC<Props> = () => {
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
                                className="text-[14px] text-[#111111] uppercase font-semibold relative pb-[3px] inline-block after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-[#ca1515] after:content-['']"
                            >
                                Shop now
                            </a>
                        </div>
                    </div>
                </div>

                {/* Categorías pequeñas */}
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-wrap">
                        {[
                            {
                                title: "Men’s fashion",
                                items: "358 items",
                                img: Img2,
                            },
                            {
                                title: "Kid’s fashion",
                                items: "273 items",
                                img: Img3,
                            },
                            {
                                title: "Cosmetics",
                                items: "159 items",
                                img: Img4,
                            },
                            {
                                title: "Accessories",
                                items: "792 items",
                                img: Img5,
                            },
                        ].map((category, index) => (
                            <div key={index} className="w-full md:w-1/2 p-0">
                                <div
                                    className="h-[314px] flex items-center pl-8 mb-2 md:ml-2 bg-cover bg-center"
                                    style={{
                                        backgroundImage: `url('${category.img}')`,
                                    }}
                                >
                                    <div>
                                        <h4 className="text-[#111111] font-bold">
                                            {category.title}
                                        </h4>
                                        <p>{category.items}</p>
                                        <a
                                            href="#"
                                            className="text-[14px] text-[#111111] uppercase font-semibold relative pb-[3px] inline-block after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-[#ca1515] after:content-['']"
                                        >
                                            Shop now
                                        </a>
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
