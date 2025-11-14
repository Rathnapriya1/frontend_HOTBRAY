// app/layout.tsx
import "./globals.css";
import Navbar from "./components/Navbar";
import { CartProvider } from "./context/CartContext";
import CartSidebar from "./components/CartSidebar";
import Footer from "./components/Footer";
import {ClerkProvider} from "@clerk/nextjs";

export const metadata = {
  title: "DGSTECH",
  description: "A simple eCommerce demo with Next.js + Tailwind CSS",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
    <html lang="en" suppressHydrationWarning>
      <body className="bg-gray-50 text-gray-900" suppressHydrationWarning>
        <CartProvider>
          <Navbar />
          <CartSidebar />
          <main>{children}</main>
        </CartProvider>
        <Footer />
      </body>
    </html>
    </ClerkProvider>
  );
}