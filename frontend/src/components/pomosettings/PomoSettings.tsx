// src/components/PomoSettings.tsx

import React, { useState, useEffect } from 'react';
import { Howl } from 'howler';
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
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { IoMdSettings } from 'react-icons/io';
import { AiOutlineSound } from 'react-icons/ai';
import { GiStarShuriken } from 'react-icons/gi';
import { AiTwotoneInfoCircle } from 'react-icons/ai';
import { AiFillSpotify } from 'react-icons/ai';
import { BsListTask } from 'react-icons/bs';
import { LuClock2 } from 'react-icons/lu';

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
}

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
}) => {
  // ----- Local State for Settings -----
  const [localPomodoroDuration, setLocalPomodoroDuration] =
    useState<number>(pomodoroDuration);
  const [localShortBreakDuration, setLocalShortBreakDuration] =
    useState<number>(shortBreakDuration);
  const [localLongBreakDuration, setLocalLongBreakDuration] =
    useState<number>(longBreakDuration);
  const [localLongBreakInterval, setLocalLongBreakInterval] =
    useState<number>(longBreakInterval);
  const [localSoundAlarm, setLocalSoundAlarm] = useState<string>(soundAlarm);
  const [localSoundBreak, setLocalSoundBreak] = useState<string>(soundBreak);

  // ----- Local State for Task Settings (if any) -----
  const [isAutoCheckTasks, setIsAutoCheckTasks] = useState<boolean>(true);
  const [isAutoSwitchTasks, setIsAutoSwitchTasks] = useState<boolean>(true);

  // ----- State for Confirmation Dialog -----
  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);

  // ----- State for Settings Dialog -----
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // ----- Effect to Sync Local State When Settings Dialog Opens -----
  useEffect(() => {
    if (isSettingsOpen) {
      // Sync local state with parent settings when dialog opens
      setLocalPomodoroDuration(pomodoroDuration);
      setLocalShortBreakDuration(shortBreakDuration);
      setLocalLongBreakDuration(longBreakDuration);
      setLocalLongBreakInterval(longBreakInterval);
      setLocalSoundAlarm(soundAlarm);
      setLocalSoundBreak(soundBreak);
    }
  }, [
    isSettingsOpen,
    pomodoroDuration,
    shortBreakDuration,
    longBreakDuration,
    longBreakInterval,
    soundAlarm,
    soundBreak,
  ]);

  // ----- Sound Preview Functions -----
  const playAlarmSoundPreview = (sound: string) => {
    let soundUrl = '';
    if (sound === 'bell') {
      soundUrl =
        'https://firebasestorage.googleapis.com/v0/b/yolo-web-app.appspot.com/o/music%2Fbell.MP3?alt=media&token=bfd3eaa1-235e-4dea-948b-87610db24f1e';
    } else if (sound === 'kitchen') {
      soundUrl =
        'https://firebasestorage.googleapis.com/v0/b/yolo-web-app.appspot.com/o/music%2Fchime.MP3?alt=media&token=9f9c0d0a-2b0b-4e9a-8f9f-4d6c0d9d5f8d';
    }

    if (soundUrl) {
      const soundInstance = new Howl({
        src: [soundUrl],
        html5: true,
      });
      soundInstance.play();
    }
  };

  const playBreakSoundPreview = (sound: string) => {
    let soundUrl = '';
    if (sound === 'bird') {
      soundUrl =
        'https://firebasestorage.googleapis.com/v0/b/yolo-web-app.appspot.com/o/music%2Fbreak.MP3?alt=media&token=210cff3d-b006-4947-b290-9bb5efbd3336';
    }

    if (soundUrl) {
      const soundInstance = new Howl({
        src: [soundUrl],
        html5: true,
      });
      soundInstance.play();
    }
  };

  // ----- Handle Save Changes -----
  const handleSaveChanges = () => {
    setIsConfirmOpen(true); // Open confirmation dialog
  };

  return (
    <>
      {/* Main Settings Dialog */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogTrigger asChild>
          <button className="flex items-center bg-white/70 px-4 p-1 rounded-md font-semibold text-zinc-700">
            <IoMdSettings className="mr-2" />
            Settings
          </button>
        </DialogTrigger>
        <DialogContent className="flex flex-col items-center sm:max-w-[425px] sm:max-h-[425px] overflow-auto">
          <DialogHeader className="items-center">
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>
              Configure your Pomodoro preferences
            </DialogDescription>
          </DialogHeader>
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
              <div className="flex flex-col my-5 px-1 w-full h-full">
                <div className="flex flex-col space-y-2 w-full">
                  <Label className="flex">Time (minutes)</Label>
                  <div className="flex justify-between w-full">
                    <div className="flex flex-col space-y-1 w-[30%]">
                      <Label className="flex text-black/60 text-sm">
                        Pomodoro
                      </Label>
                      <div className="flex items-center rounded-md h-10 group">
                        <Input
                          className="bg-gray-50 w-full"
                          type="number"
                          value={localPomodoroDuration}
                          onChange={(e) =>
                            setLocalPomodoroDuration(Number(e.target.value))
                          }
                          min={1}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col space-y-1 w-[30%]">
                      <Label className="flex text-black/60 text-sm">
                        Short Break
                      </Label>
                      <div className="flex items-center rounded-md h-10 group">
                        <Input
                          className="bg-gray-50 w-full"
                          type="number"
                          value={localShortBreakDuration}
                          onChange={(e) =>
                            setLocalShortBreakDuration(Number(e.target.value))
                          }
                          min={1}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col space-y-1 w-[30%]">
                      <Label className="flex text-black/60 text-sm">
                        Long Break
                      </Label>
                      <div className="flex items-center rounded-md h-10 group">
                        <Input
                          className="bg-gray-50 w-full"
                          type="number"
                          value={localLongBreakDuration}
                          onChange={(e) =>
                            setLocalLongBreakDuration(Number(e.target.value))
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
                <div className="flex justify-between items-center mt-4 w-full">
                  <div className="flex items-center w-full group">
                    <Label className="flex text-sm">Long Break interval</Label>
                    <div className="flex items-center ml-4 rounded-md w-[30%] h-10">
                      <Input
                        className="bg-gray-50 w-full"
                        type="number"
                        value={localLongBreakInterval}
                        onChange={(e) =>
                          setLocalLongBreakInterval(Number(e.target.value))
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
              <div className="flex flex-col my-5 px-4 w-full h-full">
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
                  <div className="relative flex flex-col items-start space-y-1 bg-gray-100 p-1 rounded-md w-full h-[120px]">
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
                        when the pomodoro count matches the estimate.
                      </p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <GiStarShuriken />
                      <p className="text-[12px] text-justify text-zinc-700">
                        Enable "Auto Switch Tasks" to move checked tasks to the
                        bottom of the list automatically.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            {/* ----- Sound Settings Tab ----- */}
            <TabsContent value="sound">
              <div className="flex flex-col my-3 px-4 w-full h-full">
                <div className="flex flex-col justify-between space-y-3 w-full">
                  <div className="flex justify-between items-center w-[75%]">
                    <Label>Alarm Sound</Label>
                    <div className="flex items-center space-x-2">
                      <Select
                        value={localSoundAlarm}
                        onValueChange={(value) => {
                          setLocalSoundAlarm(value);
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
                        </SelectContent>
                      </Select>
                      <button
                        type="button"
                        onClick={() => playAlarmSoundPreview(localSoundAlarm)}
                        className="ml-2 p-1 bg-gray-200 rounded-md hover:bg-gray-300 transition"
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
                        value={localSoundBreak}
                        onValueChange={(value) => {
                          setLocalSoundBreak(value);
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
                        onClick={() => playBreakSoundPreview(localSoundBreak)}
                        className="ml-2 p-1 bg-gray-200 rounded-md hover:bg-gray-300 transition"
                        aria-label="Play Break Sound Preview"
                      >
                        <AiOutlineSound className="w-5 h-5 text-gray-700" />
                      </button>
                    </div>
                  </div>
                  <hr className="border w-full" />
                  <Label>Spotify</Label>
                  <div className="flex flex-col w-full">
                    <div className="flex justify-between">
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
              <div className="flex flex-col my-5 px-5 w-full h-full">
                <div className="flex flex-col space-y-2 w-full">
                  <Label className="flex">Color Theme</Label>
                  <div className="flex justify-between w-full">
                    <div className="flex flex-col justify-center items-start space-y-2 w-[30%]">
                      <Label className="flex text-black/60 text-sm">
                        Pomodoro
                      </Label>
                      <div className="flex space-x-2">
                        <div
                          className="bg-orange-600/60 rounded-full w-5 h-5 cursor-pointer"
                          onClick={() => {
                            /* Implement theme change */
                          }}
                        ></div>
                        <div
                          className="bg-red-600/60 rounded-full w-5 h-5 cursor-pointer"
                          onClick={() => {
                            /* Implement theme change */
                          }}
                        ></div>
                        <div
                          className="bg-purple-600/60 rounded-full w-5 h-5 cursor-pointer"
                          onClick={() => {
                            /* Implement theme change */
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex flex-col justify-center items-center space-y-2 w-[30%]">
                      <Label className="flex text-black/60 text-sm">
                        Short Break
                      </Label>
                      <div className="flex space-x-2">
                        <div
                          className="bg-teal-600/60 rounded-full w-5 h-5 cursor-pointer"
                          onClick={() => {
                            /* Implement theme change */
                          }}
                        ></div>
                        <div
                          className="bg-green-600/60 rounded-full w-5 h-5 cursor-pointer"
                          onClick={() => {
                            /* Implement theme change */
                          }}
                        ></div>
                        <div
                          className="bg-emerald-600/60 rounded-full w-5 h-5 cursor-pointer"
                          onClick={() => {
                            /* Implement theme change */
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex flex-col justify-center items-end space-y-2 w-[30%]">
                      <Label className="flex text-black/60 text-sm">
                        Long Break
                      </Label>
                      <div className="flex space-x-2">
                        <div
                          className="bg-blue-600/60 rounded-full w-5 h-5 cursor-pointer"
                          onClick={() => {
                            /* Implement theme change */
                          }}
                        ></div>
                        <div
                          className="bg-sky-600/60 rounded-full w-5 h-5 cursor-pointer"
                          onClick={() => {
                            /* Implement theme change */
                          }}
                        ></div>
                        <div
                          className="bg-cyan-600/60 rounded-full w-5 h-5 cursor-pointer"
                          onClick={() => {
                            /* Implement theme change */
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          {/* ----- Dialog Footer with Save and Cancel Buttons ----- */}
          <DialogFooter className="flex justify-end w-full space-x-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setIsSettingsOpen(false); // Close the main settings dialog
              }}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleSaveChanges}>
              Save changes
            </Button>
          </DialogFooter>
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
            <Button
              onClick={() => {
                // Apply the changes
                setPomodoroDuration(localPomodoroDuration);
                setShortBreakDuration(localShortBreakDuration);
                setLongBreakDuration(localLongBreakDuration);
                setLongBreakInterval(localLongBreakInterval);
                setSoundAlarm(localSoundAlarm);
                setSoundBreak(localSoundBreak);
                setIsConfirmOpen(false); // Close confirmation dialog
                setIsSettingsOpen(false); // Close main settings dialog
              }}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PomoSettings;
