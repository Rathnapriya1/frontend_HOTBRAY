"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";
import LoginModal from "./LoginModal";
import { useUser, useClerk, UserButton } from "@clerk/nextjs";
import { PackageIcon } from "lucide-react";

export default function Navbar() {
  const { cartItems, toggleCart } = useCart();
  const [showLogin, setShowLogin] = useState(false);
  const { user } = useUser();
  const { openSignIn } = useClerk();
  const router = useRouter();

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <nav className="flex items-center justify-between px-8 py-4 bg-white shadow-md sticky top-0 z-50">
        {/* Logo */}
        <a href="./">
          <h1 className="text-2xl font-bold logo">DGSTECH</h1>
        </a>

        {/* Links */}
        <div className="space-x-6 hidden md:flex mr-20">
          <a href="./" className="text-gray-700 hover:text-blue-600">
            Home
          </a>
          <a href="./products" className="text-gray-700 hover:text-blue-600">
            Products
          </a>
          <a href="./contact" className="text-gray-700 hover:text-blue-600">
            Contact
          </a>
          <a href="./admin" className="text-gray-700 hover:text-blue-600">
            Admin
          </a>
        </div>

        {/* Right side buttons */}
        <div className="flex items-center space-x-6">
          {/* Cart */}
          <button onClick={toggleCart} className="relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m10-9l2 9m-6 0h4"
              />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-blue-600 text-xs text-white rounded-full px-1.5 cart-Count">
                {totalItems}
              </span>
            )}
          </button>

          {/* Login / User Button */}
          {!user ? (
            <button
              onClick={() => openSignIn()}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Login
            </button>
          ) : (
            <UserButton afterSignOutUrl="/">
              <UserButton.MenuItems>
                <UserButton.Action
                  labelIcon={<PackageIcon size={16} />}
                  label="My Orders"
                  onClick={() => router.push("/orders")}
                />
              </UserButton.MenuItems>
            </UserButton>
          )}
        </div>
      </nav>

      {/* Popup Modal (optional if you're still using it elsewhere) */}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  );
}
