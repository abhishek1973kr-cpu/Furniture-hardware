import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
  title: "FORGE Hardware | Admin Dashboard",
  description: "Minimalist Furniture Hardware Inventory & Logistics Control Panel",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full bg-white">
      <body className="h-full bg-white text-zinc-900 selection:bg-black selection:text-white">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
