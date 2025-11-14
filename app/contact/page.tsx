"use client";
 
import Image from "next/image";
import { useState } from "react";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaWhatsapp,
} from "react-icons/fa";
 
export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");
 
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });
 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Sending...");
    try {
      const res = await fetch("http://localhost:4000/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
 
      const data = await res.json();
 
      if (res.ok) {
        setStatus("Message sent successfully!");
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus("Something went wrong");
      }
    } catch {
      setStatus("Network error");
    }
  };
 
  return (
    <main className="min-h-screen bg-gray-50 pb-16">
      {/* Banner Section */}
      <section className="relative w-full h-[350px] md:h-[450px]">
        <Image
          src="https://www.shutterstock.com/image-illustration/various-car-parts-accessories-isolated-600nw-673268602.jpg"
          alt="Contact us vehicle banner"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60 flex flex-col items-center justify-center text-white text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Contact Us</h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl">
            We’re here to help! Reach out to us — our team will get back to you
            as soon as possible.
          </p>
        </div>
      </section>
 
      {/* Contact Info Section */}
      <section className="py-16 px-6 md:px-16">
        <h2 className="text-3xl font-semibold text-center mb-10 text-gray-800">
          Get in Touch
        </h2>
 
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 text-center">
          {/* Phone */}
          <a
            href="tel:+919876543210"
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition block"
          >
            <FaPhoneAlt className="text-blue-600 text-3xl mx-auto mb-3" />
            <h3 className="text-xl font-semibold">Call Us</h3>
            <p className="text-gray-700 mt-2">+91 98765 43210</p>
          </a>
 
          {/* Email */}
          <a
            href="mailto:rathnapriya@dgstechlimited.com"
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition block"
          >
            <FaEnvelope className="text-blue-600 text-3xl mx-auto mb-3" />
            <h3 className="text-xl font-semibold">Email</h3>
            <p className="text-gray-700 mt-2">rathnapriya@dgstechlimited.com</p>
          </a>
 
          {/* Location */}
          <a
            href="https://maps.google.com/?q=Chennai+Tamil+Nadu"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition block"
          >
            <FaMapMarkerAlt className="text-blue-600 text-3xl mx-auto mb-3" />
            <h3 className="text-xl font-semibold">Location</h3>
            <p className="text-gray-700 mt-2">Chennai, Tamil Nadu, India</p>
          </a>
        </div>
 
        {/* WhatsApp */}
        <div className="text-center mb-12">
          <a
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-green-500 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-green-600 transition"
          >
            <FaWhatsapp className="text-2xl" /> Chat on WhatsApp
          </a>
        </div>
 
        {/* Contact Form */}
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Send Us a Message
          </h3>
          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800"
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800"
            />
            <textarea
              name="message"
              placeholder="Your Message"
              value={form.message}
              onChange={handleChange}
              required
              rows={5}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800"
            ></textarea>
 
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Send Message
            </button>
          </form>
 
          {status && (
            <p className="text-center text-green-600 mt-5 font-medium">
              {status}
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
