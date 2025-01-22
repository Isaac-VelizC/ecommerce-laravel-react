import React from "react";
import banner from "@/assets/img/banner/banner-1.jpg";

type Props = {};

const Banner: React.FC<Props> = () => {
    return (
        <section className="h-[500px] bg-cover bg-center" style={{ backgroundImage: `url(${banner})` }}>
            <div className="container mx-auto h-full">
                <div className="flex items-center justify-center h-full">
                    <div className="w-full xl:w-7/12 lg:w-8/12 m-auto">
                        <div className="banner__slider text-center pt-[150px]">
                            <div className="banner__item">
                                <div className="banner__text">
                                    <span className="text-[18px] text-[#ca1515] uppercase">The Chloe Collection</span>
                                    <h1 className="text-5xl md:text-7xl text-[#111111] font-cookie mb-[15px]">The Project Jacket</h1>
                                    <a href="#" className="text-[14px] text-[#111111] uppercase font-bold relative inline-block pb-[3px]">
                                        Shop now
                                        <span className="absolute left-0 bottom-0 h-[2px] w-full bg-[#ca1515]"></span>
                                    </a>
                                </div>
                            </div>
                            {/* Repetir el banner__item para otros elementos */}
                            {/*<div className="banner__item">
                                <div className="banner__text">
                                    <span className="text-[18px] text-[#ca1515] uppercase">The Chloe Collection</span>
                                    <h1 className="text-5xl md:text-7xl text-[#111111] font-cookie mb-[15px]">The Project Jacket</h1>
                                    <a href="#" className="text-[14px] text-[#111111] uppercase font-bold relative inline-block pb-[3px]">
                                        Shop now
                                        <span className="absolute left-0 bottom-0 h-[2px] w-full bg-[#ca1515]"></span>
                                    </a>
                                </div>
                            </div>
                            <div className="banner__item">
                                <div className="banner__text">
                                    <span className="text-[18px] text-[#ca1515] uppercase">The Chloe Collection</span>
                                    <h1 className="text-5xl md:text-7xl text-[#111111] font-cookie mb-[15px]">The Project Jacket</h1>
                                    <a href="#" className="text-[14px] text-[#111111] uppercase font-bold relative inline-block pb-[3px]">
                                        Shop now
                                        <span className="absolute left-0 bottom-0 h-[2px] w-full bg-[#ca1515]"></span>
                                    </a>
                                </div>
                            </div>*/}
                        </div>
                        <div>*</div>
                        {/* Dots for carousel */}
                        {/* Aquí puedes agregar la lógica para los puntos del carrusel si es necesario */}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Banner;
