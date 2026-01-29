import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Cairo } from 'next/font/google';
import { LanguageProvider } from '@/context/LanguageContext';
import { ZoneProvider } from '@/context/CompanyContext';
import { YearProvider } from '@/context/YearContext';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['400', '700'],
  variable: '--font-cairo',
});


export const metadata: Metadata = {
  title: 'منظومة مدار | المناطق الاقتصادية والحرة',
  description: 'منظومة مدار لحوكمة المناطق الاقتصادية الخاصة والمناطق الحرة',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${cairo.variable} font-body antialiased`}>
        <LanguageProvider>
          <YearProvider>
            <ZoneProvider>
              {children}
              <Toaster />
            </ZoneProvider>
          </YearProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
