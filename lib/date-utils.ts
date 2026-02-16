/**
 * Date utility functions for the AlJoharah Booking Calendar
 * All functions work with Date objects and ISO date strings (YYYY-MM-DD)
 */

/**
 * Format a Date object to ISO date string (YYYY-MM-DD)
 */
export function formatDateToISO(date: Date): string {
  return date.toISOString().split("T")[0];
}

/**
 * Parse an ISO date string to a Date object
 * Returns a date at midnight UTC to avoid timezone issues
 */
export function parseISOToDate(isoString: string): Date {
  const [year, month, day] = isoString.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

/**
 * Get the first day of a month
 */
export function getFirstDayOfMonth(year: number, month: number): Date {
  return new Date(Date.UTC(year, month - 1, 1));
}

/**
 * Get the last day of a month
 */
export function getLastDayOfMonth(year: number, month: number): Date {
  return new Date(Date.UTC(year, month, 0));
}

/**
 * Get the number of days in a month
 */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

/**
 * Get all dates in a month as an array of Date objects
 */
export function getDatesInMonth(year: number, month: number): Date[] {
  const daysInMonth = getDaysInMonth(year, month);
  const dates: Date[] = [];

  for (let day = 1; day <= daysInMonth; day++) {
    dates.push(new Date(Date.UTC(year, month - 1, day)));
  }

  return dates;
}

/**
 * Get the day of the week for a date (0 = Sunday, 6 = Saturday)
 */
export function getDayOfWeek(date: Date): number {
  return date.getUTCDay();
}

/**
 * Get calendar grid dates for a month (includes padding days from prev/next months)
 * Returns a flat array of dates that form a complete calendar grid
 */
export function getCalendarGrid(year: number, month: number): Date[] {
  const firstDay = getFirstDayOfMonth(year, month);
  const datesInMonth = getDatesInMonth(year, month);

  const grid: Date[] = [];

  // Get the day of week for the first day (0 = Sunday)
  const firstDayOfWeek = getDayOfWeek(firstDay);

  // Add padding days from previous month
  if (firstDayOfWeek > 0) {
    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;
    const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);

    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      grid.push(
        new Date(Date.UTC(prevYear, prevMonth - 1, daysInPrevMonth - i)),
      );
    }
  }

  // Add all days of current month
  grid.push(...datesInMonth);

  // Add padding days from next month to complete the grid (6 rows x 7 days = 42)
  const remainingDays = 42 - grid.length;
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;

  for (let i = 1; i <= remainingDays; i++) {
    grid.push(new Date(Date.UTC(nextYear, nextMonth - 1, i)));
  }

  return grid;
}

/**
 * Format a date for display (e.g., "Jan 15")
 */
export function formatDateForDisplay(date: Date): string {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${months[date.getUTCMonth()]} ${date.getUTCDate()}`;
}

/**
 * Format a date for full display (e.g., "January 15, 2024")
 */
export function formatDateForFullDisplay(date: Date): string {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return `${months[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}`;
}

/**
 * Get month name from month number (1-12)
 */
export function getMonthName(month: number): string {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return months[month - 1] || "";
}

/**
 * Add days to a date
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

/**
 * Check if two dates are the same day (ignoring time)
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getUTCFullYear() === date2.getUTCFullYear() &&
    date1.getUTCMonth() === date2.getUTCMonth() &&
    date1.getUTCDate() === date2.getUTCDate()
  );
}

/**
 * Check if a date is today (handles timezone offset correctly)
 * Calendar dates are stored as UTC midnight, so we convert local "today" to UTC midnight for comparison
 */
export function isToday(date: Date): boolean {
  const now = new Date();
  const todayUTC = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
  return isSameDay(date, todayUTC);
}
