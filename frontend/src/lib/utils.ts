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
  const baseDate = dateProp ? new Date(dateProp) : new Date(); // Use the provided date or default to today
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Calculate the difference to find the previous Sunday
  const dayOffset = baseDate.getDay(); // `getDay()` returns 0 (Sunday) to 6 (Saturday)
  const startOfWeek = new Date(baseDate);
  startOfWeek.setDate(baseDate.getDate() - dayOffset); // Go back to the previous Sunday

  const currentWeekDate = [];

  // Iterate from Sunday to Saturday
  for (let i = 0; i < 7; i++) {
    const newDate = new Date(startOfWeek);
    newDate.setDate(startOfWeek.getDate() + i); // Set the date to the current week day (Sunday + i)

    const fullDateString = `${String(newDate.getDate()).padStart(2, '0')}-${String(newDate.getMonth() + 1).padStart(2, '0')}-${newDate.getFullYear()}`;

    currentWeekDate.push({
      dayOfWeek: daysOfWeek[newDate.getDay()],
      dayOfMonth: newDate.getDate(),
      month: newDate.toLocaleString('default', { month: 'long' }),
      year: newDate.getFullYear(),
      fullDate: fullDateString,
    });
  }

  return currentWeekDate;
};

// Helper function to convert a time string with AM/PM to a 24-hour format and add minutes to it.
export const addMinutesToTime = (time: string, minutesToAdd: number): string => {
  // Match 12-hour time format (e.g., '09:30 AM')
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

    // Format and return time in 12-hour format
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
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
