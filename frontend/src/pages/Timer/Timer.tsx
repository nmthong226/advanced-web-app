import React from 'react'
import { FaChevronRight } from 'react-icons/fa'

const Timer = () => {
    return (
        <div className='flex w-full h-full bg-red-100'>
            <div className="flex flex-col  w-full h-full relative space-y-2">
                <div className="flex px-8 py-1 justify-center items-center bg-white/60">
                    <div className="flex space-x-8">
                        {/*Track the time that user focus: total time, longest time */}
                        <button className=" text-zinc-700 text-lg font-semibold">
                            Report 
                        </button>
                        <button className=" text-zinc-700 text-lg font-semibold">
                            Settings
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Timer