import React, { ReactNode } from "react";

type Props = {
    color: string;
    icon: ReactNode;
    event?: () => void;
};

const IconButton: React.FC<Props> = ({ color, icon, event }) => {
    return (
        <button
            type="button"
            onClick={event}
            className={
                "group flex justify-center p-1.5 rounded-md drop-shadow-xl from-gray-800 hover:translate-y-1 hover:rounded-[50%] transition-all duration-500 " +
                color
            }
        >
            {icon}
        </button>
    );
};

export default IconButton;
