import { Link, usePage } from "@inertiajs/react";
import React, { ReactNode } from "react";

type Props = {
    name: string;
    icon: ReactNode;
    href: string;
};

const LinkSidebar: React.FC<Props> = ({ name, icon, href }) => {
    const { url } = usePage();
    const isActive = url === href || url.startsWith(href);

    return (
        <li>
            <Link
                href={href}
                className={`group relative flex items-center gap-2.5 rounded-xl py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    isActive ? "bg-graydark dark:bg-meta-4 " : ""
                }`}
            >
                {icon}
                {name}
            </Link>
        </li>
    );
};

export default LinkSidebar;
