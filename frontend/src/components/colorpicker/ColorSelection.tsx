import React from 'react';

interface ColorPickerProps {
  selectedColor: string;
  onColorSelect: (color: string) => void;
}

const colors = [
  'yellow', 'amber', 'orange', 'rose', 'red', 'purple', 'pink',
  'lime', 'green', 'emerald', 'cyan', 'sky',
];

const ColorPicker: React.FC<ColorPickerProps> = ({ selectedColor, onColorSelect }) => {
  const getButtonClasses = (color: string) =>
    selectedColor === color
      ? 'p-0.5 rounded-md outline-1 ring-1 ring-black'
      : 'p-0.5 rounded-md';

  return (
    <div className="flex flex-wrap gap-2 justify-between w-[65%]">
      {colors.map((color) => (
        <button
          key={color}
          className={getButtonClasses(color)}
          onClick={() => onColorSelect(color)}
        >
          <div className={`w-8 h-6 bg-${color}-100 rounded-md border`} />
        </button>
      ))}
    </div>
  );
};

export default ColorPicker;
