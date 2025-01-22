import React from "react";
import Product1 from "@/assets/img/product/product-1.jpg";
import Product2 from "@/assets/img/product/product-2.jpg";
import Product3 from "@/assets/img/product/product-3.jpg";
import Product4 from "@/assets/img/product/product-4.jpg";
import Product5 from "@/assets/img/product/product-5.jpg";
import Product6 from "@/assets/img/product/product-6.jpg";
import ProductCard from "@/Components/Client/ProductCard";

type Props = {};

const Products: React.FC<Props> = () => {
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
                            <li className="active cursor-pointer  text-[10px] text-[#111111] mr-3 md:mr-[35px] relative after:absolute after:left-0 after:bottom-[-4px] after:h-[2px] after:w-full after:bg-[#ca1515]">
                                All
                            </li>
                            <li className="cursor-pointer text-[10px] text-[#111111] mr-3 md:mr-[35px] relative">
                                Women’s
                            </li>
                            <li className="cursor-pointer  text-[10px] text-[#111111] mr-3 md:mr-[35px] relative">
                                Men’s
                            </li>
                            <li className="cursor-pointer  text-[10px] text-[#111111] mr-3 md:mr-[35px] relative">
                                Kid’s
                            </li>
                            <li className="cursor-pointer  text-[10px] text-[#111111] mr-3 md:mr-[35px] relative">
                                Accessories
                            </li>
                            <li className="cursor-pointer  text-[10px] text-[#111111] relative">
                                Cosmetics
                            </li>
                        </ul>
                    </div>
                </div>
                {/* Product Items */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                    <ProductCard
                        img={Product1}
                        title="Buttons tweed blazer"
                        price="$59.0"
                        rating={5}
                    />
                    <ProductCard
                        img={Product2}
                        title="Flowy striped skirt"
                        price="$49.0"
                        rating={5}
                    />
                    <ProductCard
                        img={Product3}
                        title="Cotton T-Shirt"
                        price="$59.0"
                        rating={5}
                    />
                    <ProductCard
                        img={Product4}
                        title="Slim striped pocket shirt"
                        price="$59.0"
                        rating={5}
                    />
                    <ProductCard
                        img={Product5}
                        title="Fit micro corduroy shirt"
                        price="$59.0"
                        rating={5}
                    />
                    <ProductCard
                        img={Product6}
                        title="Tropical Kimono"
                        price="$49.0"
                        rating={5}
                        sale={true}
                    />
                </div>
            </div>
        </section>
    );
};

export default Products;
