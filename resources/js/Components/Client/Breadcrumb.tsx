import React from "react";

type Props = {
    links: { href: string; label: string }[]; // Array de objetos con href y label
};

const Breadcrumb = ({ links }: Props) => {
    return (
        <div className="pt-28">
            <div className="mx-4 sm:mx-10 xl:mx-44">
                <div className="flex">
                    <div className="w-full">
                        <div className="flex items-center">
                            {links.map((link, index) => (
                                <React.Fragment key={index}>
                                    <a
                                        href={link.href}
                                        className={`font-medium text-sm mr-4 relative inline-block ${index === links.length - 1 ? "text-rose-500" : "text-gray-900"} `}
                                    >
                                        {index === 0 && (
                                            <i className="fa fa-home mr-1"></i>
                                        )}
                                        {link.label}
                                        {index < links.length - 1 && (
                                            <span className="absolute right-[-14px] top-0 text-gray-900">
                                                {">"}
                                            </span>
                                        )}
                                    </a>
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Breadcrumb;
