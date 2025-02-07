import React, { useState } from "react";

type RadioInputProps = {
  label: string;
  name: string;
  value: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const RadioInput: React.FC<RadioInputProps> = ({ label, name, value, checked, onChange }) => {
  return (
    <label className="flex items-center space-x-2 cursor-pointer">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="hidden"
      />
      <div
        className={`w-5 h-5 border-2 rounded-full flex items-center justify-center
          ${checked ? "border-cyan-500" : "border-gray-400"}`}
      >
        {checked && <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>}
      </div>
      <span className="text-gray-700 dark:text-gray-300">{label}</span>
    </label>
  );
};

export default RadioInput