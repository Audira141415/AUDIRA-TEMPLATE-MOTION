import type { Metadata } from 'next';
import { Bricolage_Grotesque, DM_Mono, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { FloatingWhatsApp } from '@/components/site/FloatingWhatsApp';

const display = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font-display', display: 'swap' });
const sans = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const mono = DM_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-mono', display: 'swap' });

export const metadata: Metadata = {
  title: 'AUDIRA MOTION: Satu Ide Jadi Video Viral Siap Upload',
  description:
    'Edit video, motion graphic, sampai naskah viral. Cukup ketik satu ide di browser atau chat Claude, AUDIRA merender video vertikal 1080×1920 60fps dengan suara Indonesia.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${display.variable} ${sans.variable} ${mono.variable} scroll-smooth`}>
      <body className="min-h-screen bg-[#0f0d0b] text-[#f5efe6] font-sans antialiased">
        {children}
        <FloatingWhatsApp />
      </body>
    </html>
  );
}
