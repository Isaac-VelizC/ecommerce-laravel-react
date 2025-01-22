import React from "react";

type Props = {
    img: string;
};

const LinkImg: React.FC<Props> = ({ img }) => {
    return (
        <a href="#" className="inline-block mr-[6px] mb-[10px]">
            <img src={img} alt="" />
        </a>
    );
};

export default LinkImg;