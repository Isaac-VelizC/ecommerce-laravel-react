import React from "react";

type Props = {
    name: string;
    type?: string;
    placeholder?: string;
};

const TextInput: React.FC<Props> = ({ name, type = "text", placeholder }) => {
    return (
        <input
            name={name}
            type={type}
            placeholder={placeholder}
            className="border border-[#e1e1e1] rounded-lg h-[50px] w-full px-[20px] text-gray-600 text-sm mb-5 focus:border-accent focus:ring-accent"
        />
    );
};

export default TextInput;
