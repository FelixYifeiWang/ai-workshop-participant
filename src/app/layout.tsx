import type { Metadata } from "next";
import { WorkshopProvider } from "@/context/WorkshopContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Workshop Participant",
  description: "An AI participant for the Pre-Texts workshop on AI and Human Emotions",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-amber-50 min-h-screen">
        <WorkshopProvider>{children}</WorkshopProvider>
      </body>
    </html>
  );
}
