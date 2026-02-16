"use client";

import { useState, useEffect } from "react";
import { Booking } from "./Calendar";

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

  const isEditing = !!booking;

  // Format date to YYYY-MM-DD for input
  const formatDateForInput = (date: Date): string => {
    return date.toISOString().split("T")[0];
  };

  // Initialize form when modal opens
  useEffect(() => {
    if (isOpen) {
      if (booking) {
        // Editing mode - populate with existing data
        setCustomerName(booking.customerName);
        setSelectedBookingDate(booking.date);
      } else {
        // Creating mode - set defaults
        setCustomerName("");
        setSelectedBookingDate(formatDateForInput(selectedDate));
      }
      setErrors({});
    }
  }, [isOpen, booking, selectedDate]);

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (customerName.trim().length < 2) {
      newErrors.customerName = "Customer name must be at least 2 characters";
    }

    if (!selectedBookingDate) {
      newErrors.date = "Please select a date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const url = isEditing ? `/api/bookings/${booking.id}` : "/api/bookings";
      const method = isEditing ? "PATCH" : "POST";

      const body: any = {
        customerName: customerName.trim(),
        date: selectedBookingDate,
      };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || "Failed to save booking");
      }

      showToast(
        isEditing
          ? "Booking updated successfully!"
          : "Booking created successfully!",
        "success",
      );
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Error saving booking:", error);
      showToast(error.message || "Failed to save booking", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle booking deletion
  const handleDelete = async () => {
    if (!booking) return;

    if (!confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/bookings/${booking.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to cancel booking");
      }

      showToast("Booking cancelled successfully!", "success");
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Error cancelling booking:", error);
      showToast(error.message || "Failed to cancel booking", "error");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-najdi-coffee/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal - Reservation Card Style */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-najdi-cream rounded-2xl shadow-sunlight max-w-md w-full border border-najdi-border overflow-hidden">
          {/* Header Banner - warm desert gradient */}
          <div className="bg-gradient-to-r from-najdi-palm via-najdi-coffee to-najdi-palm px-6 py-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white font-serif">
                  {isEditing ? "Edit Reservation" : "New Reservation"}
                </h2>
                <p className="text-sm text-white/80 mt-1">
                  {isEditing
                    ? "Update or cancel booking"
                    : "Book your perfect day"}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white transition-colors duration-200 p-2 hover:bg-white/10 rounded-xl"
                disabled={isLoading}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>

          {/* Form - paper/cream background */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Customer Name */}
            <div>
              <label
                htmlFor="customerName"
                className="block text-sm font-semibold text-najdi-text mb-2"
              >
                Customer Name *
              </label>
              <input
                type="text"
                id="customerName"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-najdi-palm bg-white text-najdi-text placeholder-najdi-muted/60 transition-all duration-200 ${
                  errors.customerName
                    ? "border-najdi-clay bg-najdi-clay/5"
                    : "border-najdi-border hover:border-najdi-clay-light"
                }`}
                placeholder="Enter your name (min 2 characters)"
                disabled={isLoading}
              />
              {errors.customerName && (
                <p className="mt-2 text-sm text-najdi-clay-dark font-medium">
                  {errors.customerName}
                </p>
              )}
            </div>

            {/* Date */}
            <div>
              <label
                htmlFor="date"
                className="block text-sm font-semibold text-najdi-text mb-2"
              >
                Reservation Date *
              </label>
              <input
                type="date"
                id="date"
                value={selectedBookingDate}
                onChange={(e) => setSelectedBookingDate(e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-najdi-palm bg-white text-najdi-text transition-all duration-200 ${
                  errors.date
                    ? "border-najdi-clay bg-najdi-clay/5"
                    : "border-najdi-border hover:border-najdi-clay-light"
                }`}
                disabled={isLoading}
              />
              {errors.date && (
                <p className="mt-2 text-sm text-najdi-clay-dark font-medium">
                  {errors.date}
                </p>
              )}
              <p className="mt-2 text-xs text-najdi-muted">
                Single day reservation
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-3">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-najdi-palm text-white py-3.5 px-6 rounded-xl hover:bg-najdi-palm-dark focus:outline-none focus:ring-2 focus:ring-najdi-palm focus:ring-offset-2 focus:ring-offset-najdi-cream disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-desert-md hover:shadow-desert-lg text-lg"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                  className="px-6 py-3.5 border-2 border-najdi-clay text-najdi-clay rounded-xl hover:bg-najdi-clay hover:text-white focus:outline-none focus:ring-2 focus:ring-najdi-clay focus:ring-offset-2 focus:ring-offset-najdi-cream disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold"
                >
                  Cancel
                </button>
              )}
            </div>

            {/* Help text */}
            <div className="text-center pt-2 border-t border-najdi-border">
              <p className="text-xs text-najdi-muted">
                Need help? Contact us at +966 XX XXX XXXX
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
