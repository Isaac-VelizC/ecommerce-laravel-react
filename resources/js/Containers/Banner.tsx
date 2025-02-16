import React from "react";
import { Swiper, SwiperSlide } from "swiper/react"; // Importar componentes principales de Swiper
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules"; // Importar módulos necesarios
import { BannerInterface } from "@/Interfaces/Banner";

type Props = {
    banners: BannerInterface[];
};

const Banner: React.FC<Props> = ({ banners }) => {
    return (
        <section className="h-[500px] relative">
            <Swiper
                effect={'fade'}
                modules={[EffectFade, Navigation, Pagination, Autoplay]}
                slidesPerView={1}
                loop={true}
                autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                }}
            >
                {banners.map((banner, index) => (
                    <SwiperSlide key={index}>
                        <div
                            className="h-[500px] bg-cover bg-center"
                            style={{ backgroundImage: `url(${banner.photo})` }}
                        >
                            <div className="w-full h-full absolute bg-black-2 opacity-40"/>
                            <div className="relative text-center pt-[150px]">
                                <span className="text-[18px] text-[#ca15b5] uppercase font-medium">
                                    {banner.title}
                                </span>
                                <h1 className="text-5xl md:text-7xl text-white font-cookie mb-[15px]">
                                    {banner.description}
                                </h1>
                                <a
                                    href="#"
                                    className="text-[14px] text-white uppercase font-bold relative inline-block pb-[3px]"
                                >
                                    Shop now
                                    <span className="absolute left-0 bottom-0 h-[2px] w-full bg-[#ca15b5]"></span>
                                </a>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
};

export default Banner;
