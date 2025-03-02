import React, { useState, useEffect } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

interface RangeFilterProps {
    onPriceChange: (values: { min: number; max: number }) => void;
    onPriceRange: { min: number; max: number };
}

const PriceRangeSlider: React.FC<RangeFilterProps> = ({ onPriceChange, onPriceRange }) => {
    const [priceRange, setPriceRange] = useState<[number, number]>([onPriceRange.min, onPriceRange.max]);

    // Actualiza el estado local cuando cambian las props onPriceRange
    useEffect(() => {
        setPriceRange([onPriceRange.min, onPriceRange.max]);
    }, [onPriceRange.min, onPriceRange.max]);

    const handleSliderChange = (value: number | number[]) => {
        if (Array.isArray(value)) {
            setPriceRange(value as [number, number]); // Actualiza el estado local
            onPriceChange({ min: value[0], max: value[1] }); // Llama a onPriceChange con el formato correcto
        }
    };

    const handleInputChange = (index: number, value: number) => {
        const newPriceRange = [...priceRange];
        newPriceRange[index] = value;
        setPriceRange(newPriceRange as [number, number]); // Actualiza el estado local
        onPriceChange({ min: newPriceRange[0], max: newPriceRange[1] }); // Llama a onPriceChange con el formato correcto
    };

    return (
        <div className="sidebar__filter relative mb-15">
            <div className="section-title mb-9">
                <h4 className="text-lg font-bold">Buscar por Precio</h4>
            </div>
            {/* Slider */}
            <Slider
                range
                min={10}
                max={1000}
                value={priceRange}
                onChange={handleSliderChange} // Usa handleSliderChange
                trackStyle={[{ backgroundColor: "#000" }]}
                handleStyle={[{ borderColor: "#000" }, { borderColor: "#000" }]}
            />

            {/* Inputs */}
            <div className="flex justify-between items-center mt-4">
                <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) =>
                        handleInputChange(0, +e.target.value)
                    }
                    className="text-base max-w-[25%] border border-gray-300 rounded-sm px-2 py-1"
                />
                <span className="text-base font-medium">-</span>
                <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) =>
                        handleInputChange(1, +e.target.value)
                    }
                    className="text-base max-w-[25%] border border-gray-300 rounded-sm px-2 py-1"
                />
            </div>
        </div>
    );
};

export default PriceRangeSlider;
