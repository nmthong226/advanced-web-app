import React, { useState } from "react";
//Import icons

//Import components
import { Button } from "../ui/button"
import {
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog"
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import ColorPicker from "../colorpicker/ColorSelection";

interface EditEventDialogProps {
    eventCategory: { id: string; name: string };
    eventItem: { id: string; title: string; backgroundColor: string; textColor: string }
    onEditEventItem: (categoryId: string, title: string, color: string, textColor: string) => void;
}

const EditEventItemsDialog: React.FC<EditEventDialogProps> = ({ eventCategory, eventItem, onEditEventItem }) => {
    const [selectedColor, setSelectedColor] = useState<string>('');
    const [newEventItemTitle, setNewEventItemTitle] = useState<string>('');
    const [newEventItemColor, setNewEventItemColor] = useState<string>('');
    const [newEventItemTextColor, setNewEventItemTextColor] = useState<string>('');

    const handleAddEvent = () => {
        if (!newEventItemTitle || !selectedColor) {
            alert("Please fill out all fields!");
            return;
        }
        onEditEventItem(eventCategory.id, newEventItemTitle, newEventItemColor, newEventItemTextColor);
        setNewEventItemTitle("");
        setSelectedColor("");
    };

    const handleColorSelect = (color: string) => {
        setSelectedColor(color);
        switch (color) {
            case 'yellow':
                setNewEventItemColor('bg-yellow-100 border-l-[5px] border-l-yellow-600');
                setNewEventItemTextColor('text-yellow-500');
                break;
            case 'amber':
                setNewEventItemColor('bg-amber-100 border-l-[5px] border-l-amber-600');
                setNewEventItemTextColor('text-amber-500');
                break;
            case 'orange':
                setNewEventItemColor('bg-orange-100 border-l-[5px] border-l-orange-600');
                setNewEventItemTextColor('text-orange-500');
                break;
            case 'rose':
                setNewEventItemColor('bg-rose-100 border-l-[5px] border-l-rose-600');
                setNewEventItemTextColor('text-rose-500');
                break;
            case 'red':
                setNewEventItemColor('bg-red-100 border-l-[5px] border-l-red-600');
                setNewEventItemTextColor('text-red-500');
                break;
            case 'cyan':
                setNewEventItemColor('bg-cyan-100 border-l-[5px] border-l-cyan-600');
                setNewEventItemTextColor('text-cyan-500');
                break;
            case 'sky':
                setNewEventItemColor('bg-sky-100 border-l-[5px] border-l-sky-600');
                setNewEventItemTextColor('text-sky-500');
                break;
            case 'blue':
                setNewEventItemColor('bg-blue-100 border-l-[5px] border-l-blue-600');
                setNewEventItemTextColor('text-blue-500');
                break;
            case 'lime':
                setNewEventItemColor('bg-lime-100 border-l-[5px] border-l-lime-600');
                setNewEventItemTextColor('text-lime-500');
                break;
            case 'green':
                setNewEventItemColor('bg-green-100 border-l-[5px] border-l-green-600');
                setNewEventItemTextColor('text-green-500');
                break;
            case 'emerald':
                setNewEventItemColor('bg-emerald-100 border-l-[5px] border-l-emerald-600');
                setNewEventItemTextColor('text-emerald-500');
                break;
            case 'purple':
                setNewEventItemColor('bg-purple-100 border-l-[5px] border-l-purple-600');
                setNewEventItemTextColor('text-purple-500');
                break;
            case 'pink':
                setNewEventItemColor('bg-pink-100 border-l-[5px] border-l-pink-600');
                setNewEventItemTextColor('text-pink-500');
                break;
            case 'gray':
                setNewEventItemColor('bg-gray-100 border-l-[5px] border-l-gray-600');
                setNewEventItemTextColor('text-gray-500');
                break;
            default:
                setNewEventItemColor('');
        }
    };

    return (
        <DialogContent className="w-[425px]">
            <DialogHeader>
                <DialogTitle>Edit {eventItem.title} In {eventCategory.name}</DialogTitle>
                <DialogDescription>Create a new event for you to track.</DialogDescription>
            </DialogHeader>
            <div className="gap-4 grid">
                <div className={`flex w-full px-3 py-2 h-10 items-center font-mono ${eventItem.backgroundColor}`}>
                    <p>{eventItem.title}</p>
                </div>
                <div className="items-center gap-4 grid grid-cols-4">
                    <Label htmlFor="name" className="text-left">
                        Name<span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="name"
                        placeholder={eventItem.title}
                        value={newEventItemTitle}
                        onChange={(e) => setNewEventItemTitle(e.target.value)}
                        className="col-span-3"
                    />
                </div>
                <div className="items-center gap-2 grid grid-cols-4">
                    <Label htmlFor="color" className="text-left">
                        Color <span className="text-red-500">*</span>
                    </Label>
                    <div className="col-span-3">
                        <ColorPicker selectedColor={selectedColor} onColorSelect={handleColorSelect} />
                    </div>
                </div>
                <span className='text-end text-xs italic'>* required</span>
            </div>
            <DialogFooter>
                <Button type="submit" onClick={handleAddEvent}>
                    Edit Event
                </Button>
            </DialogFooter>
        </DialogContent>
    );
};

export default EditEventItemsDialog
