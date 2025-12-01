import { Star } from "lucide-react";
import React from "react";

interface RatingProps {
  value?: number;
  productId?: number; // added to accept productId without affecting current behavior
}

const Rating: React.FC<RatingProps> = ({ value = 4, productId }) => {
  // You can optionally use productId later for fetching product-specific rating
  return (
    <div className="flex items-center">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`shrink-0 size-4 fill-current ${
            value > i ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
};

export default Rating;
