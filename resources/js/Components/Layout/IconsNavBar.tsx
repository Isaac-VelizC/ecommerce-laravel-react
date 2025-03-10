import BagIcon from "@/assets/svg/bag.svg";
import HeartIcon from "@/assets/svg/heart.svg";
import SearchIcon from "@/assets/svg/search.svg";
import AccountIcon from "@/assets/svg/acount.svg";
import { Link, router, usePage } from "@inertiajs/react";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { CartInterface } from "@/Interfaces/Cart";
import axios from "axios";

interface Props {
    cartItems: CartInterface[];
    toggleSearch: () => void;
}

const IconsNavBar: React.FC<Props> = ({ cartItems, toggleSearch }) => {
    const [countFavorite, setCountFavorite] = useState<number>(0);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const { user } = usePage().props.auth;
    const cartRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (user && user.role === "user") {
            fetchFavorites();
        }
    }, [user]);

    const fetchFavorites = async () => {
        try {
            const response = await axios.get(route("get-favorites"));
            if (response.status === 200) {
                setCountFavorite(response.data.favorites.length);
            }
        } catch (error) {
            console.error("Error al obtener favoritos:", error);
        }
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
            setIsCartOpen(false);
        }
    };

    const handleCartClick = () => {
        if (window.innerWidth < 1000) {
          router.get(route('cart'));
        } else {
          setIsCartOpen(!isCartOpen);
        }
      };

    useEffect(() => {
        if (isCartOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isCartOpen]);

    const cartPreviewVariants = {
        open: { opacity: 1, y: 0, display: "block" },
        closed: { opacity: 0, y: -20, transitionEnd: { display: "none" } },
    };

    return (
        <ul className="list-none flex space-x-7">
            <li
                onClick={toggleSearch}
                className="hover:scale-110 transition duration-300 ease-in-out cursor-pointer"
            >
                <img src={SearchIcon} alt="Icon Search" className="lg:w-6 w-18" />
            </li>
            <li className="hover:scale-110 transition duration-300 ease-in-out cursor-pointer">
                <Link href={user ? route("perfil.account") : route("login")}>
                    <img src={AccountIcon} alt="Icon account" className="lg:w-5 w-16" />
                </Link>
            </li>
            <li className="relative cursor-pointer flex items-center">
                <Link href={route("page.list.favorite")} className="relative">
                    <img src={HeartIcon} alt="Icon Heart" className="lg:w-6 w-18 hover:scale-110 transition-transform duration-300 ease-in-out" />
                    {countFavorite > 0 && (
                        <div className="absolute -right-3 -top-[11px] h-4 w-4 bg-black text-white text-xs leading-tight rounded-full text-center">
                            {countFavorite}
                        </div>
                    )}
                </Link>
            </li>
            <li className="relative hover:scale-110 transition duration-300 ease-in-out">
                <div className="relative cursor-pointer" onClick={() => handleCartClick()}>
                    <img src={BagIcon} alt="Icon Bag" className="lg:w-5 w-16" />
                    {cartItems.length > 0 && (
                        <div className="absolute -right-3 -top-[11px] h-4 w-4 bg-black text-white text-xs leading-tight rounded-full text-center">
                            {cartItems.length}
                        </div>
                    )}
                </div>

                <motion.div
                    ref={cartRef}
                    className="absolute right-0 mt-2 w-75 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden z-10"
                    variants={cartPreviewVariants}
                    initial="closed"
                    animate={isCartOpen ? "open" : "closed"}
                >
                    {cartItems.length === 0 ? (
                        <div className="p-4 text-gray-600">Tu carrito está vacío.</div>
                    ) : (
                        <ul>
                            {cartItems.map((item) => (
                                <li key={item.id} className="p-2 flex items-center border-b last:border-b-0">
                                    <img src={item.product.photo} alt={item.product.title} className="w-12 h-12 object-cover rounded mr-4" />
                                    <div>
                                        <p className="font-bold m-0">{item.product.title}</p>
                                        <p className="text-xs m-0">
                                            Precio: <span className="text-[#ca1515]">{item.price}</span>
                                        </p>
                                        <p className="text-xs">Cantidad: {item.quantity}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                    {cartItems.length > 0 && (
                        <a href={route("cart")} className="block p-4 text-center bg-primary hover:bg-pink-400 text-sm font-semibold text-white">
                            Ver Carrito
                        </a>
                    )}
                </motion.div>
            </li>
        </ul>
    );
};

export default IconsNavBar;
