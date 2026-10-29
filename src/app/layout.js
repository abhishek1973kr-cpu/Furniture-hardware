import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
  title: "VibeFab Luxury | Admin Dashboard",
  description: "Curated Haute Living Furniture & Bespoke Inventory Control Center",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full bg-[#F9F8F6]">
      <body className="h-full bg-[#F9F8F6] text-[#1A1A1A] selection:bg-[#C5A880] selection:text-[#1A1A1A]">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
