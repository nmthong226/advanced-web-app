import { useState } from "react";

//Import packages
import { Howl } from 'howler';

//Import components
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../../components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Switch } from '../../components/ui/switch';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../components/ui/select"

//Import icons
import { IoMdSettings } from "react-icons/io";
import { LuClock2 } from "react-icons/lu";
import { BsListTask } from "react-icons/bs";
import { AiFillSpotify, AiOutlineSound } from "react-icons/ai";
import { GiStarShuriken } from "react-icons/gi";
import { IoMdArrowDropup } from "react-icons/io";
import { IoMdArrowDropdown } from "react-icons/io";
import { AiTwotoneInfoCircle } from "react-icons/ai";
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Input } from "../ui/input";

const PomoSettings = () => {
    const [soundAlarm, setSoundAlarm] = useState('bell');
    const [soundBreak, setSoundBreak] = useState('break');

    const playAlarmSound = (sound: string) => {
        let soundUrl = '';
        if (sound === 'bell') {
            soundUrl = 'https://firebasestorage.googleapis.com/v0/b/yolo-web-app.appspot.com/o/music%2Fbell.MP3?alt=media&token=bfd3eaa1-235e-4dea-948b-87610db24f1e';
        } else if (sound === 'kitchen') {
            soundUrl = 'https://firebasestorage.googleapis.com/v0/b/yolo-web-app.appspot.com/o/music%2Fchime.MP3?alt=media&token=9f9c0d0a-2b0b-4e9a-8f9f-4d6c0d9d5f8d';
        }

        if (soundUrl) {
            const soundInstance = new Howl({
                src: [soundUrl],
                html5: true,
            });
            soundInstance.play();
        }
    };

    const playBreakSound = (sound: string) => {
        let soundUrl = '';
        if (sound === 'bird') {
            soundUrl = 'https://firebasestorage.googleapis.com/v0/b/yolo-web-app.appspot.com/o/music%2Fbreak.MP3?alt=media&token=210cff3d-b006-4947-b290-9bb5efbd3336';
        }

        if (soundUrl) {
            const soundInstance = new Howl({
                src: [soundUrl],
                html5: true,
            });
            soundInstance.play();
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <button className="flex items-center rounded-md p-1 px-4 bg-white/70 text-zinc-700 font-semibold">
                    <IoMdSettings className="mr-2" />
                    Settings
                </button>
            </DialogTrigger>
            <DialogContent className="flex flex-col sm:max-w-[425px] sm:max-h-[425px] items-center">
                <DialogHeader className='items-center'>
                    <DialogTitle>Settings</DialogTitle>
                    <DialogDescription>
                        Set up your Pomo Focus
                    </DialogDescription>
                </DialogHeader>
                <Tabs defaultValue="timer" className="w-[400px] h-[400px]">
                    <TabsList className='flex w-full justify-between'>
                        <TabsTrigger value="timer">
                            <div className='flex items-center w-[60px]'>
                                <LuClock2 className='mr-2' />
                                <p>Timer</p>
                            </div>
                        </TabsTrigger>
                        <TabsTrigger value="task">
                            <div className='flex items-center w-[60px]'>
                                <BsListTask className='mr-2' />
                                <p>Tasks</p>
                            </div>
                        </TabsTrigger>
                        <TabsTrigger value="sound">
                            <div className='flex items-center w-[60px]'>
                                <AiOutlineSound className='mr-2' />
                                <p>Sound</p>
                            </div>
                        </TabsTrigger>
                        <TabsTrigger value="theme">
                            <div className='flex items-center w-[60px]'>
                                <GiStarShuriken className='mr-2' />
                                <p>Theme</p>
                            </div>
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="timer">
                        <div className='flex flex-col h-full w-full my-5 px-1'>
                            <div className='flex w-full flex-col space-y-2'>
                                <Label className='flex'>Time (minutes)</Label>
                                <div className='flex w-full justify-between'>
                                    <div className='flex flex-col w-[30%] space-y-1'>
                                        <Label className="flex text-black/60 text-sm">Pomodoro</Label>
                                        <div className="flex h-10 items-center rounded-md group">
                                            <Input className='w-full bg-gray-50' type='number' placeholder='25' />
                                        </div>
                                    </div>
                                    <div className="flex flex-col w-[30%] space-y-1">
                                        <Label className="flex text-black/60 text-sm">Short Break</Label>
                                        <div className="flex h-10 items-center rounded-md group">
                                            <Input className='w-full bg-gray-50' type='number' placeholder='5' />
                                        </div>
                                    </div>
                                    <div className='flex flex-col w-[30%] space-y-1'>
                                        <Label className="flex text-black/60 text-sm">Long Break</Label>
                                        <div className="flex h-10 items-center rounded-md group">
                                            <Input className='w-full bg-gray-50' type='number' placeholder='15' />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='flex w-full items-center mt-6 justify-between'>
                                <div className='flex items-center space-x-2 w-[50%]'>
                                    <Label className='flex'>Auto Start Pomodoro</Label>
                                    <Switch
                                        checked={true}
                                        onCheckedChange={() => { }}
                                    />
                                </div>
                                <div className='flex items-center space-x-2 w-[50%]'>
                                    <Label className='flex'>Auto Start Breaks</Label>
                                    <Switch
                                        checked={true}
                                        onCheckedChange={() => { }}
                                    />
                                </div>
                            </div>
                            <div className='flex w-full items-center mt-4 justify-between'>
                                <div className='flex w-full items-center group'>
                                    <Label className="flex text-sm">Long Break interval</Label>
                                    <div className="flex h-10 items-center rounded-md w-[30%]  ml-4 ">
                                        <Input className='w-full bg-gray-50' type='number' placeholder='4' />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="task">
                        <div className='flex flex-col h-full w-full my-5 px-4'>
                            <div className='flex w-full flex-col space-y-3'>
                                <div className='flex items-center justify-between w-[47%]'>
                                    <Label className='flex'>Auto Check Tasks</Label>
                                    <Switch
                                        checked={true}
                                        onCheckedChange={() => { }}
                                    />
                                </div>
                                <div className='flex items-center justify-between w-[47%]'>
                                    <Label className='flex'>Auto Switch Tasks</Label>
                                    <Switch
                                        checked={true}
                                        onCheckedChange={() => { }}
                                    />
                                </div>
                                <div className='flex flex-col items-start w-full h-[120px] bg-gray-100 rounded-md relative p-1 space-y-1'>
                                    <div className='flex items-center'>
                                        <AiTwotoneInfoCircle className='mr-2' />
                                        <span className='text-sm font-semibold text-zinc-700'>Info</span>
                                    </div>
                                    <div className='flex items-start space-x-2'>
                                        <GiStarShuriken />
                                        <p className='text-[12px] text-justify text-zinc-700'>Enable "Auto Check Tasks" to auto-check active tasks when the pomodoro count matches the estimate.</p>
                                    </div>
                                    <div className='flex items-start space-x-2'>
                                        <GiStarShuriken />
                                        <p className='text-[12px] text-justify text-zinc-700'>Enable "Auto Switch Tasks" to move checked tasks to the bottom of the list automatically.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="sound">
                        <div className='flex flex-col h-full w-full my-3 px-4'>
                            <div className="flex flex-col w-full justify-between  space-y-3">
                                <div className='flex items-center justify-between w-[75%]'>
                                    <Label>Alarm Sound</Label>
                                    <Select onValueChange={(value) => {
                                        setSoundAlarm(value);
                                        playAlarmSound(value); // Call a function to play the sound.
                                    }}>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue defaultValue={"bell"} placeholder="Bell" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="bell">
                                                Bell
                                            </SelectItem>
                                            <SelectItem
                                                value="kitchen"
                                                onClick={() => {
                                                    const kitchenSound = new Howl({
                                                        src: ['<your_kitchen_sound_url>'],
                                                        html5: true,
                                                    });
                                                    kitchenSound.play();
                                                }}
                                            >
                                                Kitchen
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex items-center justify-between w-[75%]">
                                    <Label>Break Sound</Label>
                                    <Select onValueChange={(value) => {
                                        setSoundBreak(value);
                                        playBreakSound(value);
                                    }}>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue defaultValue={"bird"} placeholder="Birds" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="bird">
                                                Birds
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <hr className="border w-full" />
                                <Label>Spotify</Label>
                                <div className="flex flex-col w-full">
                                    <div className="flex justify-between">
                                        <button className="flex p-1 bg-zinc-800 text-white rounded-md w-56 text-sm items-center justify-center">
                                            <AiFillSpotify className="mr-2 text-green-500" />
                                            Connect your spotify account
                                        </button>
                                        <button className="flex p-1 bg-zinc-800 text-white rounded-md w-28 text-sm items-center justify-center disabled:bg-zinc-500" disabled>
                                            <AiFillSpotify className="mr-2 text-green-500" />
                                            Manage list
                                        </button>
                                    </div>
                                    <div className="flex items-center space-x-2 mt-4">
                                        <Label className='flex'>or use default list</Label>
                                        <Switch
                                            checked={true}
                                            onCheckedChange={() => { }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="theme">
                        <div className='flex flex-col h-full w-full my-5 px-5'>
                            <div className='flex w-full flex-col space-y-2'>
                                <Label className='flex'>Color Theme</Label>
                                <div className='flex w-full justify-between'>
                                    <div className='flex flex-col w-[30%] space-y-2 justify-center items-start'>
                                        <Label className="flex text-black/60 text-sm">Pomodoro</Label>
                                        <div className="flex space-x-2">
                                            <div className="w-5 h-5 rounded-full bg-orange-600/60"></div>
                                            <div className="w-5 h-5 rounded-full bg-red-600/60"></div>
                                            <div className="w-5 h-5 rounded-full bg-purple-600/60"></div>
                                        </div>
                                    </div>
                                    <div className='flex flex-col w-[30%] space-y-2 justify-center items-center'>
                                        <Label className="flex text-black/60 text-sm">Short break</Label>
                                        <div className="flex space-x-2">
                                            <div className="w-5 h-5 rounded-full bg-teal-600/60"></div>
                                            <div className="w-5 h-5 rounded-full bg-green-600/60"></div>
                                            <div className="w-5 h-5 rounded-full bg-emerald-600/60"></div>
                                        </div>
                                    </div>
                                    <div className='flex flex-col w-[30%] space-y-2 justify-center items-end'>
                                        <Label className="flex text-black/60 text-sm">Long break</Label>
                                        <div className="flex space-x-2">
                                            <div className="w-5 h-5 rounded-full bg-blue-600/60"></div>
                                            <div className="w-5 h-5 rounded-full bg-sky-600/60"></div>
                                            <div className="w-5 h-5 rounded-full bg-cyan-600/60"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
                <DialogFooter className='flex w-full justify-end'>
                    <Button type="submit">Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default PomoSettings