import type { Metadata } from "next";
import { Noto_Sans_Arabic } from "next/font/google";
import { AppProviders } from "@/components/providers/AppProviders";
import "./globals.css";

const notoArabic = Noto_Sans_Arabic({
  variable: "--font-noto-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Prime HR | لوحة إدارة الموظفين",
  description:
    "نظام احترافي لعرض وإدارة بيانات الموظفين — الأقسام، الحالة، الرواتب، وسنوات الخدمة",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body
        className={`${notoArabic.variable} font-sans antialiased`}
      >
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
