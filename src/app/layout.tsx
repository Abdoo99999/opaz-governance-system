import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Cairo } from 'next/font/google';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['400', '700'],
  variable: '--font-cairo',
});


export const metadata: Metadata = {
  title: 'منظومة إتقان | جهاز الاستثمار العماني',
  description: 'منظومة إتقان لحوكمة شركات جهاز الاستثمار العماني',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${cairo.variable} font-body antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
