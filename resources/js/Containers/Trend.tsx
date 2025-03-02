import React from "react";
import TrendCard from "@/Components/Client/TrendCard";
import { ProductInterface } from "@/Interfaces/Product";

type Props = {
    featured: ProductInterface[];
    topProducts: ProductInterface[];
};

const Trend: React.FC<Props> = ({ featured, topProducts }) => {
    console.log(topProducts);
    
    return (
        <section className="trend pt-[80px] pb-[50px]">
            <div className="mx-4 sm:mx-10 xl:mx-44">
                <div className="flex flex-wrap">
                    {/* Hot Trend Column */}
                    <div className="w-full md:w-1/3 p-0">
                        <div className="trend__content">
                            <div className="section-title mb-[20px]">
                                <h4 className="text-[20px] after:-bottom-1">
                                    Mas Vendidos
                                </h4>
                            </div>
                            {topProducts.map((item, index) => (
                                <TrendCard
                                    key={index}
                                    img={item.photo}
                                    title={item.title}
                                    price={item.price}
                                    discount={item.discount}
                                    slug={item.slug}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Best Seller Column */}
                    <div className="w-full md:w-1/3 p-0">
                        <div className="trend__content">
                            <div className="section-title mb-[20px]">
                                <h4 className="text-[20px]">Best seller</h4>
                            </div>
                            <div></div>
                        </div>
                    </div>

                    {/* Feature Column */}
                    <div className="w-full md:w-1/3 p-0">
                        <div className="trend__content">
                            <div className="section-title mb-[20px]">
                                <h4 className="text-[20px]">Destacados</h4>
                            </div>
                            {featured.map((item, index) => (
                                <TrendCard
                                    key={index}
                                    img={item.photo}
                                    title={item.title}
                                    price={item.price}
                                    discount={item.discount}
                                    slug={item.slug}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Trend;
