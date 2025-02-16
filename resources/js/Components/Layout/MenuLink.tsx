import React, { useEffect, useState } from 'react';

interface MenuLinkProps {
    href: string;
    text: string;
}

const MenuLink: React.FC<MenuLinkProps> = ({ href, text }) => {
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        // Actualiza el estado cuando cambia la ruta
        setIsActive(window.location.pathname === href);
    }, [window.location.pathname]);

    return (
        <li className="relative">
            <a
                href={href}
                className={`text-sm font-medium uppercase text-gray-800 block relative py-1 
                    after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px]
                    after:bg-red-600 after:scale-x-0 after:transition-transform after:duration-500 
                    ${isActive ? 'after:scale-x-100' : 'hover:after:scale-x-100'}`}
            >
                {text}
            </a>
        </li>
    );
};

export default MenuLink;
