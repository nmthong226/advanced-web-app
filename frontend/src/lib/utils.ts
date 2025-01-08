import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper function to format time based on a minute-level interval
export const formatTime = (index: number, interval: number): string => {
  const totalMinutes = index * interval;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const isAM = hours < 12;
  const formattedHour = hours % 12 === 0 ? 12 : hours % 12;
  const formattedMinutes = minutes.toString().padStart(2, '0');

  return `${formattedHour}:${formattedMinutes} ${isAM ? 'AM' : 'PM'}`;
};

export const getCurrentDateInfo = () => {
  const today = new Date();
  const daysOfWeek = [
    "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"
  ];
  const monthsOfYear = [
    "January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"
  ];
  const dayOfWeek = daysOfWeek[today.getDay()]; // Current day of the week
  const dayOfMonth = today.getDate(); // Current day of the month
  const month = monthsOfYear[today.getMonth()]; // Current month
  const year = today.getFullYear(); // Current year
  return {
    dayOfWeek,
    dayOfMonth,
    month,
    year
  };
};

export const getCurrentWeek = (dateProp?: string) => {
  // Use the provided date or default to today
  const baseDate = dateProp ? new Date(dateProp) : new Date();
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Find the previous Sunday (start of the week)
  const dayOffset = baseDate.getDay(); // Sunday = 0, ..., Saturday = 6
  const startOfWeek = new Date(baseDate);
  startOfWeek.setDate(baseDate.getDate() - dayOffset); // Go back to the previous Sunday

  const currentWeekDate = [];

  // Iterate from Sunday to Saturday
  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(startOfWeek);
    currentDate.setDate(startOfWeek.getDate() + i); // Calculate each day of the week

    // Format the date in dd/mm/yyyy format
    const fullDateString = `${String(currentDate.getDate()).padStart(2, '0')}/${String(
      currentDate.getMonth() + 1
    ).padStart(2, '0')}/${currentDate.getFullYear()}`;

    currentWeekDate.push({
      dayOfWeek: daysOfWeek[currentDate.getDay()], // Day name (e.g., Sun, Mon)
      dayOfMonth: currentDate.getDate(), // Numeric day of the month
      month: currentDate.toLocaleString('default', { month: 'long' }), // Full month name
      year: currentDate.getFullYear(), // Year
      fullDate: fullDateString, // Full date as dd/mm/yyyy
    });
  }

  return currentWeekDate;
};

// Helper function to convert a time string with AM/PM to a 24-hour format and add minutes to it.
export const addMinutesToTime = (time: string, minutesToAdd: number): string => {
  // Match 12-hour time format (e.g., '9:30 AM' or '03:15 PM')
  const timeRegex = /(\d{1,2}):(\d{2}) (AM|PM)/;
  const match = time.match(timeRegex);

  if (match) {
    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const period = match[3];

    // Convert 12-hour time to 24-hour time
    if (period === 'AM' && hours === 12) {
      hours = 0; // 12 AM is 00:00 in 24-hour format
    } else if (period === 'PM' && hours !== 12) {
      hours += 12; // Convert PM hours to 24-hour format
    }

    // Create a new Date object and add minutes
    const date = new Date(1970, 0, 1, hours, minutes); // Use January 1st, 1970 for consistency
    date.setMinutes(date.getMinutes() + minutesToAdd); // Add minutes to the time

    // Format and return time in 12-hour format without leading zero for hours
    const options: Intl.DateTimeFormatOptions = {
      hour: 'numeric', // 'numeric' avoids leading zeros for hours
      minute: '2-digit',
      hour12: true,
    };
    return date.toLocaleTimeString([], options);
  }
  return time; // If invalid format, return the original time
};


export const getTimeSlotIndex = (formattedTime: string): number => {
  // Example input: "09:15 AM"

  // 1. Split the time string to get hours, minutes, and AM/PM.
  const [time, period] = formattedTime.split(' '); // Split "09:15 AM" into ["09:15", "AM"]
  const [hoursStr, minutesStr] = time.split(':');  // Split "09:15" into ["09", "15"]

  // 2. Convert string values to numbers.
  let hours = parseInt(hoursStr, 10);   // Convert "09" to 9
  const minutes = parseInt(minutesStr, 10); // Convert "15" to 15

  // 3. Convert to 24-hour format if needed.
  if (period === 'PM' && hours !== 12) {
    hours += 12; // Convert PM hours to 24-hour format (e.g., 1 PM -> 13)
  } else if (period === 'AM' && hours === 12) {
    hours = 0; // Midnight case (12 AM should be 0 hours)
  }

  // 4. Calculate the total slot index.
  // Each hour has 4 slots (15-minute intervals), so:
  // Slot index = (hours * 4) + (minutes / 15)
  const slotIndex = (hours * 4) + (minutes / 15);

  return slotIndex;
};

