"use client";

import GuestRoute from "app/component/GuestRoute";
import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <GuestRoute>{children}</GuestRoute>
      </body>
    </html>
  );
}
