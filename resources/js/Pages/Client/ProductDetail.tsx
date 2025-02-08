import Breadcrumb from "@/Components/Client/Breadcrumb";
import Instagram from "@/Containers/Instagram";
import { ProductInterface } from "@/Interfaces/Product";
import Client from "@/Layouts/ClientLayout";
import { Head } from "@inertiajs/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperClass } from "swiper";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

// import required modules
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import { useState } from "react";
import {
    IconCart,
    IconHeart,
    IconShare,
} from "@/Components/Client/IconSvgClient";
import RowProducts from "@/Containers/RowProducts";

type Props = {
    product_detail: ProductInterface;
    relatedProdcuts: ProductInterface[];
};

export default function ProductDetail({ product_detail, relatedProdcuts }: Props) {
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);
    const [quantity, setQuantity] = useState(1);
    const handleIncrease = () => setQuantity((prev) => prev + 1);
    const handleDecrease = () =>
        setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
    const [activeTab, setActiveTab] = useState("descripcion");

    const breadcrumbLinks = [
        { href: "/", label: "Home" },
        { href: "#", label: product_detail.title },
    ];

    // Convertir el precio a número
    const originalPrice = product_detail.price;
    const discountAmount = (originalPrice * product_detail.discount) / 100;
    const finalPrice = originalPrice - discountAmount;

    return (
        <Client>
            <Head title={product_detail.title} />
            <Breadcrumb links={breadcrumbLinks} />

            <section className="pt-17 pb-12">
                <div className="mx-4 sm:mx-10 xl:mx-44">
                    <div className="flex flex-wrap">
                        <div className="flex w-full lg:w-1/2 h-95 md:h-[600px] mb-10">
                            <div className="w-[80%] overflow-hidden order-2">
                                <Swiper
                                    loop={true}
                                    thumbs={{ swiper: thumbsSwiper }}
                                    modules={[FreeMode, Thumbs]}
                                    className="h-full"
                                >
                                    <SwiperSlide>
                                        <div className="w-full h-full overflow-hidden relative">
                                            <img
                                                src={product_detail.photo}
                                                className="w-full h-full object-cover bg-center"
                                                alt="Descripción del producto"
                                            />
                                        </div>
                                    </SwiperSlide>
                                    <SwiperSlide>
                                        <div className="w-full h-full bg-rose-500 overflow-hidden relative">
                                            <img
                                                src="https://swiperjs.com/demos/images/nature-2.jpg"
                                                className="w-full h-full object-cover bg-center"
                                                alt="Descripción del producto"
                                            />
                                        </div>
                                    </SwiperSlide>
                                    <SwiperSlide>
                                        <img src="https://swiperjs.com/demos/images/nature-3.jpg" />
                                    </SwiperSlide>
                                    <SwiperSlide>
                                        <img src="https://swiperjs.com/demos/images/nature-4.jpg" />
                                    </SwiperSlide>
                                    <SwiperSlide>
                                        <img src="https://swiperjs.com/demos/images/nature-5.jpg" />
                                    </SwiperSlide>
                                </Swiper>
                            </div>
                            <div className="w-[20%] order-1 xl:pr-5">
                                <Swiper
                                    onSwiper={setThumbsSwiper}
                                    direction="vertical"
                                    slidesPerView={4}
                                    freeMode={true}
                                    watchSlidesProgress={true}
                                    modules={[FreeMode, Thumbs]}
                                    className="h-full"
                                >
                                    <SwiperSlide>
                                        <div className="w-full h-32 overflow-hidden relative">
                                            <img
                                                src={product_detail.photo}
                                                className="w-full h-full object-cover bg-center"
                                                alt="Descripción del producto"
                                            />
                                        </div>
                                    </SwiperSlide>
                                    <SwiperSlide>
                                    <div className="w-full h-32 overflow-hidden relative">
                                            <img
                                                src="https://swiperjs.com/demos/images/nature-2.jpg"
                                                className="w-full h-full object-cover bg-center"
                                                alt="Descripción del producto"
                                            />
                                        </div>
                                    </SwiperSlide>
                                    <SwiperSlide>
                                    <div className="w-full h-32 overflow-hidden relative">
                                            <img
                                                src="https://swiperjs.com/demos/images/nature-3.jpg"
                                                className="w-full h-full object-cover bg-center"
                                                alt="Descripción del producto"
                                            />
                                        </div>
                                    </SwiperSlide>
                                    <SwiperSlide>
                                    <div className="w-full h-32 overflow-hidden relative">
                                            <img
                                                src="https://swiperjs.com/demos/images/nature-4.jpg"
                                                className="w-full h-full object-cover bg-center"
                                                alt="Descripción del producto"
                                            />
                                        </div>
                                    </SwiperSlide>
                                    <SwiperSlide><div className="w-full h-32 overflow-hidden relative">
                                            <img
                                                src="https://swiperjs.com/demos/images/nature-5.jpg"
                                                className="w-full h-full object-cover bg-center"
                                                alt="Descripción del producto"
                                            />
                                        </div>
                                    </SwiperSlide>
                                </Swiper>
                            </div>
                        </div>
                        <div className="w-full lg:w-1/2 md:pl-4 lg:pl-8">
                            <div className="product__details__text">
                                <h3 className="text-black font-semibold uppercase mb-3">
                                    {product_detail.title}{" "}
                                    <span className="block text-sm text-[#444444] font-normal mt-1">
                                        Brand: {product_detail.brand?.title}{" "}
                                    </span>
                                </h3>
                                <div className="rating mb-4">
                                    <i className="fa fa-star text-xs text-[#e3c01c] -mr-1"></i>
                                    <i className="fa fa-star text-xs text-[#e3c01c] -mr-1"></i>
                                    <i className="fa fa-star text-xs text-[#e3c01c] -mr-1"></i>
                                    <i className="fa fa-star text-xs text-[#e3c01c] -mr-1"></i>
                                    <i className="fa fa-star text-xs text-[#e3c01c] -mr-1"></i>
                                    <span className="text-xs ml-1 text-[#666666]">
                                        ( 138 reviews )
                                    </span>
                                </div>
                                <div className="text-[30px] font-semibold text-[#ca1515] mb-7">
                                    $ {finalPrice}{" "}
                                    <span className="text-lg text-[#b1b0b0] ml-3 inline-block line-through">
                                        $ {originalPrice}
                                    </span>
                                </div>
                                <p className="mb-7 text-[#444444]">
                                    {product_detail.description}
                                </p>
                                <div className="overflow-hidden mb-6">
                                    <div className="quantity float-left mr-2 mb-4">
                                        <div className="flex items-center space-x-3">
                                            <span className="text-sm text-[#111111] font-semibold">
                                                Cantidad:
                                            </span>
                                            <div className="flex items-center border border-gray-300 rounded-full overflow-hidden">
                                                <button
                                                    className="w-10 h-10 flex justify-center items-center bg-transparent transition"
                                                    onClick={handleDecrease}
                                                >
                                                    −
                                                </button>
                                                <input
                                                    type="text"
                                                    value={quantity}
                                                    readOnly
                                                    onChange={() => {}}
                                                    className="w-12 text-center text-sm font-medium border-none focus:outline-none focus:ring-0 "
                                                />
                                                <button
                                                    className="w-10 h-10 flex justify-center items-center bg-transparent transition"
                                                    onClick={handleIncrease}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <a
                                        href="#"
                                        className="inline-flex float-left items-center text-[12px] px-2 py-3 text-white font-semibold uppercase rounded-full bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-50 transition duration-200 mr-2"
                                    >
                                        <IconCart size={16} /> Añadir a carrito
                                    </a>
                                    <ul className="float-left">
                                        <li className="inline-block rounded-full border border-gray-300 p-3 mr-2">
                                            <a href="#">
                                                <IconHeart
                                                    size={18}
                                                    color="black"
                                                />
                                            </a>
                                        </li>
                                        <li className="inline-block rounded-full border border-gray-300 p-3 mr-2">
                                            <a href="#">
                                                <IconShare
                                                    size={18}
                                                    color="black"
                                                />
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                                <div className="border-solid border-t-[1px] pt-9">
                                    <ul>
                                        <li className="mb-2">
                                            <span className=" inline-block text-sm font-semibold w-[150px] float-left text-[#111111]">
                                                Disponible:
                                            </span>
                                            <label
                                                htmlFor="stockin"
                                                className="text-sm text-[#666666] relative"
                                            >
                                                {product_detail.stock}
                                            </label>
                                        </li>
                                        <li className="mb-2">
                                            <span className=" inline-block text-sm font-semibold w-[150px] float-left text-[#111111]">
                                                Available color:
                                            </span>
                                            <div className="color__checkbox">
                                                <label htmlFor="red">
                                                    <input
                                                        type="radio"
                                                        name="color__radio"
                                                        id="red"
                                                        checked
                                                    />
                                                    <span className="checkmark"></span>
                                                </label>
                                                <label htmlFor="black">
                                                    <input
                                                        type="radio"
                                                        name="color__radio"
                                                        id="black"
                                                    />
                                                    <span className="checkmark black-bg"></span>
                                                </label>
                                                <label htmlFor="grey">
                                                    <input
                                                        type="radio"
                                                        name="color__radio"
                                                        id="grey"
                                                    />
                                                    <span className="checkmark grey-bg"></span>
                                                </label>
                                            </div>
                                        </li>
                                        <li className="mb-2">
                                            <span className=" inline-block text-sm font-semibold w-[150px] float-left text-[#111111]">
                                                Available size:
                                            </span>
                                            <div className="size__btn">
                                                <label
                                                    htmlFor="xs-btn"
                                                    className="active"
                                                >
                                                    <input
                                                        type="radio"
                                                        id="xs-btn"
                                                    />
                                                    xs
                                                </label>
                                                <label htmlFor="s-btn">
                                                    <input
                                                        type="radio"
                                                        id="s-btn"
                                                    />
                                                    s
                                                </label>
                                                <label htmlFor="m-btn">
                                                    <input
                                                        type="radio"
                                                        id="m-btn"
                                                    />
                                                    m
                                                </label>
                                                <label htmlFor="l-btn">
                                                    <input
                                                        type="radio"
                                                        id="l-btn"
                                                    />
                                                    l
                                                </label>
                                            </div>
                                        </li>
                                        <li className="mb-2">
                                            <span className=" inline-block text-sm font-semibold w-[150px] float-left text-[#111111]">
                                                Promotions:
                                            </span>
                                            <p>Free shipping</p>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full">
                        <div className="pt-10 mb-10">
                            {/* Menú de Tabs */}
                            <ul className="border-b-0 flex justify-center relative mb-10">
                                <li className="mr-4">
                                    <button
                                        className={`relative inline-block p-0 text-lg font-semibold border-none transition ${
                                            activeTab === "descripcion"
                                                ? "text-[#111111]"
                                                : "text-[#666666]"
                                        }`}
                                        onClick={() =>
                                            setActiveTab("descripcion")
                                        }
                                    >
                                        Descripción
                                        {activeTab === "descripcion" ? (
                                            <span className="absolute left-0 bottom-0 h-[2px] w-[80%] bg-[#ca15b5] animate-draw"></span>
                                        ) : null}
                                    </button>
                                </li>
                                <li className="ml-4">
                                    <button
                                        className={`relative inline-block p-0 text-lg font-semibold border-none transition ${
                                            activeTab === "review"
                                                ? "text-[#111111]"
                                                : "text-[#666666]"
                                        }`}
                                        onClick={() => setActiveTab("review")}
                                    >
                                        Reviews
                                        {activeTab === "review" ? (
                                            <span className="absolute left-0 bottom-0 h-[2px] w-[80%] bg-[#ca15b5] animate-draw"></span>
                                        ) : null}
                                    </button>
                                </li>
                            </ul>

                            {/* Contenido de Tabs */}
                            <div className="text-[#666666] font-semibold mb-6">
                                <div
                                    className={`tab-pane ${
                                        activeTab === "descripcion"
                                            ? "block"
                                            : "hidden"
                                    }`}
                                    id="descripcion"
                                >
                                    <h6 className="text-lg font-bold">
                                        Descripción
                                    </h6>
                                    <p className="text-gray-700 mt-2">
                                        {product_detail.description}
                                    </p>
                                </div>

                                <div
                                    className={`tab-pane ${
                                        activeTab === "review"
                                            ? "block"
                                            : "hidden"
                                    }`}
                                    id="review"
                                >
                                    <h6 className="text-lg font-bold">
                                        Reviews
                                    </h6>
                                    <p className="text-gray-700 mt-2">
                                        Se mostrarán las vistas y comentarios.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap">
                        <div className="w-full text-center">
                                <h5 className="font-semibold text-lg text-[#111111] ">RELATED PRODUCTS</h5>
                        </div>
                        <div className="w-full mt-10">
                            <RowProducts products={relatedProdcuts} />
                        </div>
                    </div>
                </div>
            </section>
            <Instagram />
        </Client>
    );
}
