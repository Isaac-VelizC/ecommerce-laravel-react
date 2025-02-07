import React, { ReactNode } from "react";

type CardProps = {
    children: ReactNode;
    className?: string;
};

const Card: React.FC<CardProps> = ({ children, className }) => {
    return (
        <div className={`w-full h-auto bg-gray-500/10 rounded-lg p-2 md:p-10 ` + className}>
            {children}
        </div>
    );
};

export default Card;
