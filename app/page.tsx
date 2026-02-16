"use client";

import { useState, useEffect, useCallback } from "react";
import Calendar, { Booking } from "@/components/Calendar";
import BookingModal from "@/components/BookingModal";
import { ToastContainer, useToast } from "@/components/Toast";

export default function Home() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const [isLoading, setIsLoading] = useState(true);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Toast notifications
  const { toasts, showToast, dismissToast } = useToast();

  // Fetch bookings for the current month
  const fetchBookings = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/bookings?month=${currentMonth}`);

      if (!response.ok) {
        throw new Error("Failed to fetch bookings");
      }

      const data = await response.json();
      setBookings(data.bookings || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      showToast(
        "error",
        "Failed to load bookings",
        "Please refresh the page to try again",
      );
    } finally {
      setIsLoading(false);
    }
  }, [currentMonth, showToast]);

  // Initial fetch and when month changes
  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Handle date click from calendar
  const handleDateClick = (date: Date, booking: Booking | null) => {
    setSelectedDate(date);
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
    setSelectedBooking(null);
  };

  // Handle successful booking operation
  const handleBookingSuccess = () => {
    fetchBookings();
  };

  // Get current month and year for display
  const [year, month] = currentMonth.split("-").map(Number);
  const monthNames = [
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

  return (
    <main className="min-h-screen bg-najdi-sand">
      {/* Hero Section with Background Image */}
      <div className="hero-section" style={{ minHeight: "48vh" }}>
        <div className="hero-overlay" />
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8" style={{ minHeight: "48vh" }}>
          {/* Decorative top line */}
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px w-16 bg-white/40"></div>
            <div className="w-2 h-2 rotate-45 border border-white/50"></div>
            <div className="h-px w-16 bg-white/40"></div>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight text-shadow-hero font-serif">
            AlJoharah
          </h1>
          <p className="mt-3 text-xl md:text-2xl text-white/90 font-light tracking-wide text-shadow-subtle">
            Reserve Your Perfect Day
          </p>

          {/* Decorative divider */}
          <div className="mt-6 flex items-center gap-3">
            <div className="h-px w-20 bg-white/30"></div>
            <span className="text-white/70 text-sm tracking-widest uppercase font-light">
              Booking Calendar
            </span>
            <div className="h-px w-20 bg-white/30"></div>
          </div>

          {/* Decorative bottom ornament */}
          <div className="mt-8 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-white/30"></div>
            <div className="w-2 h-2 rounded-full bg-white/50"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-white/30"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-najdi-palm/10 mb-4">
                <svg
                  className="animate-spin h-8 w-8 text-najdi-palm"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
              <p className="text-najdi-muted font-medium">Loading calendar...</p>
            </div>
          </div>
        )}

        {/* Calendar */}
        {!isLoading && (
          <div className="bg-najdi-cream rounded-2xl shadow-desert-lg p-6 md:p-8 lg:p-10 border border-najdi-border">
            <Calendar bookings={bookings} onDateClick={handleDateClick} />
          </div>
        )}

        {/* Booking Summary */}
        {!isLoading && bookings.length > 0 && (
          <div className="mt-10 md:mt-14">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-najdi-text font-serif">
                {monthNames[month - 1]} {year} Reservations
              </h2>
              <span className="text-sm font-medium text-najdi-palm bg-najdi-palm/10 px-4 py-2 rounded-full">
                {bookings.length} booking{bookings.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="grid gap-4 md:gap-5">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-najdi-cream rounded-xl shadow-desert p-5 md:p-6 border border-najdi-border hover:border-najdi-clay hover:shadow-desert-md transition-all duration-300 cursor-pointer"
                  onClick={() => {
                    const date = new Date(booking.date);
                    setSelectedDate(date);
                    setSelectedBooking(booking);
                    setIsModalOpen(true);
                  }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-14 h-14 bg-najdi-palm rounded-xl flex flex-col items-center justify-center text-white shadow-desert">
                        <span className="text-xs font-semibold uppercase">
                          {new Date(booking.date).toLocaleDateString("en-US", {
                            month: "short",
                          })}
                        </span>
                        <span className="text-xl font-bold">
                          {new Date(booking.date).getDate()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-najdi-text mb-1">
                          {booking.customerName}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-najdi-muted">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <span>
                            {new Date(booking.date).toLocaleDateString(
                              "en-US",
                              {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              },
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        className="px-4 py-2 text-sm font-medium text-najdi-palm bg-najdi-palm/10 rounded-xl hover:bg-najdi-palm/20 transition-all duration-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          const date = new Date(booking.date);
                          setSelectedDate(date);
                          setSelectedBooking(booking);
                          setIsModalOpen(true);
                        }}
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && bookings.length === 0 && (
          <div className="mt-10 md:mt-14 bg-najdi-cream rounded-2xl shadow-desert-lg p-12 md:p-16 text-center border border-najdi-border">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-najdi-palm/10 rounded-full mb-6">
              <svg
                className="w-10 h-10 text-najdi-palm"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-najdi-text mb-3 font-serif">
              No Reservations Yet
            </h3>
            <p className="text-najdi-muted text-lg mb-6 max-w-md mx-auto">
              Click on any available date in the calendar above to make your
              first booking
            </p>
            <div className="inline-flex items-center gap-2 text-sm text-najdi-muted bg-najdi-sand px-4 py-2 rounded-full">
              <svg
                className="w-5 h-5 text-najdi-clay"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Single day reservations only</span>
            </div>
          </div>
        )}

      </div>

      {/* Booking Modal */}
      {selectedDate && (
        <BookingModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          selectedDate={selectedDate}
          booking={selectedBooking}
          onSuccess={handleBookingSuccess}
          showToast={(message, type) => {
            if (type === "success") {
              showToast("success", message);
            } else {
              showToast("error", message);
            }
          }}
        />
      )}

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

    </main>
  );
}
