"use client";

import Marquee from "react-fast-marquee";

const productCategories = [
  "BRAKE PAD",
  "BATTERY",
  "BULB",
  "WIPER BLADES",
  "ENGINE OIL",
];

export default function CategoriesMarquee() {
  return (
    <div className="w-full bg-white">
      <Marquee
        gradient={false}
        speed={40}
        pauseOnHover={true}
        className="flex items-center"
      >
        {productCategories.map((item, index) => (
          <span
            key={index}
            className="mx-7 text-base font-semibold text-black uppercase"
            style={{
              padding: "0 10px", // More even spacing
              color: "#222",      // True black color
              background: 'linear-gradient(90deg, #8ac0f3ff 0%, #eff5f7ff 100%)', // No background color
              border: "none",     // No border
              boxShadow: "none",  // No shadow
              borderRadius: "0",  // No rounded corners
              letterSpacing: "0.03em", // Slight tracking
            }}
          >
            {item}
          </span>
        ))}
      </Marquee>
    </div>
  );
}
