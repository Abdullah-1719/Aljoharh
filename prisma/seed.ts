import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seeding...");

  // Clear existing bookings
  console.log("Clearing existing bookings...");
  await prisma.booking.deleteMany({});

  // Get current date to create relative sample bookings
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1; // JavaScript months are 0-indexed

  // Helper function to create ISO date string
  const createISODate = (year: number, month: number, day: number): string => {
    const monthStr = month.toString().padStart(2, "0");
    const dayStr = day.toString().padStart(2, "0");
    return `${year}-${monthStr}-${dayStr}`;
  };

  // Create sample bookings - single day only
  const sampleBookings = [
    {
      customerName: "Abdullah Al-Rashid",
      date: createISODate(currentYear, currentMonth, 5),
    },
    {
      customerName: "Fatima Hassan",
      date: createISODate(currentYear, currentMonth, 8),
    },
    {
      customerName: "Mohammed Al-Farsi",
      date: createISODate(currentYear, currentMonth, 12),
    },
    {
      customerName: "Sara Ahmed",
      date: createISODate(currentYear, currentMonth, 15),
    },
    {
      customerName: "Khalid Ibrahim",
      date: createISODate(currentYear, currentMonth, 18),
    },
    {
      customerName: "Noura Al-Sabah",
      date: createISODate(currentYear, currentMonth, 22),
    },
    {
      customerName: "Omar Al-Mutairi",
      date: createISODate(currentYear, currentMonth, 25),
    },
  ];

  // Add bookings for next month as well
  const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
  const nextMonthYear = currentMonth === 12 ? currentYear + 1 : currentYear;

  sampleBookings.push(
    {
      customerName: "Layla Al-Qahtani",
      date: createISODate(nextMonthYear, nextMonth, 3),
    },
    {
      customerName: "Faisal Al-Dosari",
      date: createISODate(nextMonthYear, nextMonth, 7),
    },
    {
      customerName: "Huda Al-Shammari",
      date: createISODate(nextMonthYear, nextMonth, 14),
    },
  );

  // Insert sample bookings
  console.log("Inserting sample bookings...");
  for (const booking of sampleBookings) {
    const created = await prisma.booking.create({
      data: booking,
    });
    console.log(`Created booking: ${created.customerName} on ${created.date}`);
  }

  console.log("Database seeding completed successfully!");
  console.log(`Total bookings created: ${sampleBookings.length}`);
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
