"use client";

import { useEffect, useState } from "react";
import type { Booking } from "@/components/Calendar";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  booking?: Booking | null;
  onSuccess: () => void;
  showToast: (message: string, type: "success" | "error") => void;
}

export default function BookingModal({
  isOpen,
  onClose,
  selectedDate,
  booking,
  onSuccess,
  showToast,
}: BookingModalProps) {
  const [customerName, setCustomerName] = useState("");
  const [selectedBookingDate, setSelectedBookingDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditing = Boolean(booking);

  const formatDateForInput = (date: Date): string => {
    return date.toISOString().split("T")[0];
  };

  useEffect(() => {
    if (!isOpen) return;

    if (booking) {
      setCustomerName(booking.customerName);
      setSelectedBookingDate(booking.date);
    } else {
      setCustomerName("");
      setSelectedBookingDate(formatDateForInput(selectedDate));
    }

    setErrors({});
  }, [isOpen, booking, selectedDate]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (customerName.trim().length < 2) {
      newErrors.customerName = "Name must be at least 2 characters";
    }

    if (!selectedBookingDate) {
      newErrors.date = "Please select a date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const url = isEditing ? `/api/bookings/${booking!.id}` : "/api/bookings";
      const method = isEditing ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: customerName.trim(),
          date: selectedBookingDate,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || data?.message || "Failed to save booking");
      }

      showToast(isEditing ? "Booking updated!" : "Booking created!", "success");
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error("Error saving booking:", err);
      showToast(err?.message || "Failed to save booking", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!booking) return;

    if (!confirm("Cancel this booking?")) return;

    setIsLoading(true);

    try {
      const response = await fetch(`/api/bookings/${booking.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Failed to cancel booking");
      }

      showToast("Booking cancelled!", "success");
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error("Error cancelling booking:", err);
      showToast(err?.message || "Failed to cancel booking", "error");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <button
        aria-label="Close modal"
        className="absolute inset-0 bg-najdi-coffee/50 backdrop-blur-sm"
        onClick={onClose}
        disabled={isLoading}
      />

      {/* Modal */}
      <div className="relative flex min-h-full items-end sm:items-center justify-center p-0 sm:p-4">
        <div className="relative w-full sm:max-w-md bg-najdi-cream border border-najdi-border shadow-sunlight rounded-t-2xl sm:rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-najdi-palm via-najdi-coffee to-najdi-palm px-5 py-4 md:px-6 md:py-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-white font-serif">
                  {isEditing ? "Edit Reservation" : "New Reservation"}
                </h2>
                <p className="text-xs md:text-sm text-white/80 mt-0.5">
                  {isEditing ? "Update or cancel booking" : "Book your perfect day"}
                </p>
              </div>

              <button
                onClick={onClose}
                className="text-white/80 hover:text-white transition-colors duration-200 p-2 hover:bg-white/10 rounded-xl active:scale-90"
                disabled={isLoading}
                aria-label="Close"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-5 md:p-6 space-y-4 md:space-y-5">
            <div>
              <label className="block text-sm font-semibold text-najdi-text mb-1.5" htmlFor="customerName">
                Name *
              </label>
              <input
                id="customerName"
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                disabled={isLoading}
                autoComplete="name"
                placeholder="Enter your name"
                className={`w-full px-4 py-3.5 text-base border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-najdi-palm bg-white text-najdi-text transition-all duration-200 ${
                  errors.customerName
                    ? "border-najdi-clay bg-najdi-clay/5"
                    : "border-najdi-border hover:border-najdi-clay-light"
                }`}
              />
              {errors.customerName && (
                <p className="mt-1.5 text-sm text-najdi-clay-dark font-medium">{errors.customerName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-najdi-text mb-1.5" htmlFor="date">
                Reservation Date *
              </label>
              <input
                id="date"
                type="date"
                value={selectedBookingDate}
                onChange={(e) => setSelectedBookingDate(e.target.value)}
                disabled={isLoading}
                className={`w-full px-4 py-3.5 text-base border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-najdi-palm bg-white text-najdi-text transition-all duration-200 ${
                  errors.date
                    ? "border-najdi-clay bg-najdi-clay/5"
                    : "border-najdi-border hover:border-najdi-clay-light"
                }`}
              />
              {errors.date && <p className="mt-1.5 text-sm text-najdi-clay-dark font-medium">{errors.date}</p>}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-najdi-palm text-white py-4 px-6 rounded-xl hover:bg-najdi-palm-dark focus:outline-none focus:ring-2 focus:ring-najdi-palm focus:ring-offset-2 focus:ring-offset-najdi-cream disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-desert-md hover:shadow-desert-lg text-base md:text-lg active:scale-[0.98]"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Saving...
                  </span>
                ) : isEditing ? (
                  "Update Booking"
                ) : (
                  "Confirm Reservation"
                )}
              </button>

              {isEditing && (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isLoading}
                  className="px-5 py-4 border-2 border-najdi-clay text-najdi-clay rounded-xl hover:bg-najdi-clay hover:text-white focus:outline-none focus:ring-2 focus:ring-najdi-clay focus:ring-offset-2 focus:ring-offset-najdi-cream disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold active:scale-[0.98]"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}