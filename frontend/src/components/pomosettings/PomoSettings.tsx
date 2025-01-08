// src/components/PomoSettings.tsx

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../components/ui/tabs';
import { Switch } from '../../components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { IoMdSettings } from 'react-icons/io';
import { AiOutlineSound } from 'react-icons/ai';
import { GiStarShuriken } from 'react-icons/gi';
import { AiTwotoneInfoCircle } from 'react-icons/ai';
import { AiFillSpotify } from 'react-icons/ai';
import { BsListTask } from 'react-icons/bs';
import { LuClock2 } from 'react-icons/lu';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SessionSettings } from '../../types/apiResponses';
import {
  getSessionSettingsApi,
  updateSessionSettingsApi,
} from './pomodoroSettingsApi';
import { useAuth, useUser } from '@clerk/clerk-react';

interface PomoSettingsProps {
  pomodoroDuration: number;
  setPomodoroDuration: (duration: number) => void;
  shortBreakDuration: number;
  setShortBreakDuration: (duration: number) => void;
  longBreakDuration: number;
  setLongBreakDuration: (duration: number) => void;
  longBreakInterval: number;
  setLongBreakInterval: (interval: number) => void;
  soundAlarm: string;
  setSoundAlarm: (sound: string) => void;
  soundBreak: string;
  setSoundBreak: (sound: string) => void;
  onUpdateSettings: (updatedSettings: {
    default_work_time: number;
    default_break_time: number;
    long_break_time: number;
    cycles_per_set: number;
  }) => void;
}

// src/components/PomoSettings.tsx

// ... [Previous imports remain unchanged]

