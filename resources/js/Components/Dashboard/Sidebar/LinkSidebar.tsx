import { Link, usePage } from "@inertiajs/react";
import React from "react";

type Props = {
    name: string;
    icon: string;
    href: string;
};

const LinkSidebar: React.FC<Props> = ({ name, icon, href }) => {
    const { url } = usePage();
    const cleanHref = new URL(href, window.location.origin).pathname;
    const isActive = url === cleanHref || url.startsWith(cleanHref);

    return (
        <li>
            <Link
                href={href}
                className={`group relative flex items-center gap-2.5 rounded-xl py-2 px-4 font-medium 
                    text-text duration-300 ease-in-out 
                    hover:text-accent dark:hover:text-pink-400 ${
                        isActive ? "bg-secondary text-text" : ""
                    }`}
            >
                <i className={`fa-solid ${icon} text-primary ${isActive ? "text-white" : ""}`}></i>
                {name}
            </Link>
        </li>
    );
};

export default LinkSidebar;