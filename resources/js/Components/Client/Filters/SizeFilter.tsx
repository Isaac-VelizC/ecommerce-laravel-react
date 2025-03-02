import { SizesInterface } from "@/Interfaces/Product";
import React from "react";

interface SizeFilterProps {
  sizes: SizesInterface[];
  selectedSizes: number[];
  onSizeChange: (id: number) => void;
  onSelectAll: () => void;
}

const SizeFilter: React.FC<SizeFilterProps> = ({ sizes, selectedSizes, onSizeChange, onSelectAll }) => {
  const allSelected = selectedSizes.length === sizes.length;

  return (
    <div className="mb-10">
      <h4 className="text-lg font-bold mb-4">Filtro por Talla</h4>
      <div className="flex flex-wrap gap-2">
        {/* Botón para seleccionar/deseleccionar todas las tallas */}
        <button
          onClick={onSelectAll}
          className={`px-3 py-1 text-sm font-medium rounded-md transition ${
            allSelected ? "bg-red-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {allSelected ? "Deseleccionar todas" : "Seleccionar todas"}
        </button>

        {sizes.map((size) => (
          <label
            key={size.id}
            className={`cursor-pointer px-3 py-1 border rounded-md text-sm uppercase transition 
            ${selectedSizes.includes(size.id) ? "bg-black text-white border-black" : "border-gray-400 text-gray-700 hover:bg-gray-200"}`}
          >
            <input
              type="checkbox"
              value={size.id}
              checked={selectedSizes.includes(size.id)}
              onChange={() => onSizeChange(size.id)}
              className="hidden"
            />
            {size.name}
          </label>
        ))}
      </div>
    </div>
  );
};

export default SizeFilter;
