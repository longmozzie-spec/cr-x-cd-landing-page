import type { Metadata } from "next";
import { workshop } from "@/config/workshop";
import "./globals.css";

export const metadata: Metadata = {
  title: `${workshop.brand} | ${workshop.title} Workshop`,
  description: workshop.description,
  openGraph: {
    title: `${workshop.brand} | ${workshop.title} Workshop`,
    description: workshop.description,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
