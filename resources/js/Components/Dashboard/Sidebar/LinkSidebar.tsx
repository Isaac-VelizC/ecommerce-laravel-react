import { Link, usePage } from "@inertiajs/react";
import React from "react";

type Props = {
    name: string;
    icon: string;
    href: string;
};

const LinkSidebar: React.FC<Props> = ({ name, icon, href }) => {
    const { url } = usePage();
    const isActive = url === href || url.startsWith(href);

    return (
        <li>
            <Link
                href={href}
                className={`group relative flex items-center gap-2.5 rounded-xl py-2 px-4 font-medium 
                    text-gray-800 dark:text-gray-200 duration-300 ease-in-out 
                    hover:text-blue-600 dark:hover:text-blue-400 ${
                        isActive ? "bg-blue-500 text-white dark:bg-blue-700/60" : ""
                    }`}
            >
                <i className={`fa-solid ${icon} text-blue-500 dark:text-blue-400 ${isActive ? "text-white" : ""}`}></i>
                {name}
            </Link>
        </li>
    );
};

export default LinkSidebar;