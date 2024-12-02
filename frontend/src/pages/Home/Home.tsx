import OnlyShownCalendarTable from "../../components/onlyshowncalendar/OnlyShownCalendarTable"

const Home = () => {
  return (
    <div className="flex w-full h-full items-center p-2 bg-indigo-50 space-x-2">
      <div className="flex flex-col w-[30%] h-full space-y-4">
        <div className="flex flex-col w-full h-[50%] bg-white rounded-lg shadow-md p-2">
          <div className="flex w-full h-20 border bg-gradient-to-b from-sky-400 to-indigo-100 rounded-lg items-center justify-center">
            <p className="text-2xl font-semibold font-mono text-white" >Good Morning, Minh Thong</p>
          </div>
          <hr className="w-full h-0.5 my-2 bg-gray-200"/>
          
        </div>
        <div className="w-full h-[50%] bg-white rounded-lg shadow-md">
        </div>
      </div>
      <div className="flex flex-col p-1 w-[70%] h-full relative space-y-2 bg-white rounded-lg shadow-md">
        <OnlyShownCalendarTable />
      </div>
    </div>
  )
}

export default Home