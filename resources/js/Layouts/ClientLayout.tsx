import { PropsWithChildren, useEffect, useState } from "react";
import Logo from "@/assets/img/logo.png";
import MenuLink from "@/Components/Layout/MenuLink";
import { Link, usePage } from "@inertiajs/react";
import LinkImg from "@/Components/Layout/LinkImg";
import Payment1 from "@/assets/img/payment/payment-1.png";
import Payment2 from "@/assets/img/payment/payment-2.png";
import Payment3 from "@/assets/img/payment/payment-3.png";
import Payment4 from "@/assets/img/payment/payment-4.png";
import BagIcon from "@/assets/svg/bag.svg";
import HeartIcon from "@/assets/svg/heart.svg";
import SearchIcon from "@/assets/svg/search.svg";
import Loader from "@/Common/Loader";

export default function Client({ children }: PropsWithChildren) {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const { props } = usePage();
    let url = props;
    let auth = props.auth;

    const fetchData = async () => {
        setLoading(true);
        // Simula una llamada a la API
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

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
            {loading && <Loader />}

            {/* Botón para abrir el menú */}
            {/* Overlay del menú */}
            <div
                className={`fixed inset-0 bg-black bg-opacity-70 transition-opacity duration-500 ${
                    isOpen ? "visible opacity-100" : "invisible opacity-0"
                }`}
                onClick={toggleMenu}
            />

            {/* Menú Offcanvas */}
            <div
                className={`fixed left-[-270px] w-[270px] h-full bg-white p-[90px] pt-[20px] pb-[30px] transition-all duration-500 ${
                    isOpen ? "opacity-100 left-0" : "opacity-0"
                }`}
            >
                <button
                    className="offcanvas__close absolute right-[30px] top-[25px] border border-gray-300 rounded-full w-[40px] h-[40px] text-xl transform rotate-45 cursor-pointer"
                    onClick={toggleMenu}
                >
                    &times;
                </button>

                <div className="mb-[25px]">
                    <h1 className="text-lg font-bold">Logo</h1>
                </div>

                <ul className="mb-[20px] text-center">
                    <li className="inline-block mr-[20px] cursor-pointer">
                        <a href="#">Link 1</a>
                    </li>
                    <li className="inline-block mr-[20px] cursor-pointer">
                        <a href="#">Link 2</a>
                    </li>
                    <li className="inline-block">
                        <a href="#">Link 3</a>
                    </li>
                </ul>

                <div className="">
                    <a href="#" className="text-gray-800 mr-[8px] font-medium">
                        Login
                    </a>
                    <a href="#" className="text-gray-800 mr-[8px] font-medium">
                        Register
                    </a>
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
                                        isActive={url === "/"}
                                    />
                                    <MenuLink href="blog" text="Women’s" />
                                    <MenuLink href="blog" text="Men’s" />
                                    <MenuLink href="blog" text="Shop" />
                                    <MenuLink
                                        href="blog"
                                        text="Blog"
                                        isActive={url === "/blog"}
                                    />
                                    <MenuLink
                                        href="contact"
                                        text="Contact"
                                        isActive={url === "/contact"}
                                    />
                                </ul>
                            </nav>
                        </div>
                        <div className="hidden lg:flex justify-end w-full lg:w-1/4 py-7">
                            <div className="inline-block mr-[25px]">
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
                                        <span className="text-gray-600 text-sm mx-1">
                                            /
                                        </span>
                                        <Link
                                            href={route("register")}
                                            className="text-gray-600 text-sm relative"
                                        >
                                            Register
                                        </Link>
                                    </>
                                )}
                            </div>
                            <ul className="list-none flex space-x-[20px]">
                                <li>
                                    <img
                                        src={SearchIcon}
                                        alt="Icon Search"
                                        width={18}
                                    />
                                </li>
                                <li>
                                    <a href="#" className="relative">
                                        <img
                                            src={HeartIcon}
                                            alt="Icon Heart"
                                            width={20}
                                        />
                                        <div className="absolute -right-3 -top-[11px] h-4 w-4 bg-black text-white text-xs leading-tight rounded-full text-center">
                                            2
                                        </div>
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="relative">
                                        <img
                                            src={BagIcon}
                                            alt="Icon Bag"
                                            width={15}
                                        />
                                        <div className="absolute -right-3 -top-[11px] h-4 w-4 bg-black text-white text-xs leading-tight rounded-full text-center">
                                            2
                                        </div>
                                    </a>
                                </li>
                            </ul>
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
            {children}
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
                                {paymentsImgs.map((payment) => (
                                    <LinkImg img={payment.img} />
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
                                    Colorlib
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
