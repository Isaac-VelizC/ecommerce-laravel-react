import Breadcrumb from "@/Components/Client/Breadcrumb";
import { IconClose } from "@/Components/Client/IconSvgClient";
import Instagram from "@/Containers/Instagram";
import { useCart } from "@/Context/CartContext";
import { motion } from "framer-motion";
import Client from "@/Layouts/ClientLayout";
import { Head, Link } from "@inertiajs/react";
import axios from "axios";
import { debounce } from "lodash";
import { IconEdit } from "@/Components/IconSvg";
import { useState } from "react";
import { CartInterface } from "@/Interfaces/Cart";
import CartEditModal from "@/Components/Client/Modal/CartEditModal";
import { PropMessage } from "@/Interfaces/Message";
import { Alert } from "@/Components/Client/alerts";
import { SizesInterface } from "@/Interfaces/Product";

type CartProps = {
    sizes: SizesInterface[];
};

export default function Cart({ sizes }: CartProps) {
    const { cart, setCart } = useCart();
    const [cartSelect, setCartSelect] = useState<CartInterface | null>(null);
    const [cartSelectModal, setCartSelectModal] = useState<boolean>(false);
    const [message, setMessage] = useState<PropMessage | null>(null);
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

    let controller = new AbortController();

    // Función para actualizar el stock en el backend
    const updateCartItem = async (id: number, quantity: number) => {
        // Cancela la petición anterior si existe
        if (controller) controller.abort();
        // Crea un nuevo controlador para la petición actual
        controller = new AbortController();
        try {
            console.log("listo");

            const response = await axios.post(
                route("cart.update.stock", [id, quantity])
            );
            if (response.status === 200) {
                console.log("todo bien");

                return;
            } else {
                console.log(response.data.error);

                console.error(
                    "Error al actualizar el carrito:",
                    response.status
                );
            }
        } catch (error: any) {
            if (axios.isCancel(error)) {
                console.log("Petición cancelada por nueva actualización");
            } else {
                console.error("Error de red al actualizar carrito:", error);
            }
        }
    };

    // Debounce optimizado con cancelación
    const debouncedUpdateCartItem = debounce(updateCartItem, 500);

    // Función para disminuir cantidad
    const handleDecrease = (index: number) => {
        const updatedCart = [...cart];
        if (updatedCart[index].quantity > 1) {
            updatedCart[index].quantity -= 1;
            setCart(updatedCart);
            debouncedUpdateCartItem(
                updatedCart[index].id,
                updatedCart[index].quantity
            );
        }
    };

    // Función para aumentar cantidad
    const handleIncrease = (index: number) => {
        const updatedCart = [...cart];
        if (
            updatedCart[index].quantity >=
            updatedCart[index].inventario_con_detalles.quantity
        ) {
            setMessage({
                type: "error",
                message: "No se puede agregar más: Stock máximo alcanzado",
            });
            return;
        }
        updatedCart[index].quantity += 1;
        setCart(updatedCart);
        debouncedUpdateCartItem(
            updatedCart[index].id,
            updatedCart[index].quantity
        );
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
    const total = subtotal; // - discount;

    const handleDelete = async (id: number) => {
        try {
            const response = await axios.get(route("cart.delete", id));

            if (response.status === 200) {
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

    const handleEdit = async (cartItem: CartInterface) => {
        setCartSelect(cartItem);
        setCartSelectModal(true);
    };

    const handleCloseModal = () => {
        setCartSelect(null);
        setCartSelectModal(false);
    };

    return (
        <Client>
            <Head title="Carrito" />
            <Breadcrumb links={breadcrumbLinks} />
            {message?.message && (
                <Alert
                    type={message.type}
                    message={message.message}
                    closeAlert={() => setMessage(null)}
                />
            )}
            <CartEditModal
                showModal={cartSelectModal}
                closeModal={() => handleCloseModal()}
                sizes={sizes}
                cartItem={cartSelect}
            />
            <section className="pt-4 lg:pt-20 pb-20">
                <div className="mx-4 sm:mx-10 xl:mx-44">
                    <div className="flex flex-wrap overflow-x-auto">
                        <div className="mb-8 w-full">
                            <table className="w-full border-collapse">
                                <thead className="border-b border-gray-200">
                                    <tr className="text-xs lg:text-base font-medium uppercase text-text">
                                        <th className="py-8 px-2 text-left">
                                            Producto
                                        </th>
                                        <th className="py-8 px-2 text-center">
                                            Color
                                        </th>
                                        <th className="py-8 px-2 text-center">
                                            Tamaño
                                        </th>
                                        <th className="py-8 px-2 text-center">
                                            Precio
                                        </th>
                                        <th className="py-8 px-2 text-center">
                                            Cantidad
                                        </th>
                                        <th className="py-8 px-2 text-center">
                                            Total
                                        </th>
                                        <th className="py-8 px-2"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cart.length <= 0 ? (
                                        <tr>
                                            <td
                                                colSpan={7}
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
                                                custom={index}
                                            >
                                                <td className="py-8 px-2 flex flex-col lg:flex-row items-center">
                                                    <img
                                                        className="w-20 h-20 object-cover rounded-md mr-4"
                                                        src={
                                                            item
                                                                .inventario_con_detalles
                                                                .image.image
                                                        }
                                                        alt={item.product.title}
                                                    />
                                                    <h6 className="font-semibold text-[10px] mt-2 lg:mt-0 lg:text-base text-gray-800">
                                                        {item.product.title}
                                                    </h6>
                                                </td>
                                                <td className="py-8 px-2 text-center  text-xs lg:text-base font-semibold">
                                                    {
                                                        item
                                                            .inventario_con_detalles
                                                            .color.name
                                                    }
                                                </td>
                                                <td className="px-2 content-center text-center text-xs font-semibold">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleEdit(item)
                                                        }
                                                        className="h-5 md:h-8 w-5 md:w-8 bg-gray-200 hover:bg-gray-300 rounded-full"
                                                    >
                                                        {
                                                            item
                                                                .inventario_con_detalles
                                                                .size.name
                                                        }
                                                    </button>
                                                </td>
                                                <td className="py-8 px-2 text-center  text-xs lg:text-base text-red-600 font-semibold">
                                                    ${item.product.price}
                                                </td>
                                                <td className="py-8 px-2 text-center">
                                                    <div className="flex flex-col lg:flex-row items-center justify-center text-gray-600">
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
                                                            className="w-10 lg:w-12 text-center text-sm font-medium border-none focus:outline-none focus:ring-0"
                                                        />
                                                        <button
                                                            className={`w-8 h-8 flex items-center justify-center ${
                                                                item.quantity >=
                                                                    item
                                                                        .inventario_con_detalles
                                                                        .quantity &&
                                                                "text-red cursor-not-allowed"
                                                            }`}
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
                                                <td className="py-8 px-2 text-center text-xs lg:text-base font-semibold text-red-600">
                                                    $
                                                    {calculateDiscountedPrice(
                                                        item.product.price,
                                                        item.product.discount
                                                    ) * item.quantity}
                                                </td>
                                                <td className="py-8 px-2 text-center">
                                                    <span
                                                        onClick={() =>
                                                            handleDelete(
                                                                item.id
                                                            )
                                                        }
                                                        className="h-5 md:h-10 w-5 md:w-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center cursor-pointer"
                                                    >
                                                        <IconClose
                                                            color="black"
                                                            size={12}
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
                    <div className="relative mt-6 lg:mt-0 mb-14">
                        <Link
                            href={"/products/all"}
                            className="bg-gray-200 hover:bg-gray-300 font-medium py-3 px-8 uppercase rounded text-sm transition-colors duration-200"
                        >
                            Continuar Comprando
                        </Link>
                    </div>

                    <div className="flex flex-wrap justify-end">
                        <div className="w-full lg:w-90">
                            <div className="p-10 bg-gray-200">
                                <h6 className=" font-semibold uppercase mb-2 text-[#111111]">
                                    Compra total
                                </h6>
                                <ul className="mb-6">
                                    <li className="text-base font-semibold overflow-hidden leading-10">
                                        Subtotal{" "}
                                        <span className=" float-right text-red">
                                            $ {subtotal.toFixed(2)}
                                        </span>
                                    </li>
                                    <li className="text-base font-semibold overflow-hidden leading-10">
                                        Total{" "}
                                        <span className="float-right text-red">
                                            ${total.toFixed(2)}
                                        </span>
                                    </li>
                                </ul>
                                <Link
                                    href={route("checkout")}
                                    className="site-btn w-full text-center"
                                >
                                    Continuar al pago
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Instagram />
        </Client>
    );
}
