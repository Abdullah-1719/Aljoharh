import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createBookingSchema, monthQuerySchema } from "@/lib/validation";
import {
  parseISOToDate,
  getFirstDayOfMonth,
  getLastDayOfMonth,
} from "@/lib/date-utils";

/**
 * GET /api/bookings?month=YYYY-MM
 * Fetch all bookings for the specified month
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const monthParam = searchParams.get("month");

    // Validate month parameter
    const validationResult = monthQuerySchema.safeParse({ month: monthParam });

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid month format. Use YYYY-MM format.",
          details: validationResult.error.flatten(),
        },
        { status: 400 },
      );
    }

    const { month } = validationResult.data;
    const [year, monthNum] = month.split("-").map(Number);

    // Get the first and last day of the requested month
    const monthStart = getFirstDayOfMonth(year, monthNum);
    const monthEnd = getLastDayOfMonth(year, monthNum);

    // Fetch all bookings for this month
    const bookings = await prisma.booking.findMany({
      where: {
        AND: [{ date: { gte: monthStart } }, { date: { lte: monthEnd } }],
      },
      orderBy: {
        date: "asc",
      },
    });

    // Format dates as ISO strings for JSON response
    const formattedBookings = bookings.map((booking) => ({
      ...booking,
      date: booking.date.toISOString().split("T")[0],
      createdAt: booking.createdAt.toISOString(),
      updatedAt: booking.updatedAt.toISOString(),
    }));

    return NextResponse.json({ bookings: formattedBookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 },
    );
  }
}

/**
 * POST /api/bookings
 * Create a new single-day booking
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validationResult = createBookingSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationResult.error.flatten(),
        },
        { status: 400 },
      );
    }

    const { customerName, date } = validationResult.data;

    // Parse date
    const bookingDate = parseISOToDate(date);

    // Use transaction to prevent race conditions
    const booking = await prisma.$transaction(async (tx) => {
      // Check if date is already booked (unique constraint)
      const existingBooking = await tx.booking.findUnique({
        where: { date: bookingDate },
      });

      if (existingBooking) {
        throw new Error("DATE_ALREADY_BOOKED");
      }

      // Create the booking
      return tx.booking.create({
        data: {
          customerName,
          date: bookingDate,
        },
      });
    });

    // Format response
    const formattedBooking = {
      ...booking,
      date: booking.date.toISOString().split("T")[0],
      createdAt: booking.createdAt.toISOString(),
      updatedAt: booking.updatedAt.toISOString(),
    };

    return NextResponse.json({ booking: formattedBooking }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating booking:", error);

    if (error.message === "DATE_ALREADY_BOOKED") {
      return NextResponse.json(
        { error: "This date is already booked" },
        { status: 409 },
      );
    }

    // Handle Prisma unique constraint error
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "This date is already booked" },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 },
    );
  }
}
