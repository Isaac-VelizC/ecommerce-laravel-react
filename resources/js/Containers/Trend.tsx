import React from "react";
import Ht1 from "@/assets/img/trend/ht-1.jpg";
import Ht2 from "@/assets/img/trend/ht-2.jpg";
import Bs1 from "@/assets/img/trend/bs-1.jpg";
import Bs2 from "@/assets/img/trend/bs-2.jpg";
import TrendCard from "@/Components/Client/TrendCard";
import { ProductInterface } from "@/Interfaces/Product";

type Props = {
    featured: ProductInterface[];
};

const Trend: React.FC<Props> = ({ featured }) => {
    return (
        <section className="trend pt-[80px] pb-[50px]">
            <div className="mx-4 sm:mx-10 xl:mx-44">
                <div className="flex flex-wrap">
                    {/* Hot Trend Column */}
                    <div className="w-full md:w-1/3 p-0">
                        <div className="trend__content">
                            <div className="section-title mb-[20px]">
                                <h4 className="text-[20px] after:-bottom-1">
                                    Hot Trend
                                </h4>
                            </div>
                            <TrendCard
                                img={Ht1}
                                title="Chain bucket bag"
                                price={59}
                                discount={10}
                            />
                            <TrendCard
                                img={Ht2}
                                title="Pendant earrings"
                                price={59}
                                discount={10}
                            />
                        </div>
                    </div>

                    {/* Best Seller Column */}
                    <div className="w-full md:w-1/3 p-0">
                        <div className="trend__content">
                            <div className="section-title mb-[20px]">
                                <h4 className="text-[20px]">Best seller</h4>
                            </div>
                            <TrendCard
                                img={Bs1}
                                title="Cotton T-Shirt"
                                price={59}
                                discount={10}
                            />
                            <TrendCard
                                img={Bs2}
                                title="Zip-pockets pebbled tote briefcase"
                                price={59}
                                discount={10}
                            />
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
