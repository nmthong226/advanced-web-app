//Import frameworks
import React, { useState } from 'react'

//Import components
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog"
import { Label } from '../ui/label';
import { Input } from '../ui/input';

//Import icons
import { TbDragDrop2 } from 'react-icons/tb';
import { Button } from '../ui/button';

interface AddEventDialogProps {
    onAddEvent: (eventCategory: string ) => void;
}

const AddEvent: React.FC<AddEventDialogProps> = ({ onAddEvent }) => {
    const [newCategoryName, setNewCategoryName] = useState<string>(''); // State to manage new category name
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleAddEvent = () => {
        if (!newCategoryName) {
            alert("Please fill out all fields!");
            return;
        }
        onAddEvent(newCategoryName);
        setNewCategoryName("");
        setIsDialogOpen(false);
    };
    
    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <div>
                    <button className="flex justify-between items-center bg-gradient-to-t from-indigo-500 to-blue-400 p-1.5 rounded-lg w-full text-white">
                        <p>Add an event</p>
                        <TbDragDrop2 className="size-5" />
                    </button>
                </div>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Event Category</DialogTitle>
                    <DialogDescription>
                        Create a new category to help organize your events.
                    </DialogDescription>
                </DialogHeader>
                <div className="gap-4 grid py-4">
                    <div className="items-center gap-4 grid grid-cols-4">
                        <Label htmlFor="name" className="text-left">
                            Name
                        </Label>
                        <Input
                            id="name"
                            placeholder='How you want to call it'
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        type="submit"
                        onClick={handleAddEvent}>
                        Confirm
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default AddEvent