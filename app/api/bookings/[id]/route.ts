import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateBookingSchema } from "@/lib/validation";
import { parseISOToDate } from "@/lib/date-utils";
import { Prisma } from "@prisma/client";

interface RouteContext {
  params: {
    id: string;
  };
}

/**
 * PATCH /api/bookings/:id
 * Update an existing booking (customerName and/or date)
 */
export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { id } = context.params;

    // Parse request body
    const body = await request.json();

    // Validate input
    const validationResult = updateBookingSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationResult.error.errors,
        },
        { status: 400 },
      );
    }

    const data = validationResult.data;

    // Check if booking exists
    const existingBooking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!existingBooking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Prepare update data
    const updateData: Prisma.BookingUpdateInput = {};

    if (data.customerName !== undefined) {
      updateData.customerName = data.customerName;
    }

    // Handle date update
    if (data.date !== undefined) {
      const newDate = parseISOToDate(data.date);

      // Check if the new date is different from current date
      const currentDate = existingBooking.date;
      const isSameDate =
        currentDate.getUTCFullYear() === newDate.getUTCFullYear() &&
        currentDate.getUTCMonth() === newDate.getUTCMonth() &&
        currentDate.getUTCDate() === newDate.getUTCDate();

      if (!isSameDate) {
        // Check if new date is already booked by another booking
        const conflictingBooking = await prisma.booking.findUnique({
          where: { date: newDate },
        });

        if (conflictingBooking && conflictingBooking.id !== id) {
          return NextResponse.json(
            {
              error: "Date conflict",
              message: "The selected date is already booked",
            },
            { status: 409 },
          );
        }

        updateData.date = newDate;
      }
    }

    // Only update if there are changes
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({
        booking: {
          ...existingBooking,
          date: existingBooking.date.toISOString().split("T")[0],
          createdAt: existingBooking.createdAt.toISOString(),
          updatedAt: existingBooking.updatedAt.toISOString(),
        },
        message: "No changes detected",
      });
    }

    // Update booking in a transaction to handle race conditions
    const updatedBooking = await prisma.$transaction(async (tx) => {
      // Double-check for date conflicts within transaction if date is changing
      if (updateData.date) {
        const newDate = updateData.date as Date;
        const conflictingBooking = await tx.booking.findUnique({
          where: { date: newDate },
        });

        if (conflictingBooking && conflictingBooking.id !== id) {
          throw new Error("DATE_CONFLICT");
        }
      }

      return tx.booking.update({
        where: { id },
        data: updateData,
      });
    });

    return NextResponse.json({
      booking: {
        ...updatedBooking,
        date: updatedBooking.date.toISOString().split("T")[0],
        createdAt: updatedBooking.createdAt.toISOString(),
        updatedAt: updatedBooking.updatedAt.toISOString(),
      },
    });
  } catch (error: any) {
    console.error("Error updating booking:", error);

    if (error.message === "DATE_CONFLICT") {
      return NextResponse.json(
        {
          error: "Date conflict",
          message: "The selected date is already booked",
        },
        { status: 409 },
      );
    }

    // Handle Prisma unique constraint error
    if (error.code === "P2002") {
      return NextResponse.json(
        {
          error: "Date conflict",
          message: "The selected date is already booked",
        },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: "Internal server error", message: "Failed to update booking" },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/bookings/:id
 * Cancel/delete a booking
 */
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { id } = context.params;

    // Check if booking exists
    const existingBooking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!existingBooking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Delete the booking
    await prisma.booking.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Booking cancelled successfully",
    });
  } catch (error: any) {
    console.error("Error deleting booking:", error);

    return NextResponse.json(
      { error: "Internal server error", message: "Failed to cancel booking" },
      { status: 500 },
    );
  }
}
