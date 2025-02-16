import BagIcon from "@/assets/svg/bag.svg";
import HeartIcon from "@/assets/svg/heart.svg";
import SearchIcon from "@/assets/svg/search.svg";
import AccountIcon from "@/assets/svg/acount.svg";
import { Link, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CartInterface } from "@/Interfaces/Cart";
import axios from "axios";

interface Props {
    cartItems: CartInterface[];
    toggleSearch: () => void;
}

const IconsNavBar: React.FC<Props> = ({ cartItems, toggleSearch }) => {
    const [countFavorite, setCountFavorite] = useState<number>(0);
    const { user } = usePage().props.auth;

    useEffect(() => {
        if (!user) {
            // Obtener favoritos desde localStorage
            const favorites = JSON.parse(
                localStorage.getItem("favorites") || "[]"
            );
            setCountFavorite(favorites.length);
        } else {
            // Si el usuario está autenticado, obtener los favoritos desde el backend
            const fetchFavorites = async () => {
                try {
                    const response = await axios.get(route("get-favorites"));
                    if (response.status === 200) {
                        setCountFavorite(response.data.favoriteCount);
                    }
                } catch (error) {
                    console.error("Error al obtener favoritos:", error);
                }
            };
            fetchFavorites();
        }
    }, [user]); // Se ejecuta cuando cambia el usuario

    const [isCartOpen, setIsCartOpen] = useState(false);

    const cartPreviewVariants = {
        open: { opacity: 1, y: 0, display: "block" },
        closed: {
            opacity: 0,
            y: -20,
            transitionEnd: { display: "none" },
        },
    };

    return (
        <ul className="list-none flex space-x-7">
            <li onClick={toggleSearch} className="hover:scale-110 transition duration-300 ease-in-out cursor-pointer">
                <img src={SearchIcon} alt="Icon Search" width={23} />
            </li>
            <li className="hover:scale-110 transition duration-300 ease-in-out cursor-pointer">
                <Link href={ user ? route('perfil.account') : route("login")}>
                    <img src={AccountIcon} alt="Icon account" width={20} />
                </Link>
            </li>
            <li className="hover:scale-110 transition duration-300 ease-in-out cursor-pointer">
                <Link href={route("page.list.favorite")}>
                    <img src={HeartIcon} alt="Icon Heart" width={24} />
                    {countFavorite > 0 && (
                        <div className="absolute -right-3 -top-[11px] h-4 w-4 bg-black text-white text-xs leading-tight rounded-full text-center">
                            {countFavorite}
                        </div>
                    )}
                </Link>
            </li>
            <li
                className="relative hover:scale-110 transition duration-300 ease-in-out"
                onMouseEnter={() => setIsCartOpen(true)}
                onMouseLeave={() => setIsCartOpen(false)}
            >
                <div className="relative cursor-pointer">
                    <img src={BagIcon} alt="Icon Bag" width={20} />
                    {cartItems.length > 0 && (
                        <div className="absolute -right-3 -top-[11px] h-4 w-4 bg-black text-white text-xs leading-tight rounded-full text-center">
                            {cartItems.length}
                        </div>
                    )}
                </div>

                <motion.div
                    className="absolute right-0 mt-2 w-75 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden z-10"
                    variants={cartPreviewVariants}
                    initial="closed"
                    animate={isCartOpen ? "open" : "closed"}
                    style={{ display: "none" }} // Initially hidden
                >
                    {cartItems.length === 0 ? (
                        <div className="p-4 text-gray-600">
                            Tu carrito está vacío.
                        </div>
                    ) : (
                        <ul>
                            {cartItems.map((item) => (
                                <li
                                    key={item.id}
                                    className="p-2 flex items-center border-b last:border-b-0"
                                >
                                    <img
                                        src={item.product.photo}
                                        alt={item.product.title}
                                        className="w-12 h-12 object-cover rounded mr-4"
                                    />
                                    <div>
                                        <p className="font-bold m-0">
                                            {item.product.title}
                                        </p>
                                        <p className="text-xs m-0">
                                            Precio: <span className="text-[#ca1515]">{item.price}</span>
                                        </p>
                                        <p className="text-xs">
                                            Cantidad: {item.quantity}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                    {cartItems.length > 0 && (
                        <a
                            href={route("cart")}
                            className="block p-4 text-center bg-primary hover:bg-pink-400 text-sm font-semibold text-white"
                        >
                            Ver Carrito
                        </a>
                    )}
                </motion.div>
            </li>
        </ul>
    );
};

export default IconsNavBar;
