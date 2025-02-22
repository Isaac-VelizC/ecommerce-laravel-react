import React, { useEffect, useRef, useState } from "react";
import Logo from "@/assets/AshStyle.svg";
import LinkSidebar from "./LinkSidebar";

interface SidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
    const trigger = useRef<any>(null);
    const sidebar = useRef<any>(null);

    const storedSidebarExpanded = localStorage.getItem("sidebar-expanded");
    const [sidebarExpanded, setSidebarExpanded] = useState(
        storedSidebarExpanded === null
            ? false
            : storedSidebarExpanded === "true"
    );

    // close on click outside
    useEffect(() => {
        const clickHandler = ({ target }: MouseEvent) => {
            if (!sidebar.current || !trigger.current) return;
            if (
                !sidebarOpen ||
                sidebar.current.contains(target) ||
                trigger.current.contains(target)
            )
                return;
            setSidebarOpen(false);
        };
        document.addEventListener("click", clickHandler);
        return () => document.removeEventListener("click", clickHandler);
    });

    // close if the esc key is pressed
    useEffect(() => {
        const keyHandler = ({ keyCode }: KeyboardEvent) => {
            if (!sidebarOpen || keyCode !== 27) return;
            setSidebarOpen(false);
        };
        document.addEventListener("keydown", keyHandler);
        return () => document.removeEventListener("keydown", keyHandler);
    });

    useEffect(() => {
        localStorage.setItem("sidebar-expanded", sidebarExpanded.toString());
        if (sidebarExpanded) {
            document.querySelector("body")?.classList.add("sidebar-expanded");
        } else {
            document
                .querySelector("body")
                ?.classList.remove("sidebar-expanded");
        }
    }, [sidebarExpanded]);

    return (
        <aside
            ref={sidebar}
            className={`absolute left-0 top-0 z-9999 backdrop-blur-md flex h-screen w-72 flex-col overflow-y-hidden rounded-r-3xl bg-body duration-300 ease-linear lg:static lg:translate-x-0 ${
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
        >
            <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
                <a href="/">
                    <img src={Logo} alt="Logo" width={150} />
                </a>
                <button
                    ref={trigger}
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    aria-controls="sidebar"
                    aria-expanded={sidebarOpen}
                    className="block lg:hidden"
                >
                    <svg
                        className="fill-current"
                        width="20"
                        height="18"
                        viewBox="0 0 20 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
                            fill=""
                        />
                    </svg>
                </button>
            </div>
            <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
                <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
                    {/* <!-- Menu Group --> */}
                    <div>
                        <h3 className="mb-4 ml-4 text-sm font-semibold text-accent">
                            MENU
                        </h3>
                        <ul className="mb-6 flex flex-col gap-1.5">
                            <LinkSidebar name="Panel Control" icon="fa-chart-column" href="/dashboard"/>
                            <LinkSidebar name="Banner" icon="fa-image" href={route('banner.index')}/>
                            <LinkSidebar name="Category" icon="fa-diagram-project" href={route('category.index')}/>
                            <LinkSidebar name="Products" icon="fa-boxes-stacked" href={route('product.index')}/>
                            <LinkSidebar name="Brands" icon="fa-table-cells" href={route('brand.index')}/>
                            <LinkSidebar name="Shipping" icon="fa-truck" href={route('shipping.index')}/>
                            <LinkSidebar name="Orders" icon="fa-phone" href={route('order.index')}/>
                            <LinkSidebar name="Reviews" icon="fa-comments" href={route('review.index')}/>
                            <LinkSidebar name="Messages" icon="fa-message" href={route('messages.index')}/>
                        </ul>
                    </div>
                    <div>
                        <h3 className="mb-4 ml-4 text-sm font-semibold text-accent">
                            POST
                        </h3>
                        <ul className="mb-6 flex flex-col gap-1.5">
                            <LinkSidebar name="Posts" icon="fa-folder" href={route('post.index')}/>
                            <LinkSidebar name="Category" icon="fa-diagram-project" href={route('post.categories.index')}/>
                            <LinkSidebar name="Tags" icon="fa-tags" href={route('post.tags.index')}/>
                            <LinkSidebar name="Comments" icon="fa-comments" href="hola-mundo"/>
                        </ul>
                    </div>
                    <div>
                        <h3 className="mb-4 ml-4 text-sm font-semibold text-accent">
                            GENERAL
                        </h3>
                        <ul className="mb-6 flex flex-col gap-1.5">
                            <LinkSidebar name="Coupon" icon="fa-table-cells" href={route('coupon.index')}/>
                            <LinkSidebar name="Users" icon="fa-users" href={route('user.index')}/>
                            <LinkSidebar name="Settings" icon="fa-gear" href={route('settings')}/>
                        </ul>
                    </div>
                </nav>
            </div>
        </aside>
    );
};

export default Sidebar;
