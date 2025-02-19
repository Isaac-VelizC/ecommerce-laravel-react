import React from "react";
import { ProductInterface } from "@/Interfaces/Product";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { Link } from "@inertiajs/react";

// Tipado de Props
type PropsDiscount = {
    discountProducts: ProductInterface[];
};

const Discount: React.FC<PropsDiscount> = ({ discountProducts }) => {
    return (
        <section className="discount">
            <Swiper
                modules={[Navigation, Pagination]}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
            >
                {discountProducts.map((product) => (
                    <SwiperSlide
                        key={product.id}
                    >
                      <div className="mx-4 sm:mx-10 xl:mx-44">
                        <div className="flex flex-wrap">
                            {/* Imagen de descuento */}
                            <div className="w-full lg:w-1/2 lg:h-[388px] p-0 overflow-hidden">
                                <img
                                    src={product.photo}
                                    alt={product.slug}
                                    className="min-w-full h-auto object-cover w-90"
                                />
                            </div>
                            {/* Texto de descuento */}
                            <div className="w-full lg:w-1/2 p-0">
                                <div className="bg-[#f4f4f4] h-[388px] px-0 md:px-[90px] py-12 md:py-[50px] text-center">
                                    <div className="relative z-[1] mb-[60px]">
                                        <span className="text-[12px] text-[#111111] font-medium uppercase">
                                            Discuento
                                        </span>
                                        <h2 className="text-accent text-[60px] font-cookie leading-[46px] mb-[10px]">
                                            Summer 2019
                                        </h2>
                                        <h5 className="text-accent font-bold">
                                            <span className="text-[14px] text-[#111111] mr-[4px]">
                                                Sale
                                            </span>{" "}
                                            {product.discount}%
                                        </h5>
                                    </div>
                                    {/* Capa circular detrás del título */}
                                    <div className="absolute left-1/2 -top-9 h-[183px] w-[183px] bg-white rounded-full z-[-1] transform -translate-x-1/2"></div>
                                    {/* Contador de descuento */}
                                    <div
                                        className="flex justify-center mb-[10px]"
                                        id="countdown-time"
                                    >
                                        {[
                                            { value: 22, label: "Days" },
                                            { value: 18, label: "Hour" },
                                            { value: 46, label: "Min" },
                                            { value: 5, label: "Sec" },
                                        ].map((item, index) => (
                                            <div
                                                key={index}
                                                className="countdown__item mx-2 text-center w-1/4"
                                            >
                                                <span className="text-[30px] font-semibold text-[#111111]">
                                                    {item.value}
                                                </span>
                                                <p className="text-[#111111] font-medium">
                                                    {item.label}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                    <Link
                                        href={route(
                                            "page.product.detail",
                                            product.slug
                                        )}
                                        className="text-[14px] text-[#111111] uppercase font-bold relative inline-block pb-[3px]"
                                    >
                                        Shop now
                                        <span className="absolute left-0 bottom-0 h-[2px] w-full bg-accent"></span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                      </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
};

export default Discount;
