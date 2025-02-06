import React from "react";

interface DifficultyButtonProps {
  label: string;
  value: string;
  selected: boolean;
  onSelect: (value: string) => void;
}

const DifficultyButton: React.FC<DifficultyButtonProps> = ({
  label,
  value,
  selected,
  onSelect,
}) => {
  return (
    <button
      onClick={() => onSelect(value)}
      className={`px-4 py-2 rounded border-2 transition-colors duration-200 ${
        selected
          ? "bg-blue-500 text-white border-blue-700"
          : "bg-gray-300 border-gray-500 hover:bg-gray-400"
      }`}
    >
      {label}
    </button>
  );
};

export default DifficultyButton;
