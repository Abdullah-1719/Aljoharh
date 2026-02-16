# Istiraha Booking Calendar

A minimal, mobile-friendly booking calendar web application for managing istiraha (rest house) reservations.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Validation**: Zod
- **Deployment**: Vercel-ready

## Features

- 📅 Monthly calendar view with booking status
- 🏠 Single day or date range booking
- ✏️ Edit existing bookings (name, phone, dates)
- ❌ Cancel bookings
- 🔒 Prevents double booking with overlap detection
- 📱 Mobile-first responsive design
- 🔔 Toast notifications for user feedback

## Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
npm install
```

### 2. Configure PostgreSQL Database

Create a PostgreSQL database:

```bash
# Using psql
createdb istiraha_booking

# Or using SQL
psql postgres
CREATE DATABASE istiraha_booking;
```

### 3. Set Up Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and configure your database URL:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/istiraha_booking?schema=public"
```

### 4. Run Database Migrations

Generate Prisma client and run migrations:

```bash
npx prisma migrate dev --name init
```

### 5. Seed the Database (Optional)

Add sample bookings for testing:

```bash
npx prisma db seed
```

### 6. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Endpoints

### GET /api/bookings

Get all bookings for a specific month.

**Query Parameters:**
- `month` (required): Month in YYYY-MM format

**Response:**
```json
{
  "bookings": [
    {
      "id": "uuid",
      "customerName": "Abdullah",
      "phone": "+966501234567",
      "checkIn": "2024-01-15",
      "checkOut": "2024-01-18",
      "createdAt": "2024-01-10T10:00:00Z",
      "updatedAt": "2024-01-10T10:00:00Z"
    }
  ]
}
```

### POST /api/bookings

Create a new booking.

**Request Body:**
```json
{
  "customerName": "Abdullah",
  "phone": "+966501234567",
  "checkIn": "2024-01-15",
  "checkOut": "2024-01-18"
}
```

**Response:**
```json
{
  "booking": {
    "id": "uuid",
    "customerName": "Abdullah",
    "phone": "+966501234567",
    "checkIn": "2024-01-15",
    "checkOut": "2024-01-18",
    "createdAt": "2024-01-10T10:00:00Z",
    "updatedAt": "2024-01-10T10:00:00Z"
  }
}
```

### PATCH /api/bookings/:id

Update an existing booking.

**Request Body:**
```json
{
  "customerName": "Abdullah Updated",
  "phone": "+966501234568",
  "checkIn": "2024-01-16",
  "checkOut": "2024-01-19"
}
```

### DELETE /api/bookings/:id

Cancel/delete a booking.

**Response:**
```json
{
  "success": true
}
```

## Business Rules

### Booking Logic

- Bookings use `[checkIn, checkOut)` logic (half-open interval)
- `checkIn` date is included in the booking
- `checkOut` date is the **first non-booked day** (excluded from booking)
- Example: Booking from Jan 15 to Jan 18 means nights of Jan 15, 16, and 17

### Validation

- `customerName`: Required, minimum 2 characters
- `phone`: Optional
- `checkOut` must be after `checkIn`
- No overlapping bookings allowed

### Concurrency

- Race conditions are handled at the database level using Prisma transactions
- Overlap detection uses database queries to ensure data integrity

## Deployment to Vercel

### Option 1: Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Set environment variables in Vercel dashboard or CLI:
```bash
vercel env add DATABASE_URL
```

### Option 2: GitHub Integration

1. Push your code to GitHub

2. Go to [vercel.com](https://vercel.com) and sign up/log in

3. Click "Import Project"

4. Select your GitHub repository

5. Configure environment variables:
   - Add `DATABASE_URL` with your production database URL

6. Click "Deploy"

### Database Setup for Production

For production, use a managed PostgreSQL service:

- **Vercel Postgres** (recommended for Vercel deployment)
- **Supabase**
- **Railway**
- **PlanetScale**
- **Neon**

Update your `DATABASE_URL` environment variable with the production database URL.

## Project Structure

```
/
├── app/
│   ├── api/
│   │   └── bookings/
│   │       ├── route.ts          # GET, POST handlers
│   │       └── [id]/
│   │           └── route.ts      # PATCH, DELETE handlers
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page with calendar
│   └── globals.css               # Global styles
├── components/
│   ├── Calendar.tsx              # Calendar component
│   ├── BookingModal.tsx          # Booking modal (create/edit)
│   └── Toast.tsx                 # Toast notification component
├── lib/
│   ├── prisma.ts                 # Prisma client singleton
│   ├── date-utils.ts             # Date formatting utilities
│   └── validation.ts             # Zod validation schemas
├── prisma/
│   ├── schema.prisma             # Database schema
│   └── seed.ts                   # Seed data script
├── .env.example                  # Environment variables template
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## Development

### Database Management

Open Prisma Studio to view/edit data:

```bash
npx prisma studio
```

### Reset Database

```bash
npx prisma migrate reset
```

### Generate Prisma Client

```bash
npx prisma generate
```

## License

MIT