// Utility function to format time range
export const formatTimeRange = (startTime: string, endTime: string): string => {
  if (startTime == '' || endTime == '') return '';
  // Helper function to format time with AM/PM
  const formatTime = (time: string, removePeriod: boolean): string => {
    const [hour, minuteWithPeriod] = time.split(':'); // Split hour and minute part
    const formattedHour = hour.startsWith('0') ? hour.substring(1) : hour; // Remove leading zero from hour
    const [minute, period] = minuteWithPeriod.split(' '); // Extract minutes and AM/PM period

    // If minutes are 00, return just the hour with period; otherwise, return hour:minute with period
    if (removePeriod) {
      return minute === '00' ? `${formattedHour}` : `${formattedHour}:${minute}`;
    }
    return minute === '00' ? `${formattedHour} ${period}` : `${formattedHour}:${minute} ${period}`;
  };

  // Extract period from startTime and endTime
  const [startPeriod] = startTime.split(' ')[1].split(' '); // Extract AM/PM from startTime
  const [endPeriod] = endTime.split(' ')[1].split(' '); // Extract AM/PM from endTime

  // Determine whether to remove the period from startTime
  const removeStartPeriod = startPeriod === endPeriod;

  // Format both startTime and endTime with the condition
  const startFormatted = formatTime(startTime, removeStartPeriod);
  const endFormatted = formatTime(endTime, false); // Always include period in endTime

  return `${startFormatted} - ${endFormatted}`;
};

// Helper function to transform bg color to text color and adjust shade
export const transformBgColorToTextColor = (bgColor: string): string => {
  // Example: 'bg-red-50' -> 'text-red-500'
  return bgColor.replace(/bg-(\w+)-(\d+)/, (_, colorName, shade) => {
    // Replace the 'bg' with 'text' and change the shade from '50' to '500'
    const newShade = Math.min(parseInt(shade, 10) * 10, 500); // Adjusting the shade to '500'
    return `text-${colorName}-${newShade}`;
  });
};

export const generateStylesFromParent = (color: string): string => {
  // Extract the color from the gradient string
  const match = color.match(/bg-([a-z]+)-\d+/); // Matches the color like 'purple', 'blue', etc.
  const foundColor = match?.[1]; // Extract the color key

  // Map of colors to styles
  const colorStyles: { [key: string]: string } = {
    purple: "bg-purple-100 border-l-[5px] border-l-purple-600",
    blue: "bg-blue-100 border-l-[5px] border-l-blue-600",
    green: "bg-green-100 border-l-[5px] border-l-green-600",
    red: "bg-red-100 border-l-[5px] border-l-red-600",
    yellow: "bg-yellow-100 border-l-[5px] border-l-yellow-600",
    emerald: "bg-emerald-100 border-l-[5px] border-l-emerald-600",
    pink: "bg-pink-100 border-l-[5px] border-l-pink-600",
    lime: "bg-lime-100 border-l-[5px] border-l-lime-600",
    // Add more colors as needed
  };

  // Return the matched styles or a default style
  return colorStyles[foundColor || ""] || "bg-gray-100 border-l-[5px] border-l-gray-600";
};

export const convertToPeriodTime = (dueTime: string): string => {
  const date = new Date(dueTime).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'UTC',
  });
  return date;
};

// Function to get the current week from a given date
export const initialCurrentWeek = (date: any) => {
  // Ensure the input date is a valid Date object
  const currentDate = new Date(date);
  const currentDayIndex = currentDate.getDay(); // Get day index (0 = Sunday, ..., 6 = Saturday)

  // Calculate the start of the week (Sunday)
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDayIndex);

  // Generate the week from Sunday to Saturday
  const week = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i); // Increment days from Sunday

    return {
      date: day.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }), // Format date as dd/mm/yyyy
      dayOfWeek: day.toLocaleDateString('en-GB', { weekday: 'short' }), // e.g., "Sun", "Mon"
      userId: 'user-1', // Default user ID
      tasks: [], // Initialize with empty tasks
    };
  });

  return week;
};


// Convert UTC ISO string to local time in Vietnam (UTC+7)
export const convertToLocalTime = (isoString: string, offset: number) => {
  const date = new Date(isoString);
  // Adjust by the offset (in hours)
  const localDate = new Date(date.getTime() + offset * 60 * 60 * 1000);
  return localDate.toISOString();
};