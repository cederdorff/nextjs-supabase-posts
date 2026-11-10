import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/Header";
import MotionProvider from "@/components/MotionProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Post App",
  description: "A Next.js app with posts, users and Supabase Auth",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <MotionProvider>
          <Header />
          {children}
        </MotionProvider>
      </body>
    </html>
  );
}
