import { Rubik } from "next/font/google";
import "./globals.css";
import type { Metadata } from "next";
import { AuthProvider } from "@/utils/contextapi";

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});


export const metadata: Metadata = {
  title: " نظام إدارة الأقساط ",
  description: " نظام إدارة الأقساط ",
};

export default async function LocaleLayout({
  children
}: {
  children: React.ReactNode;
}) {


  return (
    <html lang="ar" dir="rtl" className={`${rubik.variable}`}>
      <body className={`antialiased flex flex-col min-h-screen`}>
            <div className="grow">
              <AuthProvider>
                {children}
              </AuthProvider>
            </div>
      </body>
    </html>
  );
}
