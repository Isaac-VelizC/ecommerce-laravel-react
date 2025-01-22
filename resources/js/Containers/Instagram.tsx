import React from 'react';
import Insta1 from "@/assets/img/instagram/insta-1.jpg";
import Insta2 from "@/assets/img/instagram/insta-2.jpg";
import Insta3 from "@/assets/img/instagram/insta-3.jpg";
import Insta4 from "@/assets/img/instagram/insta-4.jpg";
import Insta5 from "@/assets/img/instagram/insta-5.jpg";
import Insta6 from "@/assets/img/instagram/insta-6.jpg";

const Instagram: React.FC = () => {
    const instagramItems = [
        Insta1,
        Insta2,
        Insta3,
        Insta4,
        Insta5,
        Insta6
    ];

    return (
        <div className="instagram">
            <div className="container-fluid">
                <div className="flex flex-wrap">
                    {instagramItems.map((src, index) => (
                        <div key={index} className="w-full lg:w-1/6 md:w-1/3 sm:w-1/2 p-0">
                            <div className="h-[320px] flex items-center justify-center relative group bg-cover bg-center" style={{ backgroundImage: `url(${src})` }}>
                                {/* Capa superpuesta */}
                                <div className="absolute inset-0 bg-white bg-opacity-90 transition-opacity duration-500 opacity-0 group-hover:opacity-80 z-[1]"></div>
                                {/* Texto de Instagram */}
                                <div className="text-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-[2]">
                                    <i className="fa-brands fa-instagram text-[30px] text-[#0d0d0d]"></i>
                                    <a href="#" className="text-[16px] text-[#0d0d0d] font-medium mt-[10px] block"> @ashion_shop </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Instagram;
