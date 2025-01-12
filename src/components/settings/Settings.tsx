import { useState } from 'react';

// Import components
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import { Input } from '../ui/input';

// Import icons
import { MdViewQuilt } from 'react-icons/md';
import { GrLanguage } from 'react-icons/gr';
import { HiOutlineCog6Tooth } from 'react-icons/hi2';
import { IoDiamondOutline } from 'react-icons/io5';
import { FaCcVisa } from 'react-icons/fa';
import { FaCcMastercard } from 'react-icons/fa';

//Import context
import { useSettings } from '@/contexts/SettingsContext';
import { FaPaypal } from 'react-icons/fa6';
import { updateUserAPI } from '@/api/users.api';
import { useAuth } from '@clerk/clerk-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('General'); // Track active tab
  const { settings, setSettings } = useSettings();
  const { userId } = useAuth();

  const handleToggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Handle theme toggle specifically for themeLight
  const handleThemeToggle = () => {
    setSettings((prev) => {
      const newThemeLight = !prev.themeLight;
      // Add/remove the 'dark' class on the root element
      const root = document.documentElement;
      if (newThemeLight) {
        root.classList.remove('dark');
      } else {
        root.classList.add('dark');
      }
      return { ...prev, themeLight: newThemeLight };
    });
  };

  const [nestedDialogOpen, setNestedDialogOpen] = useState(false);

  const handleUpgradeToPremium = async () => {
    if (userId === null || typeof userId !== 'string') return;
    try {
      const response = await updateUserAPI(userId, { userRole: 'premium' });
      console.log(response);
      if (response && response.userId) {
        alert('You have upgraded to premium!');
        window.location.reload(); // Reload the page after the role is updated
      }
    } catch (error) {
      console.log('Error upgrading to premium:', error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div>
          <HiOutlineCog6Tooth className="w-6 h-6" />
        </div>
      </DialogTrigger>
      <DialogContent
        className="flex gap-0 bg-[#F7F7F7] dark:bg-slate-700 p-0 sm:rounded-xl max-w-[880px] h-[600px]"
        bgOverlay="bg-black/60 dark:bg-black/80"
      >
        {/* Sidebar */}
        <div className="flex flex-col bg-white dark:bg-slate-800 rounded-r-none rounded-xl w-[25%]">
          <div className="flex flex-col p-6 pb-0">
            <p className="font-semibold text-2xl dark:text-white">Settings</p>
            <p className="text-sm dark:text-white">Manage your application.</p>
          </div>
          <div className="flex flex-col space-y-1 p-3">
            <button
              onClick={() => setActiveTab('General')}
              className={`flex items-center text-left space-x-2 px-2 h-8 rounded-md outline-none ${activeTab === 'General' ? 'dark:text-white dark:bg-indigo-800 bg-gray-100' : 'hover:bg-gray-100 dark:text-white text-black'} dark:hover:bg-slate-600`}
            >
              <GrLanguage className="size-3" />
              <p className={`font-medium text-[12px] text-left`}>General</p>
            </button>
            <button
              onClick={() => setActiveTab('UI')}
              className={`flex items-center text-left space-x-2 px-2 h-8 rounded-md ${activeTab === 'UI' ? 'dark:text-white dark:bg-indigo-800 bg-gray-100' : 'hover:bg-gray-100 dark:text-white text-black dark:hover:bg-slate-600'} `}
            >
              <MdViewQuilt className="size-3" />
              <p className={`font-medium text-[12px] text-left`}>
                Personal Config
              </p>
            </button>
            <button
              onClick={() => setActiveTab('Subscription')}
              className={`flex items-center text-left space-x-2 px-2 h-8 rounded-md ${activeTab === 'Subscription' ? 'dark:text-white dark:bg-indigo-800 bg-gray-100' : 'hover:bg-gray-100 dark:text-white text-black dark:hover:bg-slate-600'} `}
            >
              <IoDiamondOutline className="size-3" />
              <p className={`font-medium text-[12px] text-left`}>
                Subscription
              </p>
            </button>
          </div>
        </div>
        {/* Content Area */}
        <div className="flex flex-col shadow-lg p-6 rounded-xl w-[75%]">
          {activeTab === 'General' && (
            <div className="flex flex-col p-1">
              <h2 className="font-bold text-base">General Settings</h2>
              <hr className="my-3" />
              <p className="font-semibold text-gray-700 text-sm dark:text-white">
                Theme
              </p>
              <span className="text-[12px] text-gray-500">
                Click the button for theme changing.
              </span>
              <div className="flex mt-4">
                <div
                  onClick={handleThemeToggle}
                  className={`relative flex shadow-lg p-1 border rounded-md w-[33%] h-20 cursor-pointer ${settings.themeLight ? 'bg-yellow-50/30' : 'bg-indigo-900'} transition-all duration-100 ease-in-out`}
                >
                  <p className="text-4xl">
                    {settings.themeLight ? '☀️' : '🌙'}
                  </p>
                  <p
                    className={`right-3 bottom-2 absolute font-semibold text-xl ${settings.themeLight ? 'text-zinc-900' : 'text-yellow-200'} transition-colors duration-100`}
                  >
                    {settings.themeLight ? 'Light' : 'Dark'}
                  </p>
                </div>
              </div>
              <hr className="my-5" />
              <p className="font-semibold text-gray-700 text-sm dark:text-white">
                Language
              </p>
              <span className="text-[12px] text-gray-500">
                Change the app's language.
              </span>
            </div>
          )}
          {activeTab === 'UI' && (
            <div className="flex flex-col p-1">
              <h2 className="font-bold text-base">Personal Configuration</h2>
              <hr className="my-3" />
              <div className="flex flex-col space-y-2">
                <div className="flex flex-col">
                  <p className="flex font-semibold text-sm">Greetings</p>
                  <span className="text-[12px] text-gray-500">
                    This section shows you the overview of the current time,
                    period.
                  </span>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={settings.showGreetings}
                      onChange={() => handleToggle('showGreetings')}
                    />
                    <span className="text-sm">Show Greetings</span>
                  </label>
                </div>
                <hr className="my-3" />
                <div className="flex flex-col">
                  <p className="flex font-semibold text-sm">Upcoming Events</p>
                  <span className="text-[12px] text-gray-500">
                    This section shows you the overview of next event, including
                    activities and tasks.
                  </span>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={settings.showUpcoming}
                      onChange={() => handleToggle('showUpcoming')}
                    />
                    <span className="text-sm">Show Upcoming</span>
                  </label>
                </div>
                <hr className="my-3" />
                <div className="flex flex-col">
                  <p className="flex font-semibold text-sm">Task Overview</p>
                  <span className="text-[12px] text-gray-500">
                    This section gives you insights for the current task list.
                  </span>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={settings.showTaskOverview}
                      onChange={() => handleToggle('showTaskOverview')}
                    />
                    <span className="text-sm">Show Task Overview</span>
                  </label>
                </div>
                <hr className="my-3" />
                <div className="flex flex-col">
                  <p className="flex font-semibold text-sm">
                    Productivity Insights
                  </p>
                  <span className="text-[12px] text-gray-500">
                    This section displays your current performance.
                  </span>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={settings.showProductivityInsights}
                      onChange={() => handleToggle('showProductivityInsights')}
                    />
                    <span className="text-sm">Show Productivity Insights</span>
                  </label>
                </div>
                <hr className="my-3" />
                <div className="flex flex-col">
                  <p className="flex font-semibold text-sm">Calendar</p>
                  <span className="text-[12px] text-gray-500">
                    This section displays your calendar.
                  </span>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={settings.showCalendar}
                      onChange={() => handleToggle('showCalendar')}
                      disabled
                    />
                    <div className="text-sm">Show Calendar</div>
                  </label>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'Subscription' && (
            <div className="flex flex-col p-1">
              <h2 className="font-bold text-base">Active Plan</h2>
              <hr className="my-3" />
              <div className="flex justify-between items-center bg-gray-50 dark:bg-slate-600 p-3 border rounded-xl w-full h-20">
                <div className="flex flex-col">
                  <p className="font-semibold text-indigo-600 text-xl dark:text-yellow-200">
                    Chill Plan
                  </p>
                  <hr className="border-t-[1px] w-48" />
                  <p className="text-[12px] text-muted-foreground dark:text-white">
                    Serve you with our basic features.{' '}
                  </p>
                </div>
                <div className="flex flex-col justify-center items-center dark:bg-slate-500 shadow-md p-3 border rounded-lg w-52 h-full">
                  <p className="font-semibold">Free</p>
                  <button
                    className="hover:brightness-110 bg-indigo-600 dark:bg-[#9747ff] px-2 py-0.5 rounded-md w-48 text-[12px] text-center text-white"
                    onClick={() => setNestedDialogOpen(true)}
                  >
                    ✨ Up to Pro
                  </button>
                </div>
                {/* Nested Dialog */}
                <Dialog
                  open={nestedDialogOpen}
                  onOpenChange={setNestedDialogOpen}
                >
                  <DialogContent
                    className="bg-white dark:bg-slate-800 p-6 rounded-xl md:max-w-[600px] h-[440px]"
                    bgOverlay="bg-black/20"
                  >
                    <DialogHeader>
                      <h3 className="bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-700 w-fit font-bold text-transparent text-xl">
                        ✨ Prepare for Pro Plan
                      </h3>
                      <hr className="border-t-[1px] w-full" />
                      <p className="text-[12px] text-muted-foreground">
                        Do more with advanced AI integration, customization
                        features
                      </p>
                      <div className="flex space-x-6 py-2 w-full h-[340px]">
                        <div className="flex-col space-y-4 w-[40%]">
                          <div className="flex flex-col space-y-2">
                            <Label htmlFor="name" className="font-normal">
                              Billed to
                            </Label>
                            <Input
                              defaultValue={'Nguyễn Minh Thông'}
                              disabled
                              className="border-gray-600 bg-gray-200 border w-full h-10"
                            />
                          </div>
                          <div className="flex flex-col space-y-2">
                            <Label htmlFor="name" className="font-normal">
                              Bill Options
                            </Label>
                            <RadioGroup
                              defaultValue="option-one"
                              className="space-y-2"
                            >
                              <div className="flex items-center space-x-2 px-2 border rounded-md h-10">
                                <RadioGroupItem
                                  value="option-one"
                                  id="option-one"
                                />
                                <div className="flex flex-col">
                                  <Label
                                    htmlFor="option-one"
                                    className="font-normal"
                                  >
                                    Pay monthly
                                  </Label>
                                  <p className="text-[12px] text-muted-foreground">
                                    $10 / month
                                  </p>
                                </div>
                              </div>
                              <div className="flex justify-between items-center space-x-2 px-2 border rounded-md h-10">
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="option-two"
                                    id="option-two"
                                  />
                                  <div className="flex flex-col">
                                    <Label
                                      htmlFor="option-two"
                                      className="font-normal"
                                    >
                                      Pay annually
                                    </Label>
                                    <p className="text-[12px] text-muted-foreground">
                                      $8 / month
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <p className="text-[12px] text-emerald-600">
                                    Save 20%
                                  </p>
                                </div>
                              </div>
                            </RadioGroup>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-4 pl-6 border-l-2 w-[60%] h-full">
                          <div className="flex flex-col space-y-2">
                            <Label htmlFor="bills" className="font-normal">
                              Payment options
                            </Label>
                            <RadioGroup
                              defaultValue="option-one"
                              className="flex mt-2"
                            >
                              <div className="flex items-center space-x-2 px-2 border rounded-md w-1/2 h-10">
                                <RadioGroupItem
                                  value="option-one"
                                  id="option-one"
                                />
                                <div className="flex flex-col">
                                  <Label
                                    htmlFor="option-one"
                                    className="font-normal"
                                  >
                                    Credit Card
                                  </Label>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2 px-2 border rounded-md w-1/2 h-10">
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="option-two"
                                    id="option-two"
                                  />
                                  <div className="flex flex-col">
                                    <Label
                                      htmlFor="option-two"
                                      className="font-normal"
                                    >
                                      E-wallet
                                    </Label>
                                  </div>
                                </div>
                              </div>
                            </RadioGroup>
                          </div>
                          <div className="flex flex-col space-y-4">
                            <div className="flex flex-col space-y-2">
                              <Label htmlFor="bills" className="font-normal">
                                Payment details
                              </Label>
                              <div className="relative flex items-center border rounded-md w-full h-10">
                                <Input
                                  placeholder="Card number"
                                  className="border-none focus-visible:ring-0 w-[75%] h-10"
                                />
                                <div className="right-2 absolute flex items-center space-x-2">
                                  <FaCcVisa />
                                  <FaPaypal />
                                  <FaCcMastercard />
                                </div>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Input
                                placeholder="Expiration date"
                                className="border w-1/2 h-10"
                              />
                              <Input
                                placeholder="CVC (*master card)"
                                className="border w-1/2 h-10"
                              />
                            </div>
                            <p className="text-[12px] text-muted-foreground">
                              P/S: By providing your card information, you allow
                              IntelliNote. to charge your card for future
                              payments
                            </p>
                            <button
                              onClick={handleUpgradeToPremium}
                              className="hover:brightness-110 bg-indigo-600 rounded-md w-full h-10 font-semibold text-white"
                            >
                              Upgrade to Pro
                            </button>
                          </div>
                        </div>
                      </div>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="flex gap-x-4 mt-4 w-full h-full">
                <div className="flex flex-col bg-gray-50 shadow-lg px-5 p-3 border rounded-lg w-1/2 h-[210px]">
                  <div className="flex flex-col text-center leading-tight">
                    <p className="font-semibold">Chill Plan</p>
                    <p className="text-[12px] text-muted-foreground">
                      *your current plan
                    </p>
                  </div>
                  <hr className="my-2 border-t-[1px] w-full" />
                  <ul className="space-y-2 text-[12px] text-gray-600 text-left">
                    <li>✅ Manage your tasks.</li>
                    <li>✅ Access your calendar.</li>
                    <li>✅ Keep track of your progress.</li>
                    <li>✅ Use focus sessions with pomodoro.</li>
                    <li>✅ Analysis your productivity.</li>
                  </ul>
                </div>
                <div className="flex flex-col bg-gray-50 shadow-lg px-5 p-3 border rounded-lg w-1/2 h-[400px]">
                  <div className="flex flex-col text-center leading-tight">
                    <p className="font-semibold">Pro Plan</p>
                    <button
                      className="text-[12px] text-indigo-600 underline"
                      onClick={() => setNestedDialogOpen(true)}
                    >
                      upgrade now
                    </button>
                  </div>
                  <hr className="my-2 border-t-[1px] w-full" />
                  <ul className="space-y-2 text-[12px] text-gray-600 text-left">
                    <li>✅ Manage your tasks.</li>
                    <li>✅ Access your calendar.</li>
                    <li>✅ Keep track of your progress.</li>
                    <li>✅ Use focus sessions with pomodoro.</li>
                    <li>✅ Analysis your productivity.</li>
                    <li>✨ Unlimited AI feedbacks.</li>
                    <li>✨ Export detailed reports.</li>
                    <li>✨ AI agents for your tasks.</li>
                    <li>✨ Customize app themes.</li>
                    <li>✨ Priority customer support.</li>
                    <li>✨ Early access to new features and updates.</li>
                    <li className="font-semibold text-center">
                      and 5 more benefits
                    </li>
                  </ul>
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
