"use client";

import { useState } from "react";
import {
  getCalendarGrid,
  getMonthName,
  formatDateToISO,
  isToday,
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
    return bookings.find((b) => b.date === dateISO) || null;
  };

  // Get all calendar dates for the grid
  const calendarDates = getCalendarGrid(currentYear, currentMonth);
  const monthName = getMonthName(currentMonth);

  // Day names
  const dayNamesShort = ["S", "M", "T", "W", "T", "F", "S"];
  const dayNamesFull = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Handle date cell click
  const handleDateClick = (date: Date) => {
    const booking = getBookingForDate(date);
    onDateClick(date, booking);
  };

  // Render a single date cell
  const renderDateCell = (date: Date, index: number) => {
    const isCurrentMonth = date.getUTCMonth() + 1 === currentMonth;
    const isTodayDate = isToday(date);
    const booking = getBookingForDate(date);
    const isBooked = booking !== null;

    // Only allow clicks for current month days (clean UX)
    const isClickable = isCurrentMonth;

    // Base classes - Najdi desert theme
    let cellClasses =
      "relative min-h-[60px] sm:min-h-[80px] md:min-h-[110px] p-1 sm:p-1.5 md:p-3 border transition-all duration-300 rounded-lg md:rounded-xl ";

    if (!isCurrentMonth) {
      cellClasses +=
        "bg-najdi-sand/40 text-najdi-muted-light/50 border-najdi-border/40 cursor-default ";
    } else if (isBooked) {
      cellClasses +=
        "bg-najdi-clay border-najdi-clay-dark hover:bg-najdi-clay-dark shadow-desert cursor-pointer active:scale-[0.97] ";
    } else {
      cellClasses +=
        "bg-najdi-cream border-najdi-border hover:bg-najdi-sand hover:shadow-desert hover:-translate-y-0.5 cursor-pointer active:scale-[0.97] ";
    }

    // Today highlight - palm green ring
    if (isTodayDate && isCurrentMonth) {
      cellClasses +=
        "ring-2 ring-najdi-palm ring-offset-1 md:ring-offset-2 ring-offset-najdi-sand ";
    }

    return (
      <div
        key={index}
        className={cellClasses}
        onClick={() => isClickable && handleDateClick(date)}
        role={isClickable ? "button" : undefined}
        tabIndex={isClickable ? 0 : -1}
        onKeyDown={(e) => {
          if (e.key === "Enter" && isClickable) handleDateClick(date);
        }}
        aria-label={`${date.getUTCDate()} ${monthName} ${currentYear}${
          !isCurrentMonth
            ? ""
            : isBooked
              ? `, Booked by ${booking?.customerName}`
              : ", Available"
        }`}
        aria-disabled={!isClickable}
      >
        {/* Date number */}
        <div className="flex items-center justify-between mb-0.5 md:mb-1">
          <span
            className={`text-sm md:text-lg font-semibold ${
              isTodayDate && isCurrentMonth
                ? "text-najdi-palm"
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
            <span className="hidden sm:inline text-[10px] md:text-xs font-semibold text-najdi-palm bg-najdi-palm/10 px-1.5 py-0.5 rounded-full">
              Today
            </span>
          )}
        </div>

        {/* Booking info */}
        {isBooked && isCurrentMonth && (
          <div className="mt-0.5">
            <div className="hidden sm:block text-[10px] md:text-sm font-semibold text-white/95 truncate">
              Booked
            </div>
            <div className="text-[9px] sm:text-[10px] md:text-xs text-white/85 truncate font-medium">
              {booking?.customerName}
            </div>
          </div>
        )}

        {/* Available indicator */}
        {!isBooked && isCurrentMonth && (
          <div className="absolute bottom-1 right-1 md:bottom-2 md:right-2">
            <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-najdi-palm/25"></div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4 md:mb-8">
        <button
          onClick={goToPreviousMonth}
          className="flex items-center p-2.5 md:px-4 md:py-2.5 text-sm md:text-base font-semibold text-najdi-text bg-najdi-cream border border-najdi-border rounded-xl hover:bg-najdi-sand hover:border-najdi-palm focus:outline-none focus:ring-2 focus:ring-najdi-palm transition-all duration-200 shadow-desert active:scale-95"
          aria-label="Previous month"
        >
          <svg
            className="w-5 h-5 md:mr-1.5"
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
          <span className="hidden md:inline">Previous</span>
        </button>

        <div className="flex flex-col items-center">
          <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-najdi-text font-serif">
            {monthName} {currentYear}
          </h2>
          <button
            onClick={goToToday}
            className="mt-1 md:mt-2 text-xs md:text-sm font-semibold text-najdi-palm hover:text-najdi-palm-dark transition-colors duration-200"
          >
            Go to Today
          </button>
        </div>

        <button
          onClick={goToNextMonth}
          className="flex items-center p-2.5 md:px-4 md:py-2.5 text-sm md:text-base font-semibold text-najdi-text bg-najdi-cream border border-najdi-border rounded-xl hover:bg-najdi-sand hover:border-najdi-palm focus:outline-none focus:ring-2 focus:ring-najdi-palm transition-all duration-200 shadow-desert active:scale-95"
          aria-label="Next month"
        >
          <span className="hidden md:inline">Next</span>
          <svg
            className="w-5 h-5 md:ml-1.5"
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
      <div className="grid grid-cols-7 gap-1 sm:gap-2 md:gap-3 mb-1 sm:mb-2 md:mb-3">
        {dayNamesShort.map((d, i) => (
          <div
            key={i}
            className="p-1.5 sm:p-2 md:p-3 text-center text-[10px] sm:text-xs md:text-sm font-bold text-najdi-coffee bg-najdi-cream border border-najdi-border rounded-lg md:rounded-xl"
          >
            <span className="sm:hidden">{d}</span>
            <span className="hidden sm:inline">{dayNamesFull[i]}</span>
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2 md:gap-3">
        {calendarDates.map((date, index) => renderDateCell(date, index))}
      </div>

      {/* Legend */}
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

      {/* Instructions */}
      <div className="mt-4 text-center text-xs md:text-base text-najdi-muted font-medium">
        <p>Click any day to book or manage your reservation</p>
      </div>
    </div>
  );
}