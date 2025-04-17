import Sidebar from "app/component/Layout/Profile/SideBar";
import ProtectedRoute from "app/component/ProtectedRoute";
import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ProtectedRoute>
          <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <main className="flex-1 mt-2 rounded-md">{children}</main>
          </div>
        </ProtectedRoute>
      </body>
    </html>
  );
}
