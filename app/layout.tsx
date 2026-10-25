import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth/AuthContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Faculty Leave Management System | YOUR UNIVERSITY NAME",
  description: "Official University Portal for Faculty Leave Application, HOD Approval, and Administration",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-slate-100 text-slate-900 font-sans">
      <body className="min-h-full flex flex-col antialiased">
        <AuthProvider>
          <Header />
          <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
