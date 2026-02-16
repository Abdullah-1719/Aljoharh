import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AlJoharah - Booking Calendar",
  description:
    "AlJoharah booking calendar for reservations",
  keywords: [
    "booking",
    "calendar",
    "reservation",
    "saudi",
  ],
  authors: [{ name: "AlJoharah" }],
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  themeColor: "#2F4F3A",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <div className="min-h-screen bg-najdi-sand">{children}</div>
      </body>
    </html>
  );
}
