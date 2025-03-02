import { Link } from "@inertiajs/react";
import React, { useEffect, useState } from "react";

interface MenuLinkProps {
    href: string;
    text: string;
    children?: React.ReactNode;
}

const MenuLink: React.FC<MenuLinkProps> = ({ href, text, children }) => {
    const [isActive, setIsActive] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        setIsActive(window.location.pathname === href);
    }, [window.location.pathname]);

    return (
        <li 
            className="relative group"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            <Link
                href={href}
                className={`text-sm font-medium uppercase text-gray-800 block relative py-1 
                    after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px]
                    after:bg-red-600 after:scale-x-0 after:transition-transform after:duration-500 
                    ${isActive ? 'after:scale-x-100' : 'hover:after:scale-x-100'}`}
            >
                {text}
            </Link>

            {/* Menú desplegable */}
            {children && isOpen && (
                <ul className="absolute left-0 top-full mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
                    {children}
                </ul>
            )}
        </li>
    );
};

export default MenuLink;
