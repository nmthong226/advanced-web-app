import { useState } from "react";
import { Label } from "../ui/label";

const ColorSelection = () => {
    const [selectedColor, setSelectedColor] = useState<string>(''); // Store selected color

    // Function to handle color selection
    const handleColorSelect = (color: string) => {
        setSelectedColor(color); // Update selected color
    };

    // Function to get dynamic classes for the selected button
    const getButtonClasses = (color: string) => {
        return selectedColor === color
            ? 'p-0.5 rounded-md focus:outline-1 focus:ring-1 focus:ring-black' // Highlight selected
            : 'p-0.5 rounded-md'; // Default style
    };

    return (
        <div className="grid grid-cols-4 grid-rows-2 items-center gap-4">
            
        </div>
    );
};

export default ColorSelection;
