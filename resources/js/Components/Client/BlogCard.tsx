import React from "react";

type Props = {
    img: string;
    title: string;
    user: string;
    fecha: string;
};

const BlogCard: React.FC<Props> = ({ img, title, user, fecha }) => {
    return (
        <div className="blog__item mb-4 rounded-lg shadow-md overflow-hidden"> {/* Added rounded-lg and shadow-md for styling */}
        <div className="relative">
          <img
            src={img}
            alt={title}
            className="w-full object-cover aspect-video"  // Ensure the image takes full width and maintains aspect ratio
          />
        </div>
        <div className="blog__item__text p-4 bg-white"> {/* Changed p-6 to p-4 for a more consistent look */}
          <h6 className="mb-1">
            <a href="#" className="text-gray-900 font-semibold line-clamp-2">
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
