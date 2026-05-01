import type { Metadata } from "next";
import { Sarabun } from "next/font/google";
import "./globals.css";
import { LangProvider } from "@/context/LangContext";

const sarabun = Sarabun({
  variable: "--font-sarabun",
  subsets: ["thai", "latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "STAKEWISE | Predict the Future",
  description: "Enterprise-grade Prediction Market Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sarabun.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <LangProvider>
          {children}
        </LangProvider>
      </body>
    </html>
  );
}
