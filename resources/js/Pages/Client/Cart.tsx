import Breadcrumb from "@/Components/Client/Breadcrumb";
import { IconClose } from "@/Components/Client/IconSvgClient";
import Instagram from "@/Containers/Instagram";
import { useCart } from "@/Context/CartContext";
import { motion } from "framer-motion";
import Client from "@/Layouts/ClientLayout";
import { Head, Link, router } from "@inertiajs/react";
import axios from "axios";
import React, { useState } from "react";

type Props = {
    //cartItems: CartInterface[];
};

interface Coupon {
    type: "fixed" | "percentage"; // Tipo de descuento
    value: number; // Monto o porcentaje del descuento
}

export default function Cart({}: Props) {
    const { cart, setCart } = useCart();
    const [coupon, setCoupon] = useState("");
    const [discount, setDiscount] = useState(0);
    const breadcrumbLinks = [
        { href: "/", label: "Home" },
        { href: "blog", label: "Shopping cart" },
    ];

    const tableVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: (index: number) => ({
            opacity: 1,
            y: 0,
            transition: { delay: index * 0.1, duration: 0.4, ease: "easeOut" },
        }),
    };

    const calculateDiscountedPrice = (
        price: number,
        discount: number
    ): number => {
        return discount > 0 ? price - (price * discount) / 100 : price;
    };

    // Función para disminuir la cantidad
    const handleDecrease = (index: number) => {
        const updatedCart = [...cart];
        if (updatedCart[index].quantity > 1) {
            updatedCart[index].quantity -= 1;
            setCart(updatedCart); // Actualizar el estado del carrito
        }
    };

    // Función para aumentar la cantidad
    const handleIncrease = (index: number) => {
        const updatedCart = [...cart];
        updatedCart[index].quantity += 1;
        setCart(updatedCart); // Actualizar el estado del carrito
    };

    // Calcular subtotal
    const subtotal = cart.reduce(
        (acc, item) =>
            acc +
            calculateDiscountedPrice(
                item.product.price,
                item.product.discount
            ) *
                item.quantity,
        0
    );
    // Aplicar descuento
    const total = subtotal - discount;

    const coupons: { [key: string]: Coupon } = {
        DISCOUNT10: { type: "fixed", value: 10 }, // $10 de descuento
        BLACKFRIDAY: { type: "percentage", value: 20 }, // 20% de descuento
    };

    const applyCoupon = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        const couponCode: string = coupon.trim().toUpperCase();

        if (coupons[couponCode]) {
            const { type, value } = coupons[couponCode];

            if (type === "fixed") {
                setDiscount(value); // Descuento fijo en dólares
            } else if (type === "percentage") {
                setDiscount((subtotal * value) / 100); // Descuento en porcentaje
            }
        } else {
            setDiscount(0);
            alert("Código no válido");
        }
    };

    const handleDelete = async (id: number) => {
        try {
            const response = await axios.get(route("cart.delete", id));

            if (response.status === 200) {
                // Filtrar el carrito para eliminar el producto eliminado
                setCart((prevCart) =>
                    prevCart.filter((item) => item.id !== id)
                );
            } else {
                console.error(
                    "Error al eliminar producto del carrito:",
                    response.status
                );
            }
        } catch (error: any) {
            console.error(
                "Error de red al eliminar producto del carrito:",
                error
            );
        }
    };

    return (
        <Client>
            <Head title="Carrito" />
            <Breadcrumb links={breadcrumbLinks} />
            <section className="pt-20 pb-20 spad">
                <div className="mx-4 sm:mx-10 xl:mx-44">
                    <div className="flex flex-wrap overflow-x-auto">
                        <div className="mb-8 w-full">
                            <table className="w-full border-collapse">
                                <thead className="border-b border-gray-200">
                                    <tr className="text-lg font-medium uppercase text-text">
                                        <th className="py-8 px-4 text-left">
                                            Product
                                        </th>
                                        <th className="py-8 px-4 text-center">
                                            Price
                                        </th>
                                        <th className="py-8 px-4 text-center">
                                            Quantity
                                        </th>
                                        <th className="py-8 px-4 text-center">
                                            Total
                                        </th>
                                        <th className="py-8 px-4"></th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {cart.length <= 0 ? (
                                        <tr>
                                            <td
                                                colSpan={5}
                                                className="py-4 text-center text-gray-500 h-60"
                                            >
                                                Carrito Vacío
                                            </td>
                                        </tr>
                                    ) : (
                                        cart.map((item, index) => (
                                            <motion.tr
                                                key={index}
                                                className="border-b border-gray-200"
                                                initial="hidden"
                                                animate="visible"
                                                variants={tableVariants}
                                                custom={index} // Pasamos el índice para escalonar la animación
                                            >
                                                <td className="py-8 px-4 flex items-center">
                                                    <img
                                                        className="w-20 h-20 object-cover rounded-md mr-4"
                                                        src={item.product.photo}
                                                        alt={item.product.title}
                                                    />
                                                    <div>
                                                        <h6 className="font-semibold text-gray-800">
                                                            {item.product.title}
                                                        </h6>
                                                    </div>
                                                </td>
                                                <td className="py-8 px-4 text-center text-red-600 font-semibold">
                                                    ${item.product.price} {item.product.discount >= 1 && `(${item.product.discount}%)`}
                                                </td>
                                                <td className="py-8 px-4 text-center">
                                                    <div className="flex items-center justify-center text-gray-600">
                                                        <button
                                                            className="w-8 h-8 flex items-center justify-center"
                                                            onClick={() =>
                                                                handleDecrease(
                                                                    index
                                                                )
                                                            }
                                                        >
                                                            −
                                                        </button>
                                                        <input
                                                            type="text"
                                                            value={
                                                                item.quantity
                                                            }
                                                            readOnly
                                                            className="w-12 text-center text-sm font-medium border-none focus:outline-none focus:ring-0"
                                                        />
                                                        <button
                                                            className="w-8 h-8 flex items-center justify-center"
                                                            onClick={() =>
                                                                handleIncrease(
                                                                    index
                                                                )
                                                            }
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="py-8 px-4 text-center font-semibold text-red-600">
                                                    $
                                                    {calculateDiscountedPrice(
                                                        item.product.price,
                                                        item.product.discount
                                                    ) * item.quantity}
                                                </td>
                                                <td className="py-8 px-4 text-center">
                                                    <span
                                                        onClick={() =>
                                                            handleDelete(
                                                                item.id
                                                            )
                                                        }
                                                        className="h-10 w-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center cursor-pointer"
                                                    >
                                                        <IconClose
                                                            color="black"
                                                            size={14}
                                                        />
                                                    </span>
                                                </td>
                                            </motion.tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="flex flex-wrap justify-between gap-4 mb-14">
                        <Link
                            href={route("page.shop")}
                            className="bg-gray-200 hover:bg-gray-300 font-medium py-3 px-8 uppercase text-sm transition-colors duration-200"
                        >
                            Continuar Comprando
                        </Link>
                        <a
                            href="#"
                            className="bg-gray-200 hover:bg-gray-300 font-medium py-3 px-8 uppercase text-sm transition-colors duration-200"
                        >
                            Actualizar Carrito
                        </a>
                    </div>

                    <div className="flex flex-wrap justify-between">
                        <div className="w-full lg:w-2/6">
                            <div className="">
                                <h6 className="font-semibold uppercase inline-block mr-8">
                                    Discount codes
                                </h6>
                                <form
                                    onSubmit={applyCoupon}
                                    className="relative w-94 inline-block"
                                >
                                    <input
                                        className="h-13 w-full border-[1px] border-solid pl-8 pr-30 text-sm rounded-full focus:ring-0 focus:border-accent"
                                        type="text"
                                        placeholder="Enter your coupon code"
                                        value={coupon}
                                        onChange={(e) =>
                                            setCoupon(e.target.value)
                                        }
                                    />
                                    <button
                                        type="submit"
                                        className="site-btn absolute right-1 top-1"
                                    >
                                        Apply
                                    </button>
                                </form>
                            </div>
                        </div>
                        <div className="w-full lg:w-90">
                            <div className="p-10 bg-gray-200">
                                <h6 className=" font-semibold uppercase mb-2 text-[#111111]">
                                    Cart total
                                </h6>
                                <ul className="mb-6">
                                    <li className="text-base font-semibold overflow-hidden leading-10">
                                        Subtotal{" "}
                                        <span className=" float-right text-red">
                                            $ {subtotal.toFixed(2)}
                                        </span>
                                    </li>
                                    {discount > 0 && (
                                        <li className="text-base font-semibold overflow-hidden leading-10">
                                            Discount{" "}
                                            <span className="float-right text-green-600">
                                                - ${discount.toFixed(2)}
                                            </span>
                                        </li>
                                    )}
                                    <li className="text-base font-semibold overflow-hidden leading-10">
                                        Total{" "}
                                        <span className="float-right text-red">
                                            ${total.toFixed(2)}
                                        </span>
                                    </li>
                                </ul>
                                <a href="#" className="site-btn">
                                    Proceed to checkout
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Instagram />
        </Client>
    );
}
