import { forwardRef, useState } from "react";
import Select from "react-select";

interface SelectInputProps {
    options: { value: number | string; label: string }[]; // Opciones para el select
    isFocused?: boolean;
    value?: { value: number | string; label: string } | null;
    valueMultiple?: { value: number | string; label: string }[];
    onChange?: (selectedOption: any) => void;
    id: string;
    name: string;
    multiple?: boolean;
}

export default forwardRef(function InputSelect({
    id,
    name,
    value,
    valueMultiple,
    options,
    onChange,
    multiple = false,
}: SelectInputProps) {
    // Supón que tienes el estado themeDark para el modo oscuro o claro
    const [themeDark, setThemeDark] = useState(true); // Modo oscuro activado

    // Estilos para el modo oscuro
    const darkThemeStyles = {
        control: (styles: any) => ({
            ...styles,
            color: "#fff",
            minHeight: "38px",
            borderRadius: "0.375rem",
            borderColor: "transparent",
            boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
            backgroundColor: "rgb(107 114 128 / 0.2)",
            "&:hover": {
                borderColor: "#06b6d4", // focus:border-cyan-500 en Tailwind
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.2)", // focus:ring-cyan-500 en Tailwind
            },
        }),
        menu: (styles: any) => ({
            ...styles,
            backgroundColor: "#444",
            color: "#fff",
        }),
        option: (styles: any, { isSelected, isFocused }: any) => ({
            ...styles,

            backgroundColor: isSelected
                ? "#06b6d4"
                : isFocused
                ? "#e5e7eb"
                : "white", // Asegura que los colores sean aplicados
            color: isSelected ? "white" : "black",
            padding: "4px 15px",
            fontWeight: isSelected ? "bold" : "normal",
        }),
        multiValue: (styles: any) => ({
            ...styles,
            backgroundColor: "#555",
            color: "#fff",
        }),
        multiValueLabel: (styles: any) => ({
            ...styles,
            color: "#fff",
        }),
        multiValueRemove: (styles: any) => ({
            ...styles,
            color: "#fff",
            ":hover": {
                backgroundColor: "#666",
                color: "#fff",
            },
        }),
        singleValue: (provided: any) => ({
            ...provided,
            color: "#d1d5db", // : "#0b0e0e",
        }),
        placeholder: (provided: any) => ({
            ...provided,
            color: "#9ca3af",
        }),
    };

    // Estilos para el modo claro
    const lightThemeStyles = {
        control: (styles: any) => ({
            ...styles,
            color: "#333",
            minHeight: "38px",
            borderRadius: "0.375rem",
            borderColor: "transparent",
            boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
            backgroundColor: "rgb(107 114 128 / 0.2)",
            "&:hover": {
                borderColor: "#06b6d4", // focus:border-cyan-500 en Tailwind
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.2)", // focus:ring-cyan-500 en Tailwind
            },
        }),
        menu: (styles: any) => ({
            ...styles,
            backgroundColor: "#fff",
            color: "#333",
        }),
        option: (styles: any, { isSelected, isFocused }: any) => ({
            ...styles,
            backgroundColor: isSelected
                ? "#06b6d4"
                : isFocused
                ? "#e5e7eb"
                : "white", // Asegura que los colores sean aplicados
            color: isSelected ? "white" : "black",
            padding: "4px 15px",
            fontWeight: isSelected ? "bold" : "normal",
        }),
        multiValue: (styles: any) => ({
            ...styles,
            backgroundColor: "#ddd",
            color: "#333",
        }),
        multiValueLabel: (styles: any) => ({
            ...styles,
            color: "#333",
        }),
        multiValueRemove: (styles: any) => ({
            ...styles,
            color: "#333",
            ":hover": {
                backgroundColor: "#bbb",
                color: "#333",
            },
        }),
        singleValue: (styles: any) => ({
            ...styles,
            color: "#d1d5db", // : "#0b0e0e"
        }),
        placeholder: (provided: any) => ({
            ...provided,
            color: "#9ca3af",
        }),
    };

    // Seleccionar el estilo según el tema
    const selectedStyles = themeDark ? darkThemeStyles : lightThemeStyles;

    return (
        <Select
            id={id}
            name={name}
            value={multiple ? valueMultiple : value} // Este es el valor seleccionado
            onChange={onChange} // Manejar el cambio
            options={options}
            className="w-full mt-1 block"
            maxMenuHeight={160}
            isMulti={multiple}
            styles={selectedStyles}
            required
        />
    );
});
