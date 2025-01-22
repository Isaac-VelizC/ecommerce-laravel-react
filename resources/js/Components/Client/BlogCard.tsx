import React from "react";

type Props = {
    img: string;
    title: string;
    user: string;
    fecha: string;
};

const BlogCard: React.FC<Props> = ({ img, title, user, fecha }) => {
    return (
        <div className="blog__item mb-9">
            <div
                className="h-[240px] bg-cover"
                style={{
                    backgroundImage: `url(${img})`,
                }}
            ></div>
            <div className="blog__item__text p-6 bg-white -mt-14 mr-7">
                <h6 className="mb-1">
                    <a
                        href="#"
                        className="text-gray-900 font-semibold line-clamp-2"
                    >
                        {title}
                    </a>
                </h6>
                <ul className="flex items-center text-gray-600 text-xs mt-2">
                    <li>
                        by <span className="text-gray-900">{user}</span>
                    </li>
                    <div className="px-3">|</div>
                    <li>{fecha}</li>
                </ul>
            </div>
        </div>
    );
};

export default BlogCard