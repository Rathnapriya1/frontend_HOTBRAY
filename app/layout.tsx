// app/layout.tsx
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Providers } from "./providers";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import Breadcrumbs from "./components/Breadcrumbs";

export const metadata = {
  title: "DGSTECH",
  description: "A simple eCommerce demo with Next.js + Tailwind CSS",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true} className="bg-gray-50 text-gray-900">
        <Providers>
          <CartProvider>
            <WishlistProvider>
              <Navbar />
                <div className="px-6 md:px-10">
                <Breadcrumbs />
              </div>
              <main>{children}</main>
              <Footer />
            </WishlistProvider>
          </CartProvider>
        </Providers>
      </body>
    </html>
  );
}
