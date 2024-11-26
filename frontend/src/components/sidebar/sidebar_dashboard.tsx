//Import frameworks
import { useState } from 'react'

//Import icons
import { TbDragDrop2 } from "react-icons/tb";
import { ChevronsUpDown } from "lucide-react"
import { MdFolderOpen } from "react-icons/md";
import { FaChevronLeft } from "react-icons/fa";
import { FiPlusCircle } from "react-icons/fi";

//Import components
import { Button } from "../../components/ui/button"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "../../components/ui/collapsible";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../../components/ui/dialog"
import DraggableItem from '../draggable/DraggableItem';
import { mockUserEvents } from '@/mocks/MockData';
import { Label } from '../ui/label';
import { Input } from '../ui/input';

const SideBarDashboard = () => {
    // Initialize state for managing open/close for each category
    const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
        Courses: false,
        Activities: false,
        // Add more categories as needed
    });

    // Function to toggle the open state of a category
    const toggleCategory = (category: string) => {
        setOpenCategories((prevState) => ({
            ...prevState,
            [category]: !prevState[category],
        }));
    };

    const [newCategoryName, setNewCategoryName] = useState<string>(''); // State to manage new category name
    const [events, setEvents] = useState(mockUserEvents); // State for managing events list

    const [newEventItemTitle, setNewEventItemTitle] = useState<string>('');
    const [selectedColor, setSelectedColor] = useState<string>('');

    // Function to handle new category submission
    const handleAddNewCategory = () => {
        if (!newCategoryName.trim()) return; // Prevent empty category names

        const newCategory = {
            id: `cat-${Date.now()}`, // Unique ID using current timestamp
            name: newCategoryName,
            item: [], // Initialize with an empty item list
        };

        setEvents([...events, newCategory]); // Update events with the new category
        setNewCategoryName(''); // Clear input field after submission
    };

    const handleAddEvent = (categoryId: string, eventData: { title: string, backgroundColor: string, textColor?: string }) => {
        // Find the category by its ID
        const categoryIndex = events.findIndex((eventCategory) => eventCategory.id === categoryId);
        if (categoryIndex === -1) return; // Category not found

        // Create a new event item with a unique ID
        const newEventItem = {
            id: `event-${Date.now()}`, // Unique ID using current timestamp
            title: eventData.title,
            backgroundColor: eventData.backgroundColor,
            textColor: eventData.textColor || '', // Optional text color
        };

        // Create a copy of the events array and push the new item to the top of the corresponding category's item list
        const updatedEvents = [...events];
        updatedEvents[categoryIndex].item.unshift(newEventItem); // Add to the top of the list

        setEvents(updatedEvents); // Update state with the new events array
    };

    const handleColorSelect = (color: string) => {
        setSelectedColor(color);
    };

    const getButtonClasses = (color: string) => {
        return selectedColor === color
            ? 'p-0.5 rounded-md focus:outline-1 focus:ring-1 focus:ring-black' // Highlight selected
            : 'p-0.5 rounded-md'; // Default style
    };


    return (
        <div className='flex flex-col w-[14%] h-full relative'>
            <div className="w-full h-full flex flex-col px-2 py-1 border-r-[1px] border-indigo-100 relative overflow-y-hidden">
                <Dialog>
                    <DialogTrigger asChild>
                        <div>
                            <button className="flex justify-between items-center p-1.5 w-[90%] bg-gradient-to-t from-indigo-500 to-blue-400 text-white rounded-lg">
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
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
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
                                onClick={handleAddNewCategory}>
                                Confirm
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                <hr className="my-2 border-[1px]" />
                <div className="px-2 overflow-y-auto custom-scrollbar">
                    {events.map((eventCategory, index) => (
                        <>
                            <Collapsible
                                key={eventCategory.id}
                                open={openCategories[eventCategory.name] || false}
                                onOpenChange={() => toggleCategory(eventCategory.name)} // Toggle the category's open state
                                className="w-full space-y-2"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex space-x-2 items-center">
                                        <CollapsibleTrigger asChild>
                                            <Button variant="ghost" size="sm" className="p-0">
                                                <ChevronsUpDown className="h-4 w-4" />
                                                <span className="sr-only">Toggle</span>
                                            </Button>
                                        </CollapsibleTrigger>
                                        <div className="flex items-center space-x-1">
                                            <MdFolderOpen />
                                            <h4 className="text-sm font-semibold">
                                                {eventCategory.name}
                                            </h4>
                                        </div>
                                    </div>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <div>
                                                <button className="flex text-sm font-semibold text-indigo-600 hover:cursor-pointer">
                                                    <FiPlusCircle className="size-5 mr-1" />
                                                    Add
                                                </button>
                                            </div>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Add New Event In {eventCategory.name}</DialogTitle>
                                                <DialogDescription>
                                                    Create a new event for you to track.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="grid gap-4 py-4">
                                                <div className="grid grid-cols-4 items-center gap-4">
                                                    <Label htmlFor="name" className="text-left">
                                                        Name
                                                    </Label>
                                                    <Input
                                                        id="name"
                                                        placeholder='How you want to call it'
                                                        value={newEventItemTitle}
                                                        onChange={(e) => setNewEventItemTitle(e.target.value)}
                                                        className="col-span-3"
                                                    />
                                                </div>
                                                <Label htmlFor="name" className="text-left">
                                                    Color Badge
                                                </Label>
                                                <div className='flex flex-col col-span-3 row-span-2 gap-2'>
                                                    <div className='flex gap-2'>
                                                        <button
                                                            className={getButtonClasses('yellow')}
                                                            onClick={() => handleColorSelect('yellow')}
                                                        >
                                                            <div className='w-8 h-6 bg-yellow-100 rounded-md border' />
                                                        </button>
                                                        <button
                                                            className={getButtonClasses('orange')}
                                                            onClick={() => handleColorSelect('orange')}
                                                        >
                                                            <div className='w-8 h-6 bg-orange-100 rounded-md border' />
                                                        </button>
                                                        <button
                                                            className={getButtonClasses('red')}
                                                            onClick={() => handleColorSelect('red')}
                                                        >
                                                            <div className='w-8 h-6 bg-red-100 rounded-md border' />
                                                        </button>
                                                        <button
                                                            className={getButtonClasses('purple')}
                                                            onClick={() => handleColorSelect('purple')}
                                                        >
                                                            <div className='w-8 h-6 bg-purple-100 rounded-md border' />
                                                        </button>
                                                        <button
                                                            className={getButtonClasses('pink')}
                                                            onClick={() => handleColorSelect('pink')}
                                                        >
                                                            <div className='w-8 h-6 bg-pink-100 rounded-md border' />
                                                        </button>
                                                    </div>
                                                    <div className='flex gap-2'>
                                                        <button
                                                            className={getButtonClasses('cyan')}
                                                            onClick={() => handleColorSelect('cyan')}
                                                        >
                                                            <div className='w-8 h-6 bg-cyan-100 rounded-md border' />
                                                        </button>
                                                        <button
                                                            className={getButtonClasses('green')}
                                                            onClick={() => handleColorSelect('green')}
                                                        >
                                                            <div className='w-8 h-6 bg-green-100 rounded-md border' />
                                                        </button>
                                                        <button
                                                            className={getButtonClasses('sky')}
                                                            onClick={() => handleColorSelect('sky')}
                                                        >
                                                            <div className='w-8 h-6 bg-sky-100 rounded-md border' />
                                                        </button>
                                                        <button
                                                            className={getButtonClasses('gray')}
                                                            onClick={() => handleColorSelect('gray')}
                                                        >
                                                            <div className='w-8 h-6 bg-gray-100 rounded-md border' />
                                                        </button>
                                                        <button
                                                            className={getButtonClasses('emerald')}
                                                            onClick={() => handleColorSelect('emerald')}
                                                        >
                                                            <div className='w-8 h-6 bg-emerald-100 rounded-md border' />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <Button
                                                    type="submit"
                                                    onClick={() => {
                                                        // Assuming categoryId is the ID of the current category
                                                        handleAddEvent(eventCategory.id, { title: newCategoryName, backgroundColor: 'yellow' });
                                                    }}>
                                                    Confirm
                                                </Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                                {/* Render DraggableItems for each item in the category */}
                                {eventCategory.item.slice(0, 4).map((item) => (
                                    <DraggableItem
                                        key={item.id}
                                        id={item.id}
                                        title={item.title}
                                        type={'activity'} // Use category title to determine type
                                        description=""
                                        startTime=""
                                        endTime=""
                                        date=""
                                        duration={60}
                                        backgroundColor={item.backgroundColor}
                                        textColor={item.textColor || ""} // Optional text color
                                    />
                                ))}
                                {/* Collapsible Content */}
                                <CollapsibleContent className="space-y-2">
                                    {eventCategory.item.slice(4).map((item) => (
                                        <DraggableItem
                                            key={item.id}
                                            id={item.id}
                                            title={item.title}
                                            type={'activity'}
                                            description=""
                                            startTime=""
                                            endTime=""
                                            date=""
                                            duration={60}
                                            backgroundColor={item.backgroundColor}
                                            textColor={item.textColor || ""}
                                        />
                                    ))}
                                </CollapsibleContent>
                            </Collapsible>
                            <hr
                                className={`my-5 border-[1px] ${index === events.length - 1 ? 'hidden' : ''}`}
                            />
                        </>
                    ))}
                </div>
            </div>
            <div className='absolute p-2 bg-indigo-200 rounded-md -right-4 top-2 hover:cursor-pointer'>
                <FaChevronLeft />
            </div>
        </div>
    )
}

export default SideBarDashboard