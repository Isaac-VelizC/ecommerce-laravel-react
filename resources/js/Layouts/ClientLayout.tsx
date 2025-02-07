import { PropsWithChildren, useEffect, useState } from "react";
import Logo from "@/assets/img/logo.png";
import MenuLink from "@/Components/Layout/MenuLink";
import { Link, usePage } from "@inertiajs/react";
import LinkImg from "@/Components/Layout/LinkImg";
import Payment1 from "@/assets/img/payment/payment-1.png";
import Payment2 from "@/assets/img/payment/payment-2.png";
import Payment3 from "@/assets/img/payment/payment-3.png";
import Payment4 from "@/assets/img/payment/payment-4.png";
import { AnimatePresence, motion } from "framer-motion";
import IconsNavBar from "@/Components/Layout/IconsNavBar";

const pageVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, x: 20, transition: { duration: 0.3 } },
};

const LoginRegisterLink = () => {
    const { auth } = usePage().props;
    return (
        <>
            {auth.user ? (
                <Link
                    href={route("dashboard")}
                    className="text-gray-600 text-sm relative"
                >
                    Dashboard
                </Link>
            ) : (
                <>
                    <Link
                        href={route("login")}
                        className="text-gray-600 text-sm relative"
                    >
                        Login
                    </Link>
                    <span className="text-gray-600 text-sm mx-1">/</span>
                    <Link
                        href={route("register")}
                        className="text-gray-600 text-sm relative"
                    >
                        Register
                    </Link>
                </>
            )}
        </>
    );
};

export default function Client({ children }: PropsWithChildren) {
    const [isOpen, setIsOpen] = useState(false);
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
                        "bg-rose-400/10",
                        "shadow-md",
                        "backdrop-filter",
                        "backdrop-blur-lg"
                    );
                } else {
                    navbar.classList.remove(
                        "bg-rose-400/10",
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

    return (
        <div className="min-h-screen">
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
                    <IconsNavBar />
                </div>
                {/* Logo */}
                <div className="mb-6 text-center">
                    <img src={Logo} alt="Logo" />
                </div>

                {/* Navegación */}
                <ul className="space-y-4 text-left">
                    <MenuLink text="Home" href="/" />
                    <MenuLink text="About Us" href="/" />
                    <MenuLink href="blog" text="Women’s" />
                    <MenuLink href="blog" text="Men’s" />
                    <MenuLink href="shop" text="Shop" />
                    <MenuLink text="Blog" href="/blog" />
                    <MenuLink text="Contact" href="/contact" />
                </ul>

                {/* Botones de Login/Register */}
                <div className="mt-6 text-center">
                    <LoginRegisterLink />
                </div>
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
                                <ul className="list-none flex justify-center space-x-10 relative">
                                    <MenuLink
                                        href="/"
                                        text="Home"
                                        //isActive={url == "/"}
                                    />
                                    <MenuLink href="blog" text="Women’s" />
                                    <MenuLink href="blog" text="Men’s" />
                                    <MenuLink href="shop" text="Shop" />
                                    <MenuLink
                                        href="/blog"
                                        text="Blog"
                                        //isActive={url === "/blog"}
                                    />
                                    <MenuLink
                                        href="/contact"
                                        text="Contact"
                                        //isActive={url === "/contact"}
                                    />
                                </ul>
                            </nav>
                        </div>
                        <div className="hidden lg:flex justify-end w-full lg:w-1/4 py-7">
                            <div className="inline-block mr-[25px]">
                                <LoginRegisterLink />
                            </div>
                            <IconsNavBar />
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
                                <a href="./index.html">
                                    <img src={Logo} alt="Shoping" />
                                </a>
                            </div>
                            <p className="mb-[20px]">
                                Lorem ipsum dolor sit amet, consectetur
                                adipiscing elit, sed do eiusmod tempor
                                incididunt cilisis.
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
                                    {["About", "Blogs", "Contact", "FAQ"].map(
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
                                        "Checkout",
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
                                    className="h-[52px] w-full border border-[#e1e1e1] rounded-full pl-[30px] text-[14px] text-[#666666]"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-0 top-0 h-full px-6 bg-red-600 text-white font-semibold tracking-wider rounded-full"
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
                                Copyright &copy; {new Date().getFullYear()} All
                                rights reserved | This template is made with{" "}
                                <i
                                    className="fa fa-heart text-[#ca1515]"
                                    aria-hidden="true"
                                ></i>{" "}
                                by{" "}
                                <a
                                    href="https://colorlib.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#5C5C5C] hover:text-[#ca1515]"
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
