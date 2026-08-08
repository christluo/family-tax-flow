import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 1. Updated Metadata for your app
export const metadata: Metadata = {
  title: "Family Tax-Flow Engine",
  description: "Paycheck-to-Wealth Allocation Router",
  verification: {
    google: '5aDaW9z5hzdDzeUrIZAjh8fvBGcgRp5qbQmS9R2yZrQ', // <-- Paste ONLY your code string here
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}

        {/* 2. Added Lemon Squeezy Script Here */}
        <Script 
          src="https://app.lemonsqueezy.com/js/lemon.js" 
          strategy="afterInteractive" 
        />
      </body>
    </html>
  );
}
