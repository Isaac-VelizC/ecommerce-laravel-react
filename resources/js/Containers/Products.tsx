import React from "react";
import ProductCard from "@/Components/Client/ProductCard";
import { ProductInterface } from "@/Interfaces/Product";

type Props = {
    products: ProductInterface[];
};

const Products: React.FC<Props> = ({ products }) => {
    return (
        <section className="product pt-[60px] pb-[50px]">
            <div className="mx-4 sm:mx-10 xl:mx-44">
                <div className="flex flex-wrap mb-[50px]">
                    <div className="w-full lg:w-1/4 md:w-1/3 p-0">
                        <div className="section-title mb-[20px]">
                            <h4 className="text-[20px]">New Product</h4>
                        </div>
                    </div>
                    <div className="w-full lg:w-3/4 md:w-2/3 p-0 md:text-right">
                        <ul className="inline-flex">
                            <li className="active cursor-pointer  text-[10px] lg:text-lg text-[#111111] mr-3 md:mr-[35px] relative after:absolute after:left-0 after:bottom-[-4px] after:h-[2px] after:w-full after:bg-[#ca1515]">
                                All
                            </li>
                            <li className="cursor-pointer text-[10px] lg:text-lg text-[#111111] mr-3 md:mr-[35px] relative">
                                Women’s
                            </li>
                            <li className="cursor-pointer  text-[10px] lg:text-lg text-[#111111] mr-3 md:mr-[35px] relative">
                                Men’s
                            </li>
                            <li className="cursor-pointer  text-[10px] lg:text-lg text-[#111111] mr-3 md:mr-[35px] relative">
                                Kid’s
                            </li>
                            <li className="cursor-pointer  text-[10px] lg:text-lg text-[#111111] mr-3 md:mr-[35px] relative">
                                Accessories
                            </li>
                            <li className="cursor-pointer  text-[10px] lg:text-lg text-[#111111] relative">
                                Cosmetics
                            </li>
                        </ul>
                    </div>
                </div>
                {/* Product Items */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {products.map((product, index) => (
                        <ProductCard
                            key={index}
                            product={product}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Products;