const PomoSettings: React.FC<PomoSettingsProps> = ({
  pomodoroDuration,
  setPomodoroDuration,
  shortBreakDuration,
  setShortBreakDuration,
  longBreakDuration,
  setLongBreakDuration,
  longBreakInterval,
  setLongBreakInterval,
  soundAlarm,
  setSoundAlarm,
  soundBreak,
  setSoundBreak,
  onUpdateSettings,
}) => {
  // ----- Local State for Task Settings -----
  const [isAutoCheckTasks, setIsAutoCheckTasks] = useState<boolean>(true);
  const [isAutoSwitchTasks, setIsAutoSwitchTasks] = useState<boolean>(true);

  // ----- State for Confirmation Dialog -----
  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);

  // ----- State for Settings Dialog -----
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // ----- Loading and Error States -----
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [, setError] = useState<string | null>(null);

  // ----- User Context -----
  const { user } = useUser(); // Assuming Clerk is used for authentication
  const { getToken } = useAuth(); // Destructure getToken from useAuth

  // ----- Effect to Fetch Settings When Dialog Opens -----
  useEffect(() => {
    const fetchSettings = async () => {
      if (isSettingsOpen && user) {
        setIsLoading(true);
        setError(null);
        try {
          const token = await getToken(); // Replace with your template name if applicable

          if (!token) {
            console.warn('Token is not available.');
            return;
          }
          const settings: SessionSettings = await getSessionSettingsApi(token); // Fetch settings using the token
          // Update parent component's state using setter functions
          setPomodoroDuration(settings.default_work_time);
          setShortBreakDuration(settings.default_break_time);
          setLongBreakDuration(settings.long_break_time);
          setLongBreakInterval(settings.cycles_per_set);
          setSoundAlarm(settings.sound_alarm || 'bell'); // Ensure 'sound_alarm' exists in backend
          setSoundBreak(settings.sound_break || 'bird'); // Ensure 'sound_break' exists in backend

          // Handle other settings if necessary
        } catch (err) {
          console.error(err);
          setError('Failed to fetch settings. Please try again later.');
          toast.error('Failed to fetch settings. Please try again later.');
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchSettings();
  }, [
    isSettingsOpen,
    user,
    getToken, // Include getToken in dependencies
    setPomodoroDuration,
    setShortBreakDuration,
    setLongBreakDuration,
    setLongBreakInterval,
    setSoundAlarm,
    setSoundBreak,
  ]);

  // ----- Sound Preview Functions -----
  // ... [Sound preview functions remain unchanged]

  // ----- Handle Save Changes -----
  const handleSaveChanges = async () => {
    if (!user) {
      toast.error('User not authenticated.');
      return;
    }

    setIsConfirmOpen(false);
    setIsLoading(true);
    setError(null);

    try {
      const token = await getToken({ template: 'supabase' }); // Retrieve token for update
      if (!token) {
        console.warn('Token is not available.');
        return;
      }
      const updatedSettings: Partial<SessionSettings> = {
        default_work_time: pomodoroDuration,
        default_break_time: shortBreakDuration,
        long_break_time: longBreakDuration,
        cycles_per_set: longBreakInterval,
        sound_alarm: soundAlarm,
        sound_break: soundBreak,
        // Add other settings if necessary
      };

      await updateSessionSettingsApi(user.id, token, updatedSettings); // Pass token and data
      // Notify parent component about the updated settings
      onUpdateSettings({
        default_work_time: pomodoroDuration,
        default_break_time: shortBreakDuration,
        long_break_time: longBreakDuration,
        cycles_per_set: longBreakInterval,
      });
      toast.success('Settings updated successfully!', { autoClose: 3000 });
      setIsSettingsOpen(false); // Close the settings dialog
    } catch (err) {
      console.error(err);
      setError('Failed to update settings. Please try again later.');
      toast.error('Failed to update settings. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  function playAlarmSoundPreview(): void {
    throw new Error('Function not implemented.');
  }

  function playBreakSoundPreview(): void {
    throw new Error('Function not implemented.');
  }

  return (
    <>
      {/* Toast Container for Notifications */}
      <ToastContainer />

      {/* Main Settings Dialog */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogTrigger asChild>
          <button className="flex items-center bg-white hover:bg-gray-100 shadow-md px-4 p-1 border rounded-md font-semibold text-zinc-700">
            <IoMdSettings className="mr-2" />
            Settings
          </button>
        </DialogTrigger>
        <DialogContent className="flex flex-col items-center sm:max-w-[600px] sm:max-h-[80vh] overflow-auto">
          <DialogHeader className="items-center">
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>
              Configure your Pomodoro preferences
            </DialogDescription>
          </DialogHeader>

          {isLoading ? (
            <div className="flex justify-center items-center p-4">
              <span>Loading...</span>
            </div>
          ) : (
            <Tabs defaultValue="timer" className="w-full">
              <TabsList className="flex justify-between w-full">
                <TabsTrigger value="timer">
                  <div className="flex items-center w-[60px]">
                    <LuClock2 className="mr-2" />
                    <p>Timer</p>
                  </div>
                </TabsTrigger>
                <TabsTrigger value="task">
                  <div className="flex items-center w-[60px]">
                    <BsListTask className="mr-2" />
                    <p>Tasks</p>
                  </div>
                </TabsTrigger>
                <TabsTrigger value="sound">
                  <div className="flex items-center w-[60px]">
                    <AiOutlineSound className="mr-2" />
                    <p>Sound</p>
                  </div>
                </TabsTrigger>
                <TabsTrigger value="theme">
                  <div className="flex items-center w-[60px]">
                    <GiStarShuriken className="mr-2" />
                    <p>Theme</p>
                  </div>
                </TabsTrigger>
              </TabsList>

              {/* ----- Timer Settings Tab ----- */}
              <TabsContent value="timer">
                <div className="flex flex-col my-5 px-4 w-full">
                  <div className="flex flex-col space-y-3 w-full">
                    <Label className="flex">Time (minutes)</Label>
                    <div className="flex justify-between w-full">
                      <div className="flex flex-col w-[30%]">
                        <Label className="flex text-black/60 text-sm">
                          Pomodoro
                        </Label>
                        <div className="flex items-center rounded-md h-10 group">
                          <Input
                            className="bg-gray-50 w-full"
                            type="number"
                            value={pomodoroDuration}
                            onChange={(e) =>
                              setPomodoroDuration(Number(e.target.value))
                            }
                            min={1}
                          />
                        </div>
                      </div>
                      <div className="flex flex-col w-[30%]">
                        <Label className="flex text-black/60 text-sm">
                          Short Break
                        </Label>
                        <div className="flex items-center rounded-md h-10 group">
                          <Input
                            className="bg-gray-50 w-full"
                            type="number"
                            value={shortBreakDuration}
                            onChange={(e) =>
                              setShortBreakDuration(Number(e.target.value))
                            }
                            min={1}
                          />
                        </div>
                      </div>
                      <div className="flex flex-col w-[30%]">
                        <Label className="flex text-black/60 text-sm">
                          Long Break
                        </Label>
                        <div className="flex items-center rounded-md h-10 group">
                          <Input
                            className="bg-gray-50 w-full"
                            type="number"
                            value={longBreakDuration}
                            onChange={(e) =>
                              setLongBreakDuration(Number(e.target.value))
                            }
                            min={1}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-6 w-full">
                    <div className="flex items-center space-x-2 w-[50%]">
                      <Label className="flex">Auto Start Pomodoro</Label>
                      <Switch
                        checked={isAutoCheckTasks}
                        onCheckedChange={() =>
                          setIsAutoCheckTasks(!isAutoCheckTasks)
                        }
                      />
                    </div>
                    <div className="flex items-center space-x-2 w-[50%]">
                      <Label className="flex">Auto Start Breaks</Label>
                      <Switch
                        checked={isAutoSwitchTasks}
                        onCheckedChange={() =>
                          setIsAutoSwitchTasks(!isAutoSwitchTasks)
                        }
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-3 w-full">
                    <div className="flex items-center w-full group">
                      <Label className="flex text-sm">
                        Long Break Interval
                      </Label>
                      <div className="flex items-center ml-4 rounded-md w-[30%] h-10">
                        <Input
                          className="bg-gray-50 w-full"
                          type="number"
                          value={longBreakInterval}
                          onChange={(e) =>
                            setLongBreakInterval(Number(e.target.value))
                          }
                          min={1}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* ----- Task Settings Tab ----- */}
              <TabsContent value="task">
                <div className="flex flex-col my-5 px-4 w-full">
                  <div className="flex flex-col space-y-3 w-full">
                    <div className="flex justify-between items-center w-[47%]">
                      <Label className="flex">Auto Check Tasks</Label>
                      <Switch
                        checked={isAutoCheckTasks}
                        onCheckedChange={() =>
                          setIsAutoCheckTasks(!isAutoCheckTasks)
                        }
                      />
                    </div>
                    <div className="flex justify-between items-center w-[47%]">
                      <Label className="flex">Auto Switch Tasks</Label>
                      <Switch
                        checked={isAutoSwitchTasks}
                        onCheckedChange={() =>
                          setIsAutoSwitchTasks(!isAutoSwitchTasks)
                        }
                      />
                    </div>
                    <div className="relative flex flex-col items-start space-y-3 bg-gray-100 p-1 rounded-md w-full h-[120px]">
                      <div className="flex items-center">
                        <AiTwotoneInfoCircle className="mr-2" />
                        <span className="font-semibold text-sm text-zinc-700">
                          Info
                        </span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <GiStarShuriken />
                        <p className="text-[12px] text-justify text-zinc-700">
                          Enable "Auto Check Tasks" to auto-check active tasks
                          when the Pomodoro count matches the estimate.
                        </p>
                      </div>
                      <div className="flex items-start space-x-2">
                        <GiStarShuriken />
                        <p className="text-[12px] text-justify text-zinc-700">
                          Enable "Auto Switch Tasks" to move checked tasks to
                          the bottom of the list automatically.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* ----- Sound Settings Tab ----- */}
              <TabsContent value="sound">
                <div className="flex flex-col my-3 w-full">
                  <div className="flex flex-col justify-between space-y-3 w-full">
                    <div className="flex justify-between items-center w-[75%]">
                      <Label>Alarm Sound</Label>
                      <div className="flex items-center space-x-2">
                        <Select
                          value={soundAlarm}
                          onValueChange={(value) => {
                            setSoundAlarm(value);
                          }}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue
                              defaultValue={'bell'}
                              placeholder="Bell"
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bell">Bell</SelectItem>
                            <SelectItem value="kitchen">Kitchen</SelectItem>
                            {/* Add more alarm sounds if available */}
                          </SelectContent>
                        </Select>
                        <button
                          type="button"
                          onClick={() => playAlarmSoundPreview()}
                          className="bg-gray-200 hover:bg-gray-300 ml-2 p-1 rounded-md transition"
                          aria-label="Play Alarm Sound Preview"
                        >
                          <AiOutlineSound className="w-5 h-5 text-gray-700" />
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center w-[75%]">
                      <Label>Break Sound</Label>
                      <div className="flex items-center space-x-2">
                        <Select
                          value={soundBreak}
                          onValueChange={(value) => {
                            setSoundBreak(value);
                          }}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue
                              defaultValue={'bird'}
                              placeholder="Birds"
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bird">Birds</SelectItem>
                            {/* Add more break sounds if available */}
                          </SelectContent>
                        </Select>
                        <button
                          type="button"
                          onClick={() => playBreakSoundPreview()}
                          className="bg-gray-200 hover:bg-gray-300 ml-2 p-1 rounded-md transition"
                          aria-label="Play Break Sound Preview"
                        >
                          <AiOutlineSound className="w-5 h-5 text-gray-700" />
                        </button>
                      </div>
                    </div>
                    <hr className="border w-full" />
                    <Label>Spotify</Label>
                    <div className="flex flex-col w-full">
                      <div className="flex justify-between items-center">
                        <button className="flex justify-center items-center bg-zinc-800 p-1 rounded-md w-56 text-sm text-white">
                          <AiFillSpotify className="mr-2 text-green-500" />
                          Connect your Spotify account
                        </button>
                        <button
                          className="flex justify-center items-center bg-zinc-800 disabled:bg-zinc-500 p-1 rounded-md w-28 text-sm text-white"
                          disabled
                        >
                          <AiFillSpotify className="mr-2 text-green-500" />
                          Manage list
                        </button>
                      </div>
                      <div className="flex items-center space-x-2 mt-4">
                        <Label className="flex">or use default list</Label>
                        <Switch checked={false} onCheckedChange={() => {}} />
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* ----- Theme Settings Tab ----- */}
              <TabsContent value="theme">
                <div className="flex flex-col my-5 px-5 w-full">
                  <div className="flex flex-col space-y-2 w-full">
                    <Label className="flex">Color Theme</Label>
                    <div className="flex justify-between w-full">
                      {/* Pomodoro Theme */}
                      <div className="flex flex-col justify-center items-start space-y-2 w-[30%]">
                        <Label className="flex text-black/60 text-sm">
                          Pomodoro
                        </Label>
                        <div className="flex space-x-2">
                          <div
                            className="bg-orange-600/60 rounded-full w-5 h-5 cursor-pointer"
                            onClick={() => {
                              // Implement theme change logic
                              toast.info('Pomodoro theme selected (Orange)');
                            }}
                          ></div>
                          <div
                            className="bg-red-600/60 rounded-full w-5 h-5 cursor-pointer"
                            onClick={() => {
                              // Implement theme change logic
                              toast.info('Pomodoro theme selected (Red)');
                            }}
                          ></div>
                          <div
                            className="bg-purple-600/60 rounded-full w-5 h-5 cursor-pointer"
                            onClick={() => {
                              // Implement theme change logic
                              toast.info('Pomodoro theme selected (Purple)');
                            }}
                          ></div>
                        </div>
                      </div>
                      {/* Short Break Theme */}
                      <div className="flex flex-col justify-center items-center space-y-2 w-[30%]">
                        <Label className="flex text-black/60 text-sm">
                          Short Break
                        </Label>
                        <div className="flex space-x-2">
                          <div
                            className="bg-teal-600/60 rounded-full w-5 h-5 cursor-pointer"
                            onClick={() => {
                              // Implement theme change logic
                              toast.info('Short Break theme selected (Teal)');
                            }}
                          ></div>
                          <div
                            className="bg-green-600/60 rounded-full w-5 h-5 cursor-pointer"
                            onClick={() => {
                              // Implement theme change logic
                              toast.info('Short Break theme selected (Green)');
                            }}
                          ></div>
                          <div
                            className="bg-emerald-600/60 rounded-full w-5 h-5 cursor-pointer"
                            onClick={() => {
                              // Implement theme change logic
                              toast.info(
                                'Short Break theme selected (Emerald)',
                              );
                            }}
                          ></div>
                        </div>
                      </div>
                      {/* Long Break Theme */}
                      <div className="flex flex-col justify-center items-end space-y-2 w-[30%]">
                        <Label className="flex text-black/60 text-sm">
                          Long Break
                        </Label>
                        <div className="flex space-x-2">
                          <div
                            className="bg-blue-600/60 rounded-full w-5 h-5 cursor-pointer"
                            onClick={() => {
                              // Implement theme change logic
                              toast.info('Long Break theme selected (Blue)');
                            }}
                          ></div>
                          <div
                            className="bg-sky-600/60 rounded-full w-5 h-5 cursor-pointer"
                            onClick={() => {
                              // Implement theme change logic
                              toast.info('Long Break theme selected (Sky)');
                            }}
                          ></div>
                          <div
                            className="bg-cyan-600/60 rounded-full w-5 h-5 cursor-pointer"
                            onClick={() => {
                              // Implement theme change logic
                              toast.info('Long Break theme selected (Cyan)');
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}

          {/* ----- Dialog Footer with Save and Cancel Buttons ----- */}
          {!isLoading && (
            <DialogFooter className="flex justify-end space-x-2 w-full">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setIsSettingsOpen(false); // Close the main settings dialog
                }}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={() => setIsConfirmOpen(true)}
                disabled={isLoading}
              >
                Save changes
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

      {/* ----- Confirmation Dialog ----- */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Confirm Changes</DialogTitle>
            <DialogDescription>
              Are you sure you want to save these changes?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end space-x-2">
            <Button variant="ghost" onClick={() => setIsConfirmOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveChanges} disabled={isLoading}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PomoSettings;
