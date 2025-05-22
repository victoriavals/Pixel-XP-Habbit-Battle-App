import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import PwaHandler from '@/components/PwaHandler';

// geistSans and geistMono are objects, not functions to be called.
// Their 'variable' property can be accessed directly.

export const metadata: Metadata = {
  title: 'Pixel XP Habit Battle',
  description: 'Set daily quests and compete against an AI Rival in this retro pixel-art PWA.',
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <PwaHandler />
      <body className={`${GeistSans.variable} ${GeistMono.variable} antialiased font-sans`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
