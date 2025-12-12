import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ThemeProvider from '@/components/providers/ThemeProvider';
import { AuthProvider } from '@/contexts/AuthContext';
import { CompanyProvider } from '@/contexts/CompanyContext';
import { CategoriesProvider } from '@/contexts/CategoriesContext';
import { SchedulesProvider } from '@/contexts/SchedulesContext';

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Booking Hub - Portal",
  description: "Manage your bookings, schedules, and customers efficiently",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider>
          <AuthProvider>
            <CompanyProvider>
              <CategoriesProvider>
                <SchedulesProvider>
                  {children}
                </SchedulesProvider>
              </CategoriesProvider>
            </CompanyProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
