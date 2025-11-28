// app/products/ProductCard.tsx
"use client";

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    price: number;
    image: string;
    description: string;
    category: string;
    part_number: string;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="border rounded-lg shadow-sm p-4 bg-white hover:shadow-md transition">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover rounded-md mb-4"
      />
      <h2 className="text-lg font-semibold">{product.name}</h2>
      <p className="text-gray-600 text-sm mb-2">{product.description}</p>
      <p className="text-blue-600 font-bold mb-1">${product.price}</p>
      <p className="text-gray-500 text-xs">Category: {product.category}</p>
      <p className="text-gray-400 text-xs">Part #: {product.part_number}</p>
    </div>
  );
}
