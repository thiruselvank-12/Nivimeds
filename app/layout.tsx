import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Nivimeds — Simply Trust", template: "%s | Nivimeds" },
  description:
    "Nivimeds Pharmacy — Your trusted online destination for authentic medicines, lab tests, doctor consultations and healthcare products. Fast delivery across India.",
  keywords: ["online pharmacy", "medicines", "lab tests", "doctor consultation", "Nivimeds"],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://www.nivimeds.com",
    siteName: "Nivimeds Pharmacy",
    title: "Nivimeds — Simply Trust",
    description: "Authentic medicines, lab tests & doctor consultations. Fast delivery across India.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#1E6FD9",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased font-sans bg-[#F5F9FF] text-gray-800">
        <style>{`
          .scrollbar-hide::-webkit-scrollbar { display: none; }
          .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
        {children}
      </body>
    </html>
  );
}
