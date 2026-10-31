import type { Metadata } from 'next';
import { Bricolage_Grotesque, DM_Mono } from 'next/font/google';
import './globals.css';

const display = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font-display', display: 'swap' });
const mono = DM_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-mono', display: 'swap' });

export const metadata: Metadata = {
  title: 'AUDIRA MOTION: satu ide, satu reel jadi',
  description:
    'Ketik satu ide, AUDIRA MOTION menulis naskah, mengisi suara, dan merender reel vertikal: character skit, whiteboard, RPG 16-bit, breaking news, explainer, dan dokumenter.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${display.variable} ${mono.variable}`}>
      <body className="min-h-screen bg-[#0e0e11] text-[#f4f3f0] antialiased">
        {children}
      </body>
    </html>
  );
}
