"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { API_BASE_URL } from "@/utils/api";
import Rating from "@/app/components/Rating";
import { useEffect, useState } from "react";
import { useCart } from "@/app/context/CartContext";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  part_number: string;
}

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id;

  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/products/${productId}`);
        if (!res.ok) throw new Error("Product not found");
        const data: Product = await res.json();
        setProduct(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({ ...product, quantity: 1 });
    alert("Product added to cart!");
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCart({ ...product, quantity: 1 });
    const confirmCheckout = confirm("Proceed to checkout?");
    if (confirmCheckout) {
      router.push("/cart"); // redirect to your cart/checkout page
    }
  };

  if (loading) return <p className="text-center mt-10">Loading product...</p>;
  if (!product) return <p className="text-center mt-10">Product not found.</p>;

  return (
    <main className="min-h-screen bg-gray-50 text-black py-10 px-6 md:px-16">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/2">
            <Image
              src={product.image || "/placeholder.png"}
              alt={product.name}
              width={400}
              height={400}
              className="object-cover rounded-lg"
            />
          </div>

          <div className="md:w-1/2 flex flex-col">
            <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
            <p className="text-gray-600 mb-2">Part No: {product.part_number}</p>
            <p className="text-gray-500 mb-2">{product.category}</p>
            <p className="text-blue-600 font-bold mb-4">₹{product.price}</p>
            <p className="text-gray-700 mb-4">{product.description}</p>

            <Rating productId={product.id} />

            {/* Buttons */}
            <div className="mt-4 flex gap-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition"
              >
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
