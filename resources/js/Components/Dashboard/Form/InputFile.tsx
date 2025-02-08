import {
    forwardRef,
    InputHTMLAttributes,
    useEffect,
    useImperativeHandle,
    useRef,
} from "react";

export default forwardRef(function InputFile(
    {
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
            type="file"
            className={
                "border-gray-300 shadow-sm file:border-0 focus:border-pink-500 focus:ring-pink-500 dark:border-gray-700 bg-gray-500/20 dark:text-gray-300 dark:focus:border-pink-600 dark:focus:ring-pink-600 flex h-10 rounded-md px-3 py-2 text-sm file:bg-transparent file:text-gray-600 file:text-sm file:font-medium " +
                className
            }
            ref={localRef}
        />
    );
});
