import Breadcrumb from "@/Components/Client/Breadcrumb";
import Instagram from "@/Containers/Instagram";
import {
    ColorsInterface,
    ProductImagesInterface,
    ProductInterface,
    SizesInterface,
} from "@/Interfaces/Product";
import Client from "@/Layouts/ClientLayout";
import { router } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { IconCart, IconShare } from "@/Components/Client/IconSvgClient";
import RowProducts from "@/Containers/RowProducts";
import axios from "axios";
import { useCart } from "@/Context/CartContext";
import { saveFavoriteProduct } from "@/Utils/api/consultas";
import LikeButton from "@/Components/Animated/ButtonLike";
import MyCarousel from "@/Components/Client/Carousel";
import ReviewProduct from "@/Components/Client/ReviewProduct";
import { PropMessage } from "@/Interfaces/Message";
import { Alert } from "@/Components/Client/alerts";
import { Helmet } from "react-helmet-async";

type Props = {
    product_detail: ProductInterface;
    relatedProdcuts: ProductInterface[];
    colors: ColorsInterface[];
    sizes: SizesInterface[];
    images: ProductImagesInterface[];
};

export default function ProductDetail({
    product_detail,
    relatedProdcuts,
    colors,
    sizes,
    images,
}: Props) {
    const breadcrumbLinks = [
        { href: "/", label: "Home" },
        {
            href: route("product.cat", product_detail.cat_info.slug),
            label: product_detail.cat_info.slug,
        },
        { href: "#", label: product_detail.title },
    ];
    const [message, setMessage] = useState<PropMessage>({
        type: "info",
        message: "",
    });
    const [isInWishlist, setIsInWishlist] = useState(
        product_detail.is_in_wishlist
    );

    const [stockAvailable, setStockAvailable] = useState<boolean>(false);
    const [stockQuantity, setStockQuantity] = useState<number>(0);
    //const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
    const [filteredImages, setFilteredImages] = useState<
        ProductImagesInterface[]
    >([]);
    const [addedToCart, setAddedToCart] = useState<boolean>(false);
    const [selectedColor, setSelectedColor] = useState<number | null>(null);
    const [selectedSize, setSelectedSize] = useState<number | null>(null);
    const [quantity, setQuantity] = useState(1);
    const handleIncrease = () => setQuantity((prev) => (prev < stockQuantity ? prev + 1 : prev));
    const handleDecrease = () =>
        setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
    const { setCart } = useCart();
    const [activeTab, setActiveTab] = useState("descripcion");
    const originalPrice = product_detail.price;
    const discountAmount = (originalPrice * product_detail.discount) / 100;
    const finalPrice = originalPrice - discountAmount;

    const handleAddCartSingle = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();
        try {
            if (!selectedColor || !selectedSize) {
                setMessage({
                    type: "error",
                    message: "Por favor selecciona el color y el tamaño.",
                });
                return;
            }

            if (quantity >= stockQuantity) {
                setMessage({
                    type: "error",
                    message: "Stock insuficiente",
                });
                return;
            }

            const response = await axios.post(
                route("single-add-to-cart"),
                {
                    slug: product_detail.slug,
                    quant: quantity,
                    color: selectedColor,
                    size: selectedSize
                },
                {
                    withCredentials: true,
                }
            );

            if (response.status === 200) {
                setCart(response.data.cartItems);
                setMessage({
                    type: "success",
                    message: "Producto añadido carrito.",
                });
                setAddedToCart(true);
                setStockAvailable(false);
                setStockQuantity(0);
                setQuantity(1);
            } else {
                setMessage({
                    type: "error",
                    message:
                        response.data.error || "Error al agregar el producto",
                });
            }
        } catch (error: any) {
            if (error.response.status === 401) {
                console.warn(
                    "Usuario no autenticado, redirigiendo al login..."
                );
                router.visit("/login"); // Redirigir al login si no está autenticado
            } else {
                console.error("Error de red:", error);
            }
        }
    };

    const shareProduct = () => {
        if (navigator.share) {
            navigator
                .share({
                    title: product_detail.title,
                    text: `🔥 ${product_detail.title} - ${product_detail.price} USD 💲\n${product_detail.short_description}`,
                    url: window.location.href,
                })
                .then(() => console.log("Compartido con éxito"))
                .catch((error) => console.error("Error al compartir:", error));
        } else {
            alert("Tu navegador no soporta la función de compartir.");
        }
    };

    const checkAvailability = async (
        selectedColor: number,
        selectedSize: number
    ) => {
        if (!selectedColor || !selectedSize) return;

        try {
            const response = await axios.get(`/inventory/check`, {
                params: {
                    color: selectedColor,
                    size: selectedSize,
                    product_id: product_detail.id,
                },
            });

            setStockAvailable(response.data.stock > 0);
            setStockQuantity(response.data.stock);
        } catch (error) {
            console.error("Error al consultar la disponibilidad", error);
            setMessage({
                type: "error",
                message: "Error al consultar la disponibilidad del producto.",
            });
        }
    };

    // Llamar la función cada vez que cambie el color o tamaño
    useEffect(() => {
        if (selectedColor !== null && selectedSize !== null) {
            checkAvailability(selectedColor as number, selectedSize as number);
        }
    }, [selectedColor, selectedSize]);

    const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedColor(Number(event.target.value));
        // Filtrar la imagen correspondiente
        //const newImages = images.filter((img) => img.color_id === color);
        //setFilteredImages(newImages.length > 0 ? newImages : images);
    };

    const handleSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedSize(Number(event.target.value));
    };

    const renderStars = (rating: number) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <i
                    key={i}
                    className={`fa fa-star ${
                        i <= rating ? "text-yellow-400" : "text-gray-300"
                    }`}
                ></i>
            );
        }
        return stars;
    };

    useEffect(() => {
        setIsInWishlist(product_detail.is_in_wishlist);
    }, [product_detail.is_in_wishlist]);

    const handleLikeClick = () => {
        saveFavoriteProduct({
            slug: product_detail.slug,
            onSuccess: () => {
                setIsInWishlist(!isInWishlist);
                // Notificar al componente padre si la función está definida
                //onWishlistChange?.(product_detail.id, !isInWishlist);
            },
            onError: (error) => {
                console.error("Error al actualizar la lista de deseos:", error);
                // Manejar el error (mostrar un mensaje al usuario, etc.)
                alert(
                    "No se pudo agregar/quitar de favoritos. Inténtalo de nuevo."
                );
            },
        });
    };

    return (
        <Client>
            <Helmet>
                {/* Meta para Facebook */}
                <meta property="og:title" content={product_detail.title} />
                <meta
                    property="og:description"
                    content={product_detail.summary}
                />
                <meta property="og:image" content={product_detail.photo} />
                <meta property="og:url" content={window.location.href} />
                <meta property="og:type" content="product" />

                {/* Meta para Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={product_detail.title} />
                <meta
                    name="twitter:description"
                    content={product_detail.summary}
                />
                <meta name="twitter:image" content={product_detail.photo} />
            </Helmet>
            <Breadcrumb links={breadcrumbLinks} />

            <section className="pt-17 pb-12">
                <div className="mx-4 sm:mx-10 xl:mx-44">
                    {message.message && (
                        <div className="my-4">
                            <Alert
                                type={message.type}
                                message={message.message}
                                closeAlert={() =>
                                    setMessage({ type: "info", message: "" })
                                }
                            />
                        </div>
                    )}
                    <div className="flex flex-wrap">
                        <MyCarousel images={images} />
                        <div className="w-full lg:w-1/2 md:pl-4 lg:pl-8">
                            <div className="product__details__text">
                                <h3 className="text-black font-semibold uppercase mb-3">
                                    {product_detail.title}{" "}
                                    <span className="block text-sm text-[#444444] font-normal mt-1">
                                        Brand: {product_detail.brand?.title}{" "}
                                    </span>
                                </h3>
                                <div className="rating mb-4">
                                    {renderStars(
                                        product_detail.get_review_avg_rate || 0
                                    )}
                                    <span className="text-xs ml-1 text-[#666666]">
                                        ( {product_detail.get_review.length}{" "}
                                        reseñas )
                                    </span>
                                </div>
                                <div className="text-[30px] font-semibold text-[#ca1515] mb-7">
                                    $ {finalPrice}{" "}
                                    {product_detail.discount > 0 && (
                                        <span className="text-lg text-[#b1b0b0] ml-3 inline-block line-through">
                                            $ {originalPrice}
                                        </span>
                                    )}
                                </div>
                                <div
                                    className="mb-7 text-[#444444]"
                                    dangerouslySetInnerHTML={{
                                        __html: product_detail.summary,
                                    }}
                                />
                                {!stockAvailable &&
                                    selectedColor &&
                                    selectedSize && (
                                        <p className="text-red-500 text-sm mt-2 absolute">
                                            Lo sentimos, esta combinación no
                                            está disponible.
                                        </p>
                                    )}

                                {addedToCart && (
                                    <p className="text-green-500 text-sm mt-2">
                                        ¡Producto agregado al carrito
                                        correctamente!
                                    </p>
                                )}

                                <div className="border-solid border-t-[1px] pt-9 mb-5">
                                    <ul>
                                        <li className="mb-2">
                                            <span className=" inline-block text-sm font-semibold w-[150px] float-left text-[#111111]">
                                                Disponible:
                                            </span>
                                            {selectedColor && selectedSize ? (
                                                <label
                                                    htmlFor="stockin"
                                                    className={`relative text-sm ${
                                                        stockAvailable
                                                            ? "text-green-600"
                                                            : "text-red-500"
                                                    }`}
                                                >
                                                    {stockAvailable
                                                        ? `${stockQuantity} unidades`
                                                        : "No está disponible."}
                                                </label>
                                            ) : (
                                                <label className="text-orange-600">
                                                    Selecciona color y tamaño
                                                </label>
                                            )}
                                        </li>
                                        <li className="mb-2">
                                            <span className=" inline-block text-sm font-semibold w-[150px] float-left text-[#111111]">
                                                Color disponible:
                                            </span>
                                            <div className="color__checkbox">
                                                {colors.map((color) => (
                                                    <label
                                                        key={color.id}
                                                        className="cursor-pointer"
                                                    >
                                                        <input
                                                            type="radio"
                                                            name="color__radio"
                                                            value={color.id}
                                                            checked={
                                                                selectedColor ===
                                                                color.id
                                                            }
                                                            onChange={
                                                                handleColorChange
                                                            }
                                                            className="hidden"
                                                        />
                                                        <span
                                                            className="w-5 h-5 inline-block rounded-[50%] mr-2"
                                                            style={{
                                                                backgroundColor:
                                                                    color.codigo_hex,
                                                                border:
                                                                    selectedColor ===
                                                                    color.id
                                                                        ? "2px solid #ff6b8e"
                                                                        : "1px solid #000",
                                                            }}
                                                        ></span>
                                                    </label>
                                                ))}
                                            </div>
                                        </li>
                                        <li className="mb-2">
                                            <span className=" inline-block text-sm font-semibold w-[150px] float-left text-[#111111]">
                                                Tamaño disponible:
                                            </span>
                                            <div className="size__btn">
                                                {sizes.map((size) => (
                                                    <label
                                                        key={size.id}
                                                        className={`mr-2 cursor-pointer ${
                                                            selectedSize ===
                                                            size.id
                                                                ? "text-[#ff6b8e]"
                                                                : ""
                                                        }`}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name="size__radio"
                                                            value={size.id}
                                                            checked={
                                                                selectedSize ===
                                                                size.id
                                                            }
                                                            onChange={
                                                                handleSizeChange
                                                            }
                                                            className="hidden"
                                                        />
                                                        {size.name}
                                                    </label>
                                                ))}
                                            </div>
                                        </li>
                                        {/*<li className="mb-2">
                                            <span className=" inline-block text-sm font-semibold w-[150px] float-left text-[#111111]">
                                                Promotiones:
                                            </span>
                                            <p>Envios Gratis</p>
                                        </li>*/}
                                    </ul>
                                </div>
                                <div className="overflow-hidden mb-6">
                                    <form onSubmit={handleAddCartSingle}>
                                        <div className="quantity float-left mr-2 mb-4">
                                            <div className="flex items-center space-x-3">
                                                <span className="text-sm text-[#111111] font-semibold">
                                                    Cantidad:
                                                </span>
                                                <div className="flex items-center border border-gray-300 rounded-full overflow-hidden">
                                                    <button
                                                        type="button"
                                                        className="w-10 h-10 flex justify-center items-center bg-transparent transition"
                                                        onClick={handleDecrease}
                                                    >
                                                        −
                                                    </button>
                                                    <input
                                                        type="text"
                                                        name="quant"
                                                        value={quantity}
                                                        readOnly
                                                        className="w-12 text-center text-sm font-medium border-none focus:outline-none focus:ring-0"
                                                    />
                                                    <button
                                                        type="button"
                                                        className="w-10 h-10 flex justify-center items-center bg-transparent transition"
                                                        onClick={handleIncrease}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            type="submit"
                                            className={`inline-flex float-left items-center text-[12px] px-2 py-3 text-white font-semibold uppercase rounded-full ${
                                                stockQuantity >= 1
                                                    ? "bg-accent hover:bg-primary"
                                                    : "bg-gray-300 cursor-not-allowed"
                                            } transition duration-200 mr-2`}
                                            disabled={
                                                !selectedColor ||
                                                !selectedSize ||
                                                !quantity
                                            }
                                        >
                                            <IconCart size={16} /> Añadir al
                                            carrito
                                        </button>
                                    </form>
                                    <ul className="float-left">
                                        <LikeButton
                                            isLiked={isInWishlist}
                                            onClick={() => handleLikeClick()}
                                            classname="rounded-full border border-gray-300 bg-gray-100/20 p-3 mr-2 "
                                        />
                                        <li
                                            className="inline-block rounded-full border border-gray-300 hover:bg-gray-100 p-3 mr-2 cursor-pointer"
                                            onClick={() => shareProduct()}
                                        >
                                            <IconShare color="black" />
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
                                    <a
                                        className={`relative inline-block p-0 text-lg font-semibold border-none transition ${
                                            activeTab === "descripcion"
                                                ? "text-[#111111]"
                                                : "text-[#666666]"
                                        }`}
                                        onClick={() =>
                                            setActiveTab("descripcion")
                                        }
                                        href="#descripcion"
                                    >
                                        Descripción
                                        {activeTab === "descripcion" ? (
                                            <span className="absolute left-0 bottom-0 h-[2px] w-[80%] bg-accent animate-draw"></span>
                                        ) : null}
                                    </a>
                                </li>
                                <li className="ml-4">
                                    <a
                                        className={`relative inline-block p-0 text-lg font-semibold border-none transition ${
                                            activeTab === "review"
                                                ? "text-[#111111]"
                                                : "text-[#666666]"
                                        }`}
                                        onClick={() => setActiveTab("review")}
                                        href="#review"
                                    >
                                        Reseñas
                                        {activeTab === "review" ? (
                                            <span className="absolute left-0 bottom-0 h-[2px] w-[80%] bg-accent animate-draw"></span>
                                        ) : null}
                                    </a>
                                </li>
                            </ul>

                            {/* Contenido de Tabs */}
                            <div className="text-[#666666] font-semibold mb-6">
                                <div
                                    id="descripcion"
                                    className={`tab-pane ${
                                        activeTab === "descripcion"
                                            ? "block"
                                            : "hidden"
                                    }`}
                                >
                                    <h6 className="text-lg font-bold">
                                        Descripción
                                    </h6>
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: product_detail.description,
                                        }}
                                    />
                                </div>
                                <div
                                    id="review"
                                    className={`tab-pane ${
                                        activeTab === "review"
                                            ? "block"
                                            : "hidden"
                                    }`}
                                >
                                    <ReviewProduct
                                        productSlug={product_detail.slug}
                                        reviews={product_detail.get_review}
                                        ratingTotal={
                                            product_detail.get_review_avg_rate ??
                                            0
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap">
                        <div className="w-full text-center">
                            <h5 className="font-semibold text-lg text-[#111111] ">
                                PRODUCTOS RELACIONADOS
                            </h5>
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
