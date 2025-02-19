import { PropsWithChildren, useEffect, useState } from "react";
import Logo from "@/assets/AshStyle.svg";
import MenuLink from "@/Components/Layout/MenuLink";
import { Link, usePage } from "@inertiajs/react";
import LinkImg from "@/Components/Layout/LinkImg";
import Payment1 from "@/assets/img/payment/payment-1.png";
import Payment2 from "@/assets/img/payment/payment-2.png";
import Payment3 from "@/assets/img/payment/payment-3.png";
import Payment4 from "@/assets/img/payment/payment-4.png";
import { AnimatePresence, motion } from "framer-motion";
import IconsNavBar from "@/Components/Layout/IconsNavBar";
import axios from "axios";
import { useCart } from "@/Context/CartContext";
import Search from "@/Components/Client/Search";
import { useSettings } from "@/Context/SettingsContext";

const pageVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, x: 20, transition: { duration: 0.3 } },
};

export default function Client({ children }: PropsWithChildren) {
    const { user } = usePage().props.auth;
    const { cart, setCart } = useCart();
    const { settings } = useSettings();
    const [error, setError] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenSearch, setIsOpenSearch] = useState(false);
    const paymentsImgs = [
        { img: Payment1, description: "Descripción del Pago 1" },
        { img: Payment2, description: "Descripción del Pago 2" },
        { img: Payment3, description: "Descripción del Pago 3" },
        { img: Payment4, description: "Descripción del Pago 4" },
    ];

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const handleScroll = () => {
            const navbar = document.getElementById("navbar");
            if (navbar) {
                if (window.scrollY > 40) {
                    navbar.classList.add(
                        "bg-white",
                        "shadow-md",
                        "backdrop-filter",
                        "backdrop-blur-lg"
                    );
                } else {
                    navbar.classList.remove(
                        "bg-white",
                        "shadow-md",
                        "backdrop-filter",
                        "backdrop-blur-lg"
                    );
                }
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    useEffect(() => {
        if (user) {
            fetchCartItems();
        }
    }, []);

    const fetchCartItems = async () => {
        try {
            const response = await axios.get(route("api.list.cart"));

            // Verificar si la respuesta es exitosa y los datos están presentes
            if (
                response.status === 200 &&
                response.data &&
                response.data.items
            ) {
                setCart(response.data.items); // Asignar los datos del carrito
                //setLoading(false); // Indicar que la carga ha finalizado
            } else {
                setError("Error al obtener los datos del carrito.");
                //setLoading(false);
            }
        } catch (e: any) {
            setError("Error de conexión: " + e.message);
            //setLoading(false);
        }
    };

    return (
        <div className="min-h-screen">
            {isOpenSearch && (
                <Search toggleSearch={() => setIsOpenSearch(false)} />
            )}
            <div
                className={`fixed inset-0 bg-black bg-opacity-70 transition-opacity duration-500 z-[9999] ${
                    isOpen ? "visible opacity-100" : "invisible opacity-0"
                }`}
                onClick={toggleMenu}
            />

            {/* Menú lateral */}
            <div
                className={`fixed left-0 top-0 w-[300px] h-full bg-white px-6 pt-12 transition-transform duration-500 z-[10000] shadow-lg 
                ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
            >
                {/* Botón de cerrar */}
                <button
                    className="absolute right-8 top-8 w-10 h-10 flex items-center justify-center border border-gray-300 rounded-full text-2xl cursor-pointer"
                    onClick={toggleMenu}
                >
                    &times;
                </button>
                <div className=" float-right px-16 py-10">
                    <IconsNavBar
                        cartItems={[]}
                        toggleSearch={() => setIsOpenSearch(true)}
                    />
                </div>
                {/* Logo */}
                <div className="mb-6 text-center">
                    <img src={Logo} alt="Logo" width={100} />
                </div>

                {/* Navegación */}
                <ul className="space-y-4 text-left">
                    <MenuLink href="/" text="Home" />
                    {user && user.role === "admin" && (
                        <MenuLink href="/dashboard" text="Dashboard" />
                    )}
                    <MenuLink href="/products/all" text="Products" />
                    <MenuLink href="/blog" text="Tendencies" />
                    <MenuLink href="/blog" text="Blog" />
                    <MenuLink href="/about-us" text="About Us" />
                    <MenuLink href="/contact" text="Contact" />
                </ul>
            </div>

            <header
                data-scroll
                data-scroll-id="hey"
                id="navbar"
                className="fixed transition duration-300 ease-in-out w-full z-[9999]"
            >
                <div className="xl:mx-10">
                    <div className="flex flex-wrap items-center">
                        <div className="w-full lg:w-1/4 px-6">
                            <a href="#" className="inline-block py-6">
                                <img src={Logo} alt="Ashion" />
                            </a>
                        </div>
                        <div className="hidden lg:block w-full lg:w-1/2">
                            <nav className="py-4">
                                <ul className="list-none flex justify-center space-x-6 relative">
                                    <MenuLink href="/" text="Home" />
                                    {user && user.role === "admin" && (
                                        <MenuLink
                                            href="/dashboard"
                                            text="Dashboard"
                                        />
                                    )}
                                    <MenuLink
                                        href="/products/all"
                                        text="Products"
                                    />
                                    <MenuLink href="/blog" text="Tendencies" />
                                    <MenuLink href="/blog" text="Blog" />
                                    <MenuLink
                                        href="/about-us"
                                        text="About Us"
                                    />
                                    <MenuLink href="/contact" text="Contact" />
                                </ul>
                            </nav>
                        </div>
                        <div className="hidden lg:flex justify-end w-full lg:w-1/4 py-7">
                            <IconsNavBar
                                cartItems={cart}
                                toggleSearch={() => setIsOpenSearch(true)}
                            />
                        </div>
                    </div>
                    <div
                        className="block lg:hidden text-2xl text-gray-800 absolute right-4 top-6 w-9 h-9"
                        onClick={toggleMenu}
                    >
                        &#9776;
                    </div>
                </div>
            </header>

            {/* End Header */}
            <AnimatePresence mode="wait">
                <motion.main
                    key={location.pathname}
                    variants={pageVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                >
                    {children}
                </motion.main>
            </AnimatePresence>
            {/* Start Footer Area */}

            <footer className="pt-[55px]">
                <div className="mx-4 sm:mx-10 xl:mx-44">
                    <div className="flex flex-wrap">
                        {/* Sección About */}
                        <div className="w-full lg:w-1/3 md:w-1/2 sm:w-7/12 mb-[30px] pr-10">
                            <div className="mb-[20px]">
                                <a href="/">
                                    <img
                                        src={settings ? settings.photo : Logo}
                                        alt="Shoping"
                                    />
                                </a>
                            </div>
                            <p className="mb-[20px]">
                                {settings && settings.short_des}
                            </p>
                            <div className="footer__payment">
                                {paymentsImgs.map((payment, index) => (
                                    <LinkImg key={index} img={payment.img} />
                                ))}
                            </div>
                        </div>

                        {/* Sección Quick Links */}
                        <div className="w-full lg:w-1/6 md:w-1/4 sm:w-5/12 mb-[30px]">
                            <div className="footer__widget">
                                <h6 className="text-[#111111] font-semibold uppercase mb-[12px]">
                                    Quick links
                                </h6>
                                <ul>
                                    {["About", "Blogs", "Contact"].map(
                                        (link, index) => (
                                            <li
                                                key={index}
                                                className="list-none"
                                            >
                                                <a
                                                    href="#"
                                                    className="text-[#666666] text-[14px] leading-[30px]"
                                                >
                                                    {link}
                                                </a>
                                            </li>
                                        )
                                    )}
                                </ul>
                            </div>
                        </div>

                        {/* Sección Account */}
                        <div className="w-full lg:w-1/6 md:w-1/4 sm:w-4/12 mb-[30px]">
                            <div className="footer__widget">
                                <h6 className="text-[#111111] font-semibold uppercase mb-[12px]">
                                    Account
                                </h6>
                                <ul>
                                    {[
                                        "My Account",
                                        "Orders Tracking",
                                        "Wishlist",
                                    ].map((link, index) => (
                                        <li key={index} className="list-none">
                                            <a
                                                href="#"
                                                className="text-[#666666] text-[14px] leading-[30px]"
                                            >
                                                {link}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Sección Newsletter */}
                        <div className="w-full lg:w-1/3 md:w-1/2 sm:w-8/12 mb-[30px]">
                            <h6 className="text-[#111111] font-semibold uppercase mb-[25px]">
                                NEWSLETTER
                            </h6>
                            <form action="#" className="relative mb-[30px]">
                                <input
                                    type="text"
                                    placeholder="Email"
                                    className="h-[52px] w-full rounded-full pl-[30px] text-[14px] text-[#666666] focus:border-accent focus:ring-accent"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-0 top-0 h-full px-6 bg-accent text-white font-semibold tracking-wider rounded-full"
                                >
                                    Subscribe
                                </button>
                            </form>
                            {/* Social Media Icons */}
                            <div className="footer__social flex flex-wrap">
                                {[
                                    "facebook",
                                    "twitter",
                                    "instagram",
                                    "pinterest",
                                ].map((icon, index) => (
                                    <a
                                        href="#"
                                        key={index}
                                        className={`inline-block h-[40px] w-[40px] bg-[#e1e1e1] text-[#111111] rounded-full md:flex items-center justify-center mr-[6px] mb-[5px]`}
                                    >
                                        <i
                                            className={`fa-brands fa-${icon} text-[15px]`}
                                        ></i>
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Copyright Section */}
                        <div className="w-full mt-[35px] border-t border-[#e1e1e1] pt-[18px] pb-[25px] text-center">
                            <p className="mb-0 text-[#5C5C5C]">
                                Copyright &copy; {new Date().getFullYear()} Todo
                                derechos reservados | Hecha con{" "}
                                <i
                                    className="fa fa-heart text-accent"
                                    aria-hidden="true"
                                ></i>{" "}
                                por{" "}
                                <a
                                    href="https://colorlib.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#5C5C5C] hover:text-accent"
                                >
                                    AIsakVeliz
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
