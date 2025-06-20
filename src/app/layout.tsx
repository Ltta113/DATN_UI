import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import QueryProvider from "./component/QueryProvider";
import { ToastContainer } from "react-toastify";
import Header from "./component/Layout/Main/Header";
import { AuthProvider } from "./context/AuthContext";
import Footer from "./component/Layout/Main/Footer";
import { OrderProvider } from "./context/OrderContent";
import { Suspense } from "react";
config.autoAddCss = false;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SachVN",
  description: "Sách hay cho bạn",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen`}
      >
        <Suspense>
          <QueryProvider>
            <AuthProvider>
              <OrderProvider>
                <Header />
                {children}
                <ToastContainer
                  position="top-right"
                  autoClose={3000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  theme="light"
                />
                <Footer />
              </OrderProvider>
            </AuthProvider>
          </QueryProvider>
        </Suspense>
      </body>
    </html>
  );
}
