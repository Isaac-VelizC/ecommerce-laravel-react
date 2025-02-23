import React, { forwardRef, InputHTMLAttributes } from "react";

const TextInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function TextInput(
    {
        type = "text",
        className = "",
        ...props
    },
    ref // Asegúrate de incluir el ref como segundo parámetro
) {
    return (
        <input
            {...props}
            ref={ref} // Asigna el ref al input
            type={type}
            className={
                "border border-[#e1e1e1] rounded-lg h-[50px] w-full px-[20px] text-gray-600 text-sm mb-5 focus:border-accent focus:ring-accent " +
                className
            }
        />
    );
});

export default TextInput;
