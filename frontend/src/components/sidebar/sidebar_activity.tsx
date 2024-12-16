// Import frameworks
import { useState } from 'react';
// Import components
import { Button } from '../ui/button';
import {
import { mockUserEvents } from '@/mocks/MockData';
import AddEventItemsDialog from '../dialogs/createEventItems';
import AddEvent from '../dialogs/createEvent';

const SideBarActivity = () => {
  const [events, setEvents] = useState(mockUserEvents); // State for managing events list

  // Initialize state for managing open/close for each category
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
    {
      Courses: false,
      Activities: false,
      // Add more categories as needed
    },
  );

  // Function to toggle the open state of a category
  const toggleCategory = (category: string) => {
    setOpenCategories((prevState) => ({
      ...prevState,
      [category]: !prevState[category],
    }));
  };

  // Function to handle new category submission
  const handleAddNewCategory = (name: string) => {
    if (!name.trim()) return; // Prevent empty category names
    const newCategory = {
      id: `cat-${Date.now()}`, // Unique ID using current timestamp
      name: name,
      item: [], // Initialize with an empty item list
    };
    setEvents([...events, newCategory]); // Update events with the new category
  };

  const handleAddEvenItem = (
    categoryId: string,
    newEventItemTitle: string,
    newEventItemColor: string,
    newEventItemTextColor: string,
  ) => {
    // Find the category by its ID
    const categoryIndex = events.findIndex(
      (eventCategory) => eventCategory.id === categoryId,
    );
    if (categoryIndex === -1) return; // Category not found

    // Create a new event item with a unique ID
    const newEventItem = {
      id: `event-${Date.now()}`, // Unique ID using current timestamp
      title: newEventItemTitle,
      backgroundColor: newEventItemColor,
      textColor: newEventItemTextColor, // Optional text color
    };

    // Create a copy of the events array and push the new item to the top of the corresponding category's item list
    const updatedEvents = [...events];
    updatedEvents[categoryIndex].item.unshift(newEventItem); // Add to the top of the list

    setEvents(updatedEvents); // Update state with the new events array
  };

                </div>
                {/* Render DraggableItems for each item in the category */}
                {eventCategory.item.slice(0, 4).map((item) => (
                  <DraggableItem
                    key={item.id} // Added key to each DraggableItem
                    id={item.id}
                    title={item.title}
                    type={'activity'} // Use category title to determine type
                    description=""
                    startTime=""
                    endTime=""
                    date=""
                    duration={60}
                    category={eventCategory}
                    backgroundColor={item.backgroundColor}
                    textColor={item.textColor || ''} // Optional text color
                  />
                ))}
                {/* Collapsible Content */}
                <CollapsibleContent className="space-y-2">
                  {eventCategory.item.slice(4).map((item) => (
                    <DraggableItem
                      key={item.id} // Added key to each DraggableItem
                      id={item.id}
                      title={item.title}
                      type={'activity'}
                      description=""
                      startTime=""
                      endTime=""
                      date=""
                      duration={60}
                      category={eventCategory}
                      backgroundColor={item.backgroundColor}
                      textColor={item.textColor || ''}
                    />
                  ))}
                </CollapsibleContent>
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2 items-center">
                    {eventCategory.item.length > 4 && (
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm" className="p-0">
                          <div className="flex items-center space-x-1 px-2">
                            <h4 className="text-[12px] text-indigo-600">
                              {openCategories[eventCategory.name]
                                ? 'Show less'
                                : `Show more (${eventCategory.item.length - 4})`}
                            </h4>
                          </div>
                        </Button>
                      </CollapsibleTrigger>
                    )}
                    {eventCategory.item.length <= 4 && (
                      <h4 className="text-[12px] text-gray-500">
                        {eventCategory.item.length === 0
                          ? 'No items to display'
                          : `All ${eventCategory.item.length} items are shown`}
                      </h4>
                    )}
                  </div>
                </div>
              </Collapsible>
              <hr
                className={`my-2 border-[1px] ${index === events.length - 1 ? 'hidden' : ''}`}
              />
            </div>
        </div>
      </div>
      <div className="absolute p-2 bg-indigo-200 rounded-md -right-4 top-2 hover:cursor-pointer">
        <FaChevronLeft />
      </div>
    </div>
  );
};

export default SideBarActivity;
