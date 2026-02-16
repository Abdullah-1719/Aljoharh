"use client";

import { useState } from "react";
import {
  getCalendarGrid,
  getMonthName,
  formatDateToISO,
  isSameDay,
  isToday,
  parseISOToDate,
} from "@/lib/date-utils";

export interface Booking {
  id: string;
  customerName: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

interface CalendarProps {
  bookings: Booking[];
  onDateClick: (date: Date, booking: Booking | null) => void;
}

export default function Calendar({ bookings, onDateClick }: CalendarProps) {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1);

  // Navigate to previous month
  const goToPreviousMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  // Navigate to next month
  const goToNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Navigate to today
  const goToToday = () => {
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth() + 1);
  };

  // Get booking for a specific date (if any)
  const getBookingForDate = (date: Date): Booking | null => {
    const dateISO = formatDateToISO(date);
    return bookings.find((booking) => booking.date === dateISO) || null;
  };

  // Get all calendar dates for the grid
  const calendarDates = getCalendarGrid(currentYear, currentMonth);
  const monthName = getMonthName(currentMonth);

  // Day names for header
<<<<<<< HEAD
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
=======
  const dayNames = ["S", "M", "T", "W", "T", "F", "S"];
  const dayNamesFull = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
>>>>>>> b89f9f6 (initial commit)

  // Handle date cell click
  const handleDateClick = (date: Date) => {
    const booking = getBookingForDate(date);
    onDateClick(date, booking);
  };

  // Check if a date is in the past (before today)
  const isPastDate = (date: Date): boolean => {
    const now = new Date();
    const todayUTC = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
    const dateUTC = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
    return dateUTC < todayUTC;
  };

  // Render a single date cell
  const renderDateCell = (date: Date, index: number) => {
    const isCurrentMonth = date.getUTCMonth() + 1 === currentMonth;
    const isTodayDate = isToday(date);
    const booking = getBookingForDate(date);
    const isBooked = booking !== null;
    const isPast = isPastDate(date);
    const isClickable = isCurrentMonth && !isPast;

    // Base classes - Najdi desert theme
    let cellClasses =
<<<<<<< HEAD
      "relative min-h-[90px] md:min-h-[110px] p-2 md:p-3 border transition-all duration-300 rounded-xl ";
=======
      "relative min-h-[60px] sm:min-h-[80px] md:min-h-[110px] p-1 sm:p-1.5 md:p-3 border transition-all duration-300 rounded-lg md:rounded-xl ";
>>>>>>> b89f9f6 (initial commit)

    if (!isCurrentMonth) {
      cellClasses += "bg-najdi-sand/40 text-najdi-muted-light/50 border-najdi-border/40 cursor-default ";
    } else if (isPast) {
      cellClasses += "bg-najdi-sand-dark/40 border-najdi-border/50 cursor-not-allowed opacity-50 ";
    } else if (isBooked) {
      cellClasses +=
<<<<<<< HEAD
        "bg-najdi-clay border-najdi-clay-dark hover:bg-najdi-clay-dark shadow-desert cursor-pointer ";
    } else {
      cellClasses +=
        "bg-najdi-cream border-najdi-border hover:bg-najdi-sand hover:shadow-desert hover:-translate-y-0.5 cursor-pointer ";
=======
        "bg-najdi-clay border-najdi-clay-dark hover:bg-najdi-clay-dark shadow-desert cursor-pointer active:scale-[0.97] ";
    } else {
      cellClasses +=
        "bg-najdi-cream border-najdi-border hover:bg-najdi-sand hover:shadow-desert hover:-translate-y-0.5 cursor-pointer active:scale-[0.97] ";
>>>>>>> b89f9f6 (initial commit)
    }

    // Today highlight - palm green ring
    if (isTodayDate && isCurrentMonth) {
      cellClasses +=
<<<<<<< HEAD
        "ring-2 ring-najdi-palm ring-offset-2 ring-offset-najdi-sand ";
=======
        "ring-2 ring-najdi-palm ring-offset-1 md:ring-offset-2 ring-offset-najdi-sand ";
>>>>>>> b89f9f6 (initial commit)
    }

    return (
      <div
        key={index}
        className={cellClasses}
        onClick={() => isClickable && handleDateClick(date)}
        role={isClickable ? "button" : undefined}
        tabIndex={isClickable ? 0 : -1}
        onKeyDown={(e) => {
          if (e.key === "Enter" && isClickable) {
            handleDateClick(date);
          }
        }}
        aria-label={`${date.getUTCDate()} ${monthName} ${currentYear}${isPast && isCurrentMonth ? ", Unavailable" : isBooked ? `, Booked by ${booking.customerName}` : ", Available"}`}
        aria-disabled={!isClickable}
      >
        {/* Date number */}
<<<<<<< HEAD
        <div className="flex items-center justify-between mb-1">
          <span
            className={`text-base md:text-lg font-semibold ${
=======
        <div className="flex items-center justify-between mb-0.5 md:mb-1">
          <span
            className={`text-sm md:text-lg font-semibold ${
>>>>>>> b89f9f6 (initial commit)
              isTodayDate && isCurrentMonth
                ? "text-najdi-palm"
                : isPast && isCurrentMonth
                  ? "text-najdi-muted-light"
                  : isBooked
                    ? "text-white"
                    : isCurrentMonth
                      ? "text-najdi-text"
                      : "text-najdi-muted-light/50"
            }`}
          >
            {date.getUTCDate()}
          </span>
          {isTodayDate && isCurrentMonth && (
<<<<<<< HEAD
            <span className="text-xs font-semibold text-najdi-palm bg-najdi-palm/10 px-2 py-0.5 rounded-full">
=======
            <span className="hidden sm:inline text-[10px] md:text-xs font-semibold text-najdi-palm bg-najdi-palm/10 px-1.5 py-0.5 rounded-full">
>>>>>>> b89f9f6 (initial commit)
              Today
            </span>
          )}
        </div>

        {/* Booking info */}
        {isBooked && isCurrentMonth && (
<<<<<<< HEAD
          <div className="mt-1">
            <div className="text-xs md:text-sm font-semibold text-white/95 truncate">
              Booked
            </div>
            <div className="text-xs text-white/85 truncate font-medium">
=======
          <div className="mt-0.5">
            <div className="hidden sm:block text-[10px] md:text-sm font-semibold text-white/95 truncate">
              Booked
            </div>
            <div className="text-[9px] sm:text-[10px] md:text-xs text-white/85 truncate font-medium">
>>>>>>> b89f9f6 (initial commit)
              {booking.customerName}
            </div>
          </div>
        )}

<<<<<<< HEAD
        {/* Past day label */}
        {isPast && isCurrentMonth && !isBooked && (
          <div className="mt-1">
            <div className="text-xs text-najdi-muted-light font-medium">
=======
        {/* Past day label - hidden on small mobile */}
        {isPast && isCurrentMonth && !isBooked && (
          <div className="hidden sm:block mt-0.5">
            <div className="text-[10px] md:text-xs text-najdi-muted-light font-medium">
>>>>>>> b89f9f6 (initial commit)
              Unavailable
            </div>
          </div>
        )}

        {/* Available indicator */}
        {!isBooked && !isPast && isCurrentMonth && (
<<<<<<< HEAD
          <div className="absolute bottom-2 right-2">
            <div className="w-2 h-2 rounded-full bg-najdi-palm/25"></div>
=======
          <div className="absolute bottom-1 right-1 md:bottom-2 md:right-2">
            <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-najdi-palm/25"></div>
>>>>>>> b89f9f6 (initial commit)
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Calendar Header */}
<<<<<<< HEAD
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <button
          onClick={goToPreviousMonth}
          className="flex items-center px-4 py-2.5 text-sm md:text-base font-semibold text-najdi-text bg-najdi-cream border border-najdi-border rounded-xl hover:bg-najdi-sand hover:border-najdi-palm focus:outline-none focus:ring-2 focus:ring-najdi-palm focus:ring-offset-2 focus:ring-offset-najdi-sand transition-all duration-200 shadow-desert"
          aria-label="Previous month"
        >
          <svg
            className="w-5 h-5 mr-1.5"
=======
      <div className="flex items-center justify-between mb-4 md:mb-8">
        <button
          onClick={goToPreviousMonth}
          className="flex items-center p-2.5 md:px-4 md:py-2.5 text-sm md:text-base font-semibold text-najdi-text bg-najdi-cream border border-najdi-border rounded-xl hover:bg-najdi-sand hover:border-najdi-palm focus:outline-none focus:ring-2 focus:ring-najdi-palm transition-all duration-200 shadow-desert active:scale-95"
          aria-label="Previous month"
        >
          <svg
            className="w-5 h-5 md:mr-1.5"
>>>>>>> b89f9f6 (initial commit)
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M15 19l-7-7 7-7"
            />
          </svg>
<<<<<<< HEAD
          <span className="hidden sm:inline">Previous</span>
        </button>

        <div className="flex flex-col items-center">
          <h2 className="text-2xl md:text-3xl font-bold text-najdi-text font-serif">
=======
          <span className="hidden md:inline">Previous</span>
        </button>

        <div className="flex flex-col items-center">
          <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-najdi-text font-serif">
>>>>>>> b89f9f6 (initial commit)
            {monthName} {currentYear}
          </h2>
          <button
            onClick={goToToday}
<<<<<<< HEAD
            className="mt-2 text-sm font-semibold text-najdi-palm hover:text-najdi-palm-dark transition-colors duration-200"
=======
            className="mt-1 md:mt-2 text-xs md:text-sm font-semibold text-najdi-palm hover:text-najdi-palm-dark transition-colors duration-200"
>>>>>>> b89f9f6 (initial commit)
          >
            Go to Today
          </button>
        </div>

        <button
          onClick={goToNextMonth}
<<<<<<< HEAD
          className="flex items-center px-4 py-2.5 text-sm md:text-base font-semibold text-najdi-text bg-najdi-cream border border-najdi-border rounded-xl hover:bg-najdi-sand hover:border-najdi-palm focus:outline-none focus:ring-2 focus:ring-najdi-palm focus:ring-offset-2 focus:ring-offset-najdi-sand transition-all duration-200 shadow-desert"
          aria-label="Next month"
        >
          <span className="hidden sm:inline">Next</span>
          <svg
            className="w-5 h-5 ml-1.5"
=======
          className="flex items-center p-2.5 md:px-4 md:py-2.5 text-sm md:text-base font-semibold text-najdi-text bg-najdi-cream border border-najdi-border rounded-xl hover:bg-najdi-sand hover:border-najdi-palm focus:outline-none focus:ring-2 focus:ring-najdi-palm transition-all duration-200 shadow-desert active:scale-95"
          aria-label="Next month"
        >
          <span className="hidden md:inline">Next</span>
          <svg
            className="w-5 h-5 md:ml-1.5"
>>>>>>> b89f9f6 (initial commit)
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* Day Names Header */}
<<<<<<< HEAD
      <div className="grid grid-cols-7 gap-2 md:gap-3 mb-2 md:mb-3">
        {dayNames.map((day, index) => (
          <div
            key={index}
            className="p-2 md:p-3 text-center text-xs md:text-sm font-bold text-najdi-coffee bg-najdi-cream border border-najdi-border rounded-xl"
          >
            {day}
=======
      <div className="grid grid-cols-7 gap-1 sm:gap-2 md:gap-3 mb-1 sm:mb-2 md:mb-3">
        {dayNames.map((day, index) => (
          <div
            key={index}
            className="p-1.5 sm:p-2 md:p-3 text-center text-[10px] sm:text-xs md:text-sm font-bold text-najdi-coffee bg-najdi-cream border border-najdi-border rounded-lg md:rounded-xl"
          >
            <span className="sm:hidden">{day}</span>
            <span className="hidden sm:inline">{dayNamesFull[index]}</span>
>>>>>>> b89f9f6 (initial commit)
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
<<<<<<< HEAD
      <div className="grid grid-cols-7 gap-2 md:gap-3">
=======
      <div className="grid grid-cols-7 gap-1 sm:gap-2 md:gap-3">
>>>>>>> b89f9f6 (initial commit)
        {calendarDates.map((date, index) => renderDateCell(date, index))}
      </div>

      {/* Legend */}
<<<<<<< HEAD
      <div className="mt-6 md:mt-8 flex flex-wrap items-center justify-center gap-5 md:gap-8 text-sm md:text-base">
        <div className="flex items-center">
          <div className="w-5 h-5 bg-najdi-cream border border-najdi-border rounded-lg mr-2.5 shadow-desert"></div>
          <span className="font-medium text-najdi-text">Available</span>
        </div>
        <div className="flex items-center">
          <div className="w-5 h-5 bg-najdi-clay border border-najdi-clay-dark rounded-lg mr-2.5 shadow-desert"></div>
          <span className="font-medium text-najdi-text">Booked</span>
        </div>
        <div className="flex items-center">
          <div className="w-5 h-5 bg-najdi-cream border border-najdi-border rounded-lg mr-2.5 ring-2 ring-najdi-palm ring-offset-2 ring-offset-najdi-sand"></div>
          <span className="font-medium text-najdi-text">Today</span>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 text-center text-sm md:text-base text-najdi-muted font-medium">
        <p>Click any day to book or manage your reservation</p>
      </div>
=======
      <div className="mt-4 md:mt-8 flex flex-wrap items-center justify-center gap-3 md:gap-8 text-xs md:text-base">
        <div className="flex items-center">
          <div className="w-4 h-4 md:w-5 md:h-5 bg-najdi-cream border border-najdi-border rounded md:rounded-lg mr-1.5 md:mr-2.5"></div>
          <span className="font-medium text-najdi-text">Available</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 md:w-5 md:h-5 bg-najdi-clay border border-najdi-clay-dark rounded md:rounded-lg mr-1.5 md:mr-2.5"></div>
          <span className="font-medium text-najdi-text">Booked</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 md:w-5 md:h-5 bg-najdi-cream border border-najdi-border rounded md:rounded-lg mr-1.5 md:mr-2.5 ring-2 ring-najdi-palm ring-offset-1 ring-offset-najdi-sand"></div>
          <span className="font-medium text-najdi-text">Today</span>
        </div>
      </div>
>>>>>>> b89f9f6 (initial commit)
    </div>
  );
}
