// //Import frameworks
// import { useState } from 'react'

// //Import icons
// import { ChevronsUpDown } from "lucide-react"
// import { MdFolderOpen } from "react-icons/md";

// //Import components
// import { Button } from "../ui/button"
// import {
//     Collapsible,
//     CollapsibleContent,
//     CollapsibleTrigger,
// } from "../ui/collapsible";
// import DraggableActivity from '../draggable/Activity/DraggableActivity';
// import { mockUserEvents } from '@/mocks/MockData';
// import AddEventItemsDialog from '../dialogs/createEventItems';
// import AddEvent from '../dialogs/createEvent';

// const SideBarActivity = () => {
//     const [events, setEvents] = useState(mockUserEvents); // State for managing events list

//     // Initialize state for managing open/close for each category
//     const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
//         Courses: false,
//         Activities: false,
//         // Add more categories as needed
//     });

//     // Function to toggle the open state of a category
//     const toggleCategory = (category: string) => {
//         setOpenCategories((prevState) => ({
//             ...prevState,
//             [category]: !prevState[category],
//         }));
//     };

//     // Function to handle new category submission
//     const handleAddNewCategory = (name: string) => {
//         if (!name.trim()) return; // Prevent empty category names
//         const newCategory = {
//             id: `cat-${Date.now()}`, // Unique ID using current timestamp
//             name: name,
//             item: [], // Initialize with an empty item list
//         };
//         setEvents([...events, newCategory]); // Update events with the new category
//     };

//     const handleAddEvenItem = (categoryId: string, newEventItemTitle: string, newEventItemColor: string, newEventItemTextColor: string) => {
//         // Find the category by its ID
//         const categoryIndex = events.findIndex((eventCategory) => eventCategory.id === categoryId);
//         if (categoryIndex === -1) return; // Category not found

//         // Create a new event item with a unique ID
//         const newEventItem = {
//             id: `event-${Date.now()}`, // Unique ID using current timestamp
//             title: newEventItemTitle,
//             backgroundColor: newEventItemColor,
//             textColor: newEventItemTextColor, // Optional text color
//         };

//         // Create a copy of the events array and push the new item to the top of the corresponding category's item list
//         const updatedEvents = [...events];
//         updatedEvents[categoryIndex].item.unshift(newEventItem); // Add to the top of the list

//         setEvents(updatedEvents); // Update state with the new events array
//     };

//     return (
//         <div className='relative flex flex-col bg-white border rounded-lg w-[16%] h-full'>
//             <div className="relative flex flex-col border-indigo-100 px-2 py-2 border-r-[1px] w-full h-full overflow-x-hidden overflow-y-hidden">
//                 <AddEvent onAddEvent={handleAddNewCategory} />
//                 <hr className="border-[1px] my-2" />
//                 <div className="custom-scrollbar overflow-y-auto">
//                     {events.map((eventCategory, index) => (
//                         <>
//                             <Collapsible
//                                 key={eventCategory.id}
//                                 open={openCategories[eventCategory.name] || false}
//                                 onOpenChange={() => toggleCategory(eventCategory.name)} // Toggle the category's open state
//                                 className="space-y-2 w-full"
//                             >
//                                 <div className="flex justify-between items-center">
//                                     <div className="flex items-center">
//                                         <CollapsibleTrigger asChild>
//                                             <Button variant="ghost" size="sm" className="m-0 p-0">
//                                                 <ChevronsUpDown className="w-4 h-4" />
//                                                 <span className="sr-only">Toggle</span>
//                                             </Button>
//                                         </CollapsibleTrigger>
//                                         <div className="flex items-center space-x-2">
//                                             <MdFolderOpen />
//                                             <h4 className="font-semibold text-sm">
//                                                 {eventCategory.name}
//                                             </h4>
//                                         </div>
//                                     </div>
//                                     <AddEventItemsDialog eventCategory={eventCategory} onAddEvent={handleAddEvenItem} />
//                                 </div>
//                                 {/* Render DraggableActivity for each item in the category */}
//                                 {eventCategory.item.slice(0, 4).map((item) => (
//                                     <DraggableActivity
//                                         key={item.id}
//                                         id={item.id}
//                                         title={item.title}
//                                         type={'activity'} // Use category title to determine type
//                                         description=""
//                                         startTime=""
//                                         endTime=""
//                                         date=""
//                                         duration={60}
//                                         category={eventCategory}
//                                         backgroundColor={item.backgroundColor}
//                                         textColor={item.textColor || ""} // Optional text color
//                                     />
//                                 ))}
//                                 {/* Collapsible Content */}
//                                 <CollapsibleContent className="space-y-2">
//                                     {eventCategory.item.slice(4).map((item) => (
//                                         <DraggableActivity
//                                             key={item.id}
//                                             id={item.id}
//                                             title={item.title}
//                                             type={'activity'}
//                                             description=""
//                                             startTime=""
//                                             endTime=""
//                                             date=""
//                                             duration={60}
//                                             category={eventCategory}
//                                             backgroundColor={item.backgroundColor}
//                                             textColor={item.textColor || ""}
//                                         />
//                                     ))}
//                                 </CollapsibleContent>
//                                 <div className="flex justify-between items-center">
//                                     <div className="flex items-center space-x-2">
//                                         {eventCategory.item.length > 4 && (
//                                             <CollapsibleTrigger asChild>
//                                                 <Button variant="ghost" size="sm" className="p-0">
//                                                     <div className="flex items-center space-x-1 px-2">
//                                                         <h4 className="text-[12px] text-indigo-600">
//                                                             {openCategories[eventCategory.name]
//                                                                 ? "Show less"
//                                                                 : `Show more (${eventCategory.item.length - 4})`}
//                                                         </h4>
//                                                     </div>
//                                                 </Button>
//                                             </CollapsibleTrigger>
//                                         )}
//                                         {eventCategory.item.length <= 4 && (
//                                             <h4 className="text-[12px] text-gray-500">
//                                                 {eventCategory.item.length === 0
//                                                     ? "No items to display"
//                                                     : `All ${eventCategory.item.length} items are shown`}
//                                             </h4>
//                                         )}
//                                     </div>
//                                 </div>
//                             </Collapsible>
//                             <hr
//                                 className={`my-2 border-[1px] ${index === events.length - 1 ? 'hidden' : ''}`}
//                             />
//                         </>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default SideBarActivity