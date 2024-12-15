import { useState } from 'react';

// Import components
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "../../components/ui/dialog";

// Import icons
import { MdViewQuilt } from "react-icons/md";
import { GrLanguage } from "react-icons/gr";
import { HiOutlineCog6Tooth } from 'react-icons/hi2';

//Import context
import { useSettings } from '@/contexts/SettingsContext';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('General'); // Track active tab
    const { settings, setSettings } = useSettings();

    const handleToggle = (key: keyof typeof settings) => {
        setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <div>
                    <HiOutlineCog6Tooth className="w-6 h-6" />
                </div>
            </DialogTrigger>
            <DialogContent className="flex gap-0 bg-[#F7F7F7] p-0 sm:rounded-xl max-w-[880px] h-[700px]" overlayBgColor="bg-black/70">
                {/* Sidebar */}
                <div className="flex flex-col bg-white rounded-r-none rounded-xl w-[25%]">
                    <div className='flex flex-col p-6 pb-0'>
                        <p className="font-semibold text-2xl">Settings</p>
                        <p className="text-sm">Manage your application.</p>
                    </div>
                    <div className="flex flex-col space-y-1 p-3">
                        <button
                            onClick={() => setActiveTab('General')}
                            className={`flex items-center text-left space-x-2 px-2 h-8 rounded-md outline-none ${activeTab === 'General' ? 'bg-[#E6E6E6]' : 'hover:bg-gray-100'}`}
                        >
                            <GrLanguage className='size-3' />
                            <p className='font-medium text-[12px]'>General</p>
                        </button>
                        <button
                            onClick={() => setActiveTab('UI')}
                            className={`flex items-center text-left space-x-2 px-2 h-8 rounded-md ${activeTab === 'UI' ? 'bg-[#E6E6E6]' : 'hover:bg-gray-100'}`}
                        >
                            <MdViewQuilt className='size-3' />
                            <p className='font-medium text-[12px]'>Personal Config</p>
                        </button>
                    </div>
                </div>
                {/* Content Area */}
                <div className="flex flex-col bg-white shadow-lg p-6 rounded-xl w-[75%]">
                    {activeTab === 'General' && (
                        <div className='flex flex-col p-1'>
                            <h2 className="font-bold text-base">General Settings</h2>
                            <hr className='my-3' />
                            <p className='font-semibold text-gray-700 text-sm'>Theme</p>
                        </div>
                    )}
                    {activeTab === 'UI' && (
                        <div className='flex flex-col p-1'>
                            <h2 className="font-bold text-base">Personal Configuration</h2>
                            <hr className='my-3' />
                            <div className='flex flex-col space-y-2'>
                                <div className='flex flex-col'>
                                    <p className='flex font-semibold text-sm'>Greetings</p>
                                    <span className='text-[12px] text-gray-500'>This section shows you the overview of the current time, period.</span>
                                    <label className='flex items-center space-x-2'>
                                        <input
                                            type="checkbox"
                                            checked={settings.showGreetings}
                                            onChange={() => handleToggle('showGreetings')}
                                        />
                                        <span className='text-sm'>Show Greetings</span>
                                    </label>
                                </div>
                                <hr className='my-3' />
                                <div className='flex flex-col'>
                                    <p className='flex font-semibold text-sm'>Upcoming Events</p>
                                    <span className='text-[12px] text-gray-500'>This section shows you the overview of next event, including activities and tasks.</span>
                                    <label className='flex items-center space-x-2'>
                                        <input
                                            type="checkbox"
                                            checked={settings.showUpcoming}
                                            onChange={() => handleToggle('showUpcoming')}
                                        />
                                        <span className='text-sm'>Show Upcoming</span>
                                    </label>
                                </div>
                                <hr className='my-3' />
                                <div className='flex flex-col'>
                                    <p className='flex font-semibold text-sm'>Task Overview</p>
                                    <span className='text-[12px] text-gray-500'>This section gives you insights for the current task list.</span>
                                    <label className='flex items-center space-x-2'>
                                        <input
                                            type="checkbox"
                                            checked={settings.showTaskOverview}
                                            onChange={() => handleToggle('showTaskOverview')}
                                        />
                                        <span className='text-sm'>Show Task Overview</span>
                                    </label>
                                </div>
                                <hr className='my-3' />
                                <div className='flex flex-col'>
                                    <p className='flex font-semibold text-sm'>Productivity Insights</p>
                                    <span className='text-[12px] text-gray-500'>This section displays your current performance.</span>
                                    <label className='flex items-center space-x-2'>
                                        <input
                                            type="checkbox"
                                            checked={settings.showProductivityInsights}
                                            onChange={() => handleToggle('showProductivityInsights')}
                                        />
                                        <span className='text-sm'>Show Productivity Insights</span>
                                    </label>
                                </div>
                                <hr className='my-3' />
                                <div className='flex flex-col'>
                                    <p className='flex font-semibold text-sm'>Calendar</p>
                                    <span className='text-[12px] text-gray-500'>This section displays your calendar.</span>
                                    <label className='flex items-center space-x-2'>
                                        <input
                                            type="checkbox"
                                            checked={settings.showCalendar}
                                            onChange={() => handleToggle('showCalendar')}
                                            disabled
                                        />
                                        <div className='text-sm'>Show Calendar</div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default Settings;
