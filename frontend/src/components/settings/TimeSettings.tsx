//Import components
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'

//Import icons
import { RxCountdownTimer } from 'react-icons/rx'

const TimeSettings = () => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="flex flex-col justify-center items-center space-y-2 bg-zinc-50 hover:bg-zinc-100 w-[5%] hover:cursor-pointer group">
                    <RxCountdownTimer />
                    <div className="flex flex-col text-center leading-tight">
                        <p className="text-[10px] text-gray-400">Time</p>
                        <p className="text-[10px] text-gray-400">Range</p>
                    </div>
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Settings Time Range</DialogTitle>
                    <DialogDescription>
                        Choose your best fit time range for daily planning.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col space-y-4">
                    <div className="flex flex-col gap-4">
                        <Label htmlFor="name" className="text-left">
                            Starting Time
                        </Label>
                        <div className="flex justify-between items-center space-x-2 w-full h-20 text-3xl">
                            <div className="flex flex-col w-1/3 h-full leading-tight">
                                <Input
                                    id="hour"
                                    defaultValue="0"
                                    type="number"
                                    min="0"
                                    max="12"
                                    className="justify-center items-center rounded-md w-full h-[95%] text-center md:text-3xl"
                                    autoFocus
                                />
                                <p className="h-[5%] text-[10px] text-gray-600">hour</p>
                            </div>
                            <span className="mb-3 text-3xl">:</span>
                            <div className="flex flex-col w-1/3 h-full leading-tight">
                                <Input
                                    id="minute"
                                    defaultValue="00"
                                    type="number"
                                    min="0"
                                    max="59"
                                    className="justify-center items-center rounded-md w-full h-[95%] text-center md:text-3xl"
                                    disabled
                                />
                                <p className="h-[5%] text-[10px] text-gray-600">minute</p>
                            </div>
                            <div className="flex flex-col w-1/5 h-full">
                                <div className="flex justify-center items-center bg-indigo-100 border rounded-t-lg w-full h-1/2">
                                    <p className="font-bold text-[12px] text-zinc-600">AM</p>
                                </div>
                                <div className="flex justify-center items-center border rounded-b-lg w-full h-1/2">
                                    <p className="font-bold text-[12px] text-zinc-600">PM</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4">
                        <Label htmlFor="username" className="text-left">
                            End Time
                        </Label>
                        <div className="flex justify-between items-center space-x-2 w-full h-20 text-3xl">
                            <div className="flex flex-col w-1/3 h-full leading-tight">
                                <Input
                                    id="hour"
                                    defaultValue="12"
                                    type="number"
                                    min="0"
                                    max="12"
                                    className="justify-center items-center rounded-md w-full h-[95%] text-center md:text-3xl"
                                    autoFocus
                                />
                                <p className="h-[5%] text-[10px] text-gray-600">hour</p>
                            </div>
                            <span className="mb-3 text-3xl">:</span>
                            <div className="flex flex-col w-1/3 h-full leading-tight">
                                <Input
                                    id="minute"
                                    defaultValue="00"
                                    type="number"
                                    min="0"
                                    max="59"
                                    className="justify-center items-center rounded-md w-full h-[95%] text-center md:text-3xl"
                                    disabled
                                />
                                <p className="h-[5%] text-[10px] text-gray-600">minute</p>
                            </div>
                            <div className="flex flex-col w-1/5 h-full">
                                <div className="flex justify-center items-center border rounded-t-lg w-full h-1/2">
                                    <p className="font-bold text-[12px] text-zinc-600">AM</p>
                                </div>
                                <div className="flex justify-center items-center bg-indigo-100 border rounded-b-lg w-full h-1/2">
                                    <p className="font-bold text-[12px] text-zinc-600">PM</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit">Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default TimeSettings