import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import NotificationWebSocket from '@/components/notification/NotificationWebSocket';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Merchant Management System',
  description: 'Advanced merchant management dashboard',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
        <NotificationWebSocket />
      </body>
    </html>
  );
}