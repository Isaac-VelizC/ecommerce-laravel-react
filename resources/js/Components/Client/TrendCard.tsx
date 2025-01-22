import React from "react";

type Props = {
    img: string;
    title: string;
    price: number;
};

const TrendCard: React.FC<Props> = ({ img, title, price }) => {
    return (
        <div className="mb-[35px] overflow-hidden">
            <div className="float-left mr-[25px]">
                <img src={img} alt="" />
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
                <div className="text-[#111111] font-semibold">
                    $ {price}.0
                </div>
            </div>
        </div>
    );
};

export default TrendCard;