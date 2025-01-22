import {
    forwardRef,
    InputHTMLAttributes,
    ReactNode,
    useEffect,
    useImperativeHandle,
    useRef,
} from "react";

interface SelectInputProps extends InputHTMLAttributes<HTMLSelectElement> {
    isFocused?: boolean;
    children: ReactNode;
}

export default forwardRef(function SelectInput(
    {
        className = "",
        isFocused = false,
        children,
        ...props
    }: SelectInputProps & { isFocused?: boolean },
    ref
) {
    const localRef = useRef<HTMLSelectElement>(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <select
            {...props}
            className={
                `rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-indigo-600 dark:focus:ring-indigo-600 ` +
                className
            }
            ref={localRef}
        >
            {children}
        </select>
    );
});
