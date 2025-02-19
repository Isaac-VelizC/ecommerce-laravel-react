import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/thumbs';
import { Swiper as SwiperType } from 'swiper/types';
import { ProductImagesInterface } from '@/Interfaces/Product';

interface MyCarouselProps {
    images: ProductImagesInterface[];
}

const MyCarousel: React.FC<MyCarouselProps> = ({ images }) => {
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

    return (
        <div className="flex w-full lg:w-1/2 h-95 md:h-[600px] mb-10">
            <div className="w-[80%] overflow-hidden order-2">
                <Swiper
                    loop={true}
                    thumbs={{ swiper: thumbsSwiper }}
                    modules={[FreeMode, Thumbs]}
                    className="h-full"
                >
                    {images.map((image) => (
                        <SwiperSlide key={image.id}>
                            <div className="w-full h-full overflow-hidden relative">
                                <img
                                    src={image.image}
                                    className="w-full h-full object-cover bg-center"
                                    alt={image.image}
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
            <div className="w-[20%] order-1 xl:pr-5 overflow-hidden">
                <Swiper
                    onSwiper={(swiper) => setThumbsSwiper(swiper)}
                    direction="vertical"
                    slidesPerView={4}
                    freeMode={true}
                    watchSlidesProgress={true}
                    modules={[FreeMode, Thumbs]}
                    className="h-full"
                >
                    {images.map((image) => (
                        <SwiperSlide key={image.id}>
                            <div className="w-full h-32 overflow-hidden relative">
                                <img
                                    src={image.image}
                                    className="w-full h-full object-cover bg-center"
                                    alt={image.image}
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
};

export default MyCarousel;
