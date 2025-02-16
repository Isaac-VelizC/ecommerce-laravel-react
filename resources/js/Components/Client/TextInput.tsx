import { forwardRef, InputHTMLAttributes } from "react";

export default forwardRef(function TextInput({
    type = "text",
    className = "",
    ...props
}: InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            {...props}
            type={type}
            className={
                "border border-[#e1e1e1] rounded-lg h-[50px] w-full px-[20px] text-gray-600 text-sm mb-5 focus:border-accent focus:ring-accent " +
                className
            }
        />
    );
});
