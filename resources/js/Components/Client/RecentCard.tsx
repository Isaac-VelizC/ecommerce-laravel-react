import { Link } from "@inertiajs/react";
import React from "react";

type Props = {
    img: string;
    title: string;
    price: number;
    discount: number;
    slug: string;
};

const RecentCard: React.FC<Props> = ({ img, title, price, discount, slug }) => {
    const originalPrice = price;
    const discountAmount = (originalPrice * discount) / 100;
    const finalPrice = originalPrice - discountAmount;
    return (
        <Link href={route('page.product.detail', slug)}>
            <div className="mb-6 overflow-hidden">
                <div className="float-left mr-5 w-16 h-20">
                    <img src={img} alt={title} className="object-cover bg-center" />
                </div>
                <div className="overflow-hidden">
                    <h6 className="text-[14px] text-[#111111] font-medium mb-[5px]">{title}</h6>
                    <div className="text-[#ca1515] font-semibold text-base">
                        {finalPrice.toFixed(2)} €
                        {discount > 0 && (
                            <span className="text-gray-400 line-through ml-2 text-xs">
                                {originalPrice.toFixed(2)} €
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
};
export default RecentCard;
