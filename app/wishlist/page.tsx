// app/wishlist/page.tsx
"use client";

import { useWishlist } from "@/app/context/WishlistContext";
import ProductCard from "@/app/products/ProductCard"; 
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/utils/api";
import { useUser } from "@clerk/nextjs";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  part_number: string;
}

export default function WishlistPage() {
  const { wishlist } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { isSignedIn } = useUser();   // <-- ADDED LOGIN CHECK

  // 🚫 Not logged in → show message
  if (!isSignedIn) {
    return (
      <div className="text-center mt-20 text-lg text-gray-700">
        Please log in to view your wishlist.
      </div>
    );
  }

  // Fetch all products & filter wishlist
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/products`, { cache: "no-store" });
        const data: Product[] = await res.json();
        const wishlistProducts = data.filter((p) => wishlist.includes(p.id));
        setProducts(wishlistProducts);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [wishlist]);

  if (loading) return <p className="text-center mt-10">Loading wishlist...</p>;
  if (products.length === 0) return <p className="text-center mt-10">Your wishlist is empty.</p>;

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-6 md:px-16">
      <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}
