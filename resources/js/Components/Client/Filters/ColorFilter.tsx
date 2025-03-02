import { ColorsInterface } from "@/Interfaces/Product";
import React from "react";

interface ColorFilterProps {
  colors: ColorsInterface[];
  selectedColors: number[];
  onColorChange: (name: number) => void;
  onSelectAll: () => void;
}

const ColorFilter: React.FC<ColorFilterProps> = ({ colors, selectedColors, onColorChange, onSelectAll }) => {
  const allSelected = selectedColors.length === colors.length;

  return (
    <div className="mb-10">
      <h4 className="text-lg font-bold mb-4">Filtro por Color</h4>
      <div className="flex flex-wrap gap-2">
        {/* Botón para seleccionar/deseleccionar todos los colores */}
        <button
          onClick={onSelectAll}
          className={`px-3 py-1 text-sm font-medium rounded-md transition ${
            allSelected ? "bg-red-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {allSelected ? "Deseleccionar todos" : "Seleccionar todos"}
        </button>

        {colors.map((color) => (
          <label key={color.name} className="relative cursor-pointer">
            <input
              type="checkbox"
              value={color.name}
              checked={selectedColors.includes(color.id)}
              onChange={() => onColorChange(color.id)}
              className="hidden"
            />
            <span
              className={`w-8 h-8 block rounded-full border-2 transition ${
                selectedColors.includes(color.id) ? "border-black scale-110" : "border-gray-300"
              }`}
              style={{ backgroundColor: color.codigo_hex }}
            ></span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default ColorFilter;
