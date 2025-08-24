import { Inter } from "next/font/google";
import "./globals.css";
import SessionWrapper from "@/components/layout-components/session-wrapper";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "Attendance App",
  description: "Welcome to Attendance App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <SessionWrapper>
          {children}
        </SessionWrapper>
      </body>
    </html>
  );
}
