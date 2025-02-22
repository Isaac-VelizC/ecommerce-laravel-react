import { a } from "framer-motion/client";

interface BreadcrumbProps {
    pageName: string;
    links: { href: string; label: string }[];
}

const Breadcrumb = ({ pageName, links }: BreadcrumbProps) => {
    return (
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-title-md2 font-semibold text-black dark:text-white">
                {pageName}
            </h2>

            <nav className="flex flex-wrap items-center gap-2 overflow-x-auto">
                    <a className="font-medium" href="/">
                        Dashboard /
                    </a>
                    {links.map((link, index) => (
                        <a
                            key={index}
                            href={link.href}
                            className={`font-medium text-sm mr-4 relative inline-block ${
                                index === links.length - 1 ? "text-primary" : ""
                            } `}
                        >
                            {link.label}
                            {index < links.length - 1 && (
                                <span className="absolute right-[-14px] top-0">
                                    {"/"}
                                </span>
                            )}
                        </a>
                    ))}
            </nav>
        </div>
    );
};

export default Breadcrumb;
