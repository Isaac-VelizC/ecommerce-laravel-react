import {
    forwardRef,
    InputHTMLAttributes,
    useEffect,
    useImperativeHandle,
    useRef,
} from "react";

export default forwardRef(function TextInput(
    {
        type = "text",
        className = "",
        isFocused = false,
        ...props
    }: InputHTMLAttributes<HTMLInputElement> & { isFocused?: boolean },
    ref
) {
    const localRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <input
            {...props}
            type={type}
            className={
                "rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 dark:border-gray-700 " +
                " bg-gray-500/20 dark:text-gray-300 dark:focus:border-cyan-600 dark:focus:ring-cyan-600 placeholder:text-gray-400 " +
                className
            }
            ref={localRef}
        />
    );
});
