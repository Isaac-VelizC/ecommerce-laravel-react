import React from 'react';
import { ProductInterface } from '@/Interfaces/Product';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { Link } from '@inertiajs/react';

// Tipado de Props
type PropsDiscount = {
  discountProducts: ProductInterface[];
};

const Discount: React.FC<PropsDiscount> = ({ discountProducts }) => {
  return (
    <section className="discount">
      {/* Carrusel de productos en descuento */}
      <div className="mx-4 sm:mx-10 xl:mx-44 mt-8">
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={20}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {discountProducts.map((product) => (
            <SwiperSlide key={product.id}>
              <div className="bg-white shadow-lg p-4 rounded-lg text-center">
                <img src={product.photo} alt={product.title} className="w-full h-48 object-cover mb-4" />
                <h4 className="text-lg font-semibold">{product.title}</h4>
                <p className="text-gray-600">${product.price} <span className="line-through text-red-500">${product.price}</span></p>
                <Link href={route("product.detail", product.slug)} className="text-accent font-semibold mt-2 inline-block">View</Link>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Discount;
