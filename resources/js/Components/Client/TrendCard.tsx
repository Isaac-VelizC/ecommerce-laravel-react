import React from "react";

type Props = {
    img: string;
    title: string;
    price: number;
    discount: number;
};

const TrendCard: React.FC<Props> = ({ img, title, price, discount }) => {
    const originalPrice = price;
    const discountAmount = (originalPrice * discount) / 100;
    const finalPrice = originalPrice - discountAmount;

    return (
        <div className="mb-[35px] overflow-hidden">
            <div className="float-left mr-[25px] w-20 h-24">
                <img src={img} alt={title} className="object-cover bg-center" />
            </div>
            <div className="overflow-hidden">
                <h6 className="text-[14px] text-[#111111] mb-[5px]">{title}</h6>
                <div className="mb-[6px]">
                    {[...Array(5)].map((_, index) => (
                        <i
                            key={index}
                            className="fa fa-star text-[#e3c01c] text-[10px]"
                        />
                    ))}
                </div>
                <div className="text-[#ca1515] font-semibold">
                    {finalPrice.toFixed(2)} €
                    {discount > 0 && (
                        <span className="text-gray-400 line-through ml-2 text-xs">
                            {originalPrice.toFixed(2)} €
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TrendCard;
