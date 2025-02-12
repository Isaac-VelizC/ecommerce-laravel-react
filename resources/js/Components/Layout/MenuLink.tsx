import React from 'react';

interface MenuLinkProps {
    href: string;
    text: string;
    isActive?: boolean;
}

const MenuLink: React.FC<MenuLinkProps> = ({ href, text, isActive }) => {
    return (
        <li className={`relative`}>
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
