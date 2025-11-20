"use client";
 
import React, { useState } from "react";
import Papa, { ParseResult } from "papaparse";
import { useCart } from "../context/CartContext";
import Image from "next/image";
import { API_BASE_URL } from "./../../utils/api";
 
/* ---------------------------------------------
   Type Definitions
--------------------------------------------- */
type ProductResp = {
  id: number;
  part_number: string;
  name: string;
  price: number | null;
  image?: string | null;
  is_obsolete?: boolean;
  alternative_part_number?: string | null;
};
 
type ValidatedItem = {
  part_number: string;
  qty: number;
  product: ProductResp | null;
  mapped_to?: string | null;
  message?: string | null;
};
 
/* ---------------------------------------------
   Component
--------------------------------------------- */
 
export default function QuickPartModal({ onClose }: { onClose: () => void }) {
  const { addToCart } = useCart();
 
  const API_BASE = API_BASE_URL;
 
  const normalize = (s: string) => s.toString().trim().toUpperCase();
 
  const resetAll = () => {
    resetSingle();
    resetBulk();
    resetPaste();
  };
 
  /* -----------------------------
     Tabs
  ----------------------------- */
  const [tab, setTab] = useState<"single" | "bulk" | "paste">("single");
 
  /* -----------------------------
     SINGLE LOOKUP
  ----------------------------- */
  const [singlePart, setSinglePart] = useState("");
  const [singleQty, setSingleQty] = useState(1);
  const [singleResult, setSingleResult] = useState<ValidatedItem | null>(null);
  const [loadingSingle, setLoadingSingle] = useState(false);
 
  const handleSingleLookup = async () => {
    if (!singlePart) return;
 
    setLoadingSingle(true);
    setSingleResult(null);
 
    try {
      const res = await fetch(
        `${API_BASE}/fast-order/single?part=${encodeURIComponent(singlePart)}`
      );
 
      const json = await res.json();
 
      if (!res.ok) {
        setSingleResult({
          part_number: normalize(singlePart),
          qty: singleQty,
          product: null,
          message: json.error || "Not found",
        });
      } else {
        setSingleResult(json.item as ValidatedItem);
      }
    } catch {
      setSingleResult({
        part_number: normalize(singlePart),
        qty: singleQty,
        product: null,
        message: "Lookup failed",
      });
    }
 
    setLoadingSingle(false);
  };
 
  const addSingleToCart = () => {
    if (!singleResult || !singleResult.product) return;
 
    const p = singleResult.product;
 
    addToCart({
      id: p.id,
      name: p.name || p.part_number,
      price: p.price || 0,
      image: p.image || "/placeholder.png",
      quantity: singleQty,
    });
 
    alert("Added to cart");
 
    setSinglePart("");
    setSingleQty(1);
    setSingleResult(null);
  };
 
  /* -----------------------------
     BULK UPLOAD
  ----------------------------- */
  const [file, setFile] = useState<File | null>(null);
  const [bulkPreview, setBulkPreview] = useState<string[]>([]);
  const [bulkItems, setBulkItems] = useState<
    Array<{ part_number: string; qty: number }>
  >([]);
  const [bulkValidated, setBulkValidated] = useState<ValidatedItem[]>([]);
  const [processingBulk, setProcessingBulk] = useState(false);
 
  const handleFileSelect = (selectedFile: File | null) => {
    setFile(selectedFile);
    setBulkPreview([]);
    setBulkItems([]);
    setBulkValidated([]);
 
    if (!selectedFile) return;
 
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = (e.target?.result as string) || "";
      const lines = text.split(/\r?\n/).slice(0, 5);
      setBulkPreview(lines);
    };
    reader.readAsText(selectedFile);
  };
 
  const handleBulkParse = () => {
    if (!file) return;
 
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (
        results: ParseResult<Record<string, string | number | null>>
      ) => {
        const items: Array<{ part_number: string; qty: number }> = [];
 
        for (const row of results.data.slice(0, 100)) {
          // ---- FIXED: string-safe PN extraction ----
          const rawPN =
            row.part_number ??
            row.part ??
            row.PartNumber ??
            row.partNumber ??
            "";
 
          const pn = normalize(String(rawPN));
          if (!pn) continue;
 
          const qtyRaw =
            row.qty ?? row.quantity ?? row.Qty ?? row.QTY ?? row.Quantity ?? 1;
 
          const qty = parseInt(String(qtyRaw), 10) || 1;
 
          items.push({ part_number: pn, qty });
        }
 
        setBulkItems(items);
      },
    });
  };
 
  const validateBulkServer = async () => {
    if (bulkItems.length === 0) return;
 
    setProcessingBulk(true);
 
    try {
      const res = await fetch(`${API_BASE}/fast-order/bulk-validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: bulkItems }),
      });
 
      const json = await res.json();
 
      if (!res.ok) {
        alert(json.error || "Validation failed");
      } else {
        setBulkValidated(json.processed as ValidatedItem[]);
      }
    } catch {
      alert("Server error");
    }
 
    setProcessingBulk(false);
  };
 
  const addBulkToCart = () => {
    bulkValidated.forEach((b) => {
      if (b.product) {
        addToCart({
          id: b.product.id,
          name: b.product.name || b.product.part_number,
          price: b.product.price || 0,
          image: b.product.image || "/placeholder.png",
          quantity: b.qty,
        });
      }
    });
 
    alert("Added valid items to cart");
 
    setFile(null);
    setBulkItems([]);
    setBulkValidated([]);
    setBulkPreview([]);
  };
 
  /* -----------------------------
     PASTE MODE
  ----------------------------- */
  const [pasteText, setPasteText] = useState("");
  const [pasteItems, setPasteItems] = useState<
    Array<{ part_number: string; qty: number }>
  >([]);
  const [pasteValidated, setPasteValidated] = useState<ValidatedItem[]>([]);
  const [processingPaste, setProcessingPaste] = useState(false);
 
  const handlePasteParse = () => {
    const parsedItems: Array<{ part_number: string; qty: number }> = [];
 
    const lines = pasteText
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean)
      .slice(0, 100);
 
    for (const line of lines) {
      const parts = line.split(/[,\t\s]+/);
      const pn = normalize(String(parts[0]));
      const qty = parts[1] ? parseInt(parts[1], 10) || 1 : 1;
 
      parsedItems.push({ part_number: pn, qty });
    }
 
    setPasteItems(parsedItems);
  };
 
  const validatePasteServer = async () => {
    if (pasteItems.length === 0) return;
 
    setProcessingPaste(true);
 
    try {
      const res = await fetch(`${API_BASE}/fast-order/bulk-validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: pasteItems }),
      });
 
      const json = await res.json();
 
      if (!res.ok) {
        alert(json.error || "Validation failed");
      } else {
        setPasteValidated(json.processed as ValidatedItem[]);
      }
    } catch {
      alert("Server error");
    }
 
    setProcessingPaste(false);
  };
 
  const addPasteToCart = () => {
    pasteValidated.forEach((b) => {
      if (b.product) {
        addToCart({
          id: b.product.id,
          name: b.product.name || b.product.part_number,
          price: b.product.price || 0,
          image: b.product.image || "/placeholder.png",
          quantity: b.qty,
        });
      }
    });
 
    alert("Added valid items");
 
    setPasteText("");
    setPasteItems([]);
    setPasteValidated([]);
  };
 
  // RESET — Single
  const resetSingle = () => {
    setSinglePart("");
    setSingleQty(1);
    setSingleResult(null);
  };
 
  // RESET — Bulk
  const resetBulk = () => {
    setFile(null);
    setBulkPreview([]);
    setBulkItems([]);
    setBulkValidated([]);
  };
 
  // RESET — Paste
  const resetPaste = () => {
    setPasteText("");
    setPasteItems([]);
    setPasteValidated([]);
  };
 
  /* ---------------------------------------------
     UI
--------------------------------------------- */
 
  return (
    <div className="fixed inset-0 z-[2000] text-black p-4 flex justify-center items-start">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-lg p-6">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold fast_order">Fast Order</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setTab("single")}
              className={`px-3 py-1 rounded ${
                tab === "single" ? "bg-blue-600 text-white" : "bg-gray-100 cursor-pointer"
              }`}
            >
              Quick Add
            </button>
 
            <button
              onClick={() => setTab("bulk")}
              className={`px-3 py-1 rounded ${
                tab === "bulk" ? "bg-blue-600 text-white" : "bg-gray-100 cursor-pointer"
              }`}
            >
              Bulk Upload
            </button>
 
            <button
              onClick={() => setTab("paste")}
              className={`px-3 py-1 rounded ${
                tab === "paste" ? "bg-blue-600 text-white" : "bg-gray-100 cursor-pointer"
              }`}
            >
              Paste Part Numbers
            </button>
 
            <button
              onClick={resetAll}
              className="px-3 py-1 rounded bg-yellow-100 text-yellow-700 cursor-pointer"
            >
              Reset All
            </button>
 
            <button
              onClick={onClose}
              className="px-3 py-1 text-red-600 rounded cursor-pointer hover:bg-red-100"
            >
              X
            </button>
          </div>
        </div>
 
        {/* ---------------------------------------------
            TAB CONTENT
        --------------------------------------------- */}
        <div className="mt-5">
          {/* ---------------------------------------------
                SINGLE TAB
          --------------------------------------------- */}
          {tab === "single" && (
            <div>
              <div className="flex gap-3">
                <input
                  value={singlePart}
                  onChange={(e) => setSinglePart(e.target.value)}
                  placeholder="Enter Part Number"
                  className="border p-2 rounded w-full"
                />
 
                <input
                  type="number"
                  min={1}
                  value={singleQty}
                  onChange={(e) =>
                    setSingleQty(parseInt(e.target.value, 10) || 1)
                  }
                  className="border p-2 rounded w-24"
                />
 
                <button
                  onClick={handleSingleLookup}
                  disabled={!singlePart}
                  className="bg-blue-600 text-white px-4 rounded cursor-pointer"
                >
                  {loadingSingle ? "Checking..." : "Lookup"}
                </button>
              </div>
 
              {singleResult && (
                <div className="mt-4 border rounded p-3">
                  {singleResult.product ? (
                    <div className="flex gap-4 items-center">
                      <Image
                        src={singleResult.product.image || "/placeholder.png"}
                        alt="Product"
                        width={70}
                        height={70}
                        className="rounded"
                      />
 
                      <div className="flex-1">
                        <div className="font-semibold">
                          {singleResult.product.name ||
                            singleResult.product.part_number}
                        </div>
                        <div className="text-gray-600">
                          Part: {singleResult.product.part_number}
                        </div>
                        <div className="text-gray-900 font-semibold">
                          ₹ {singleResult.product.price || 0}
                        </div>
                        {singleResult.product.is_obsolete &&
                          singleResult.product.alternative_part_number && (
                            <div className="text-yellow-700 text-sm">
                              Obsolete — use{" "}
                              {singleResult.product.alternative_part_number}
                            </div>
                          )}
                      </div>
 
                      <button
                        onClick={addSingleToCart}
                        className="bg-green-600 text-white px-4 py-1 rounded cursor-pointer"
                      >
                        Add
                      </button>
                      <button
                        onClick={resetSingle}
                        className="ml-2 px-3 py-1 bg-gray-200 rounded cursor-pointer"
                      >
                        Reset
                      </button>
                    </div>
                  ) : (
                    <div className="text-red-600">
                      Not Found: {singleResult.part_number}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
 
          {/* ---------------------------------------------
                BULK TAB
          --------------------------------------------- */}
          {tab === "bulk" && (
            <div>
              {/* CSV Upload */}
              <div className="flex items-center gap-3 bulk-upload-section">
                <input
                  type="file"
                  accept=".csv"
                  className="border-amber-200"
                  onChange={(e) =>
                    handleFileSelect(e.target.files?.[0] || null)
                  }
                />
                <button
                  onClick={handleBulkParse}
                  disabled={!file}
                  className="bg-blue-600 text-white px-4 py-1 rounded cursor-pointer"
                >
                  Parse
                </button>
                <button
                  onClick={resetBulk}
                  className="bg-gray-200 px-3 py-1 rounded cursor-pointer"
                >
                  Reset
                </button>
              </div>
 
              {/* Preview */}
              {bulkPreview.length > 0 && (
                <div className="bg-gray-50 p-3 rounded mt-3 text-sm">
                  Preview:
                  <pre className="text-xs">{bulkPreview.join("\n")}</pre>
                </div>
              )}
 
              {/* Validate Button */}
              {bulkItems.length > 0 && (
                <button
                  onClick={validateBulkServer}
                  className="mt-3 bg-indigo-600 text-white px-4 py-1 rounded cursor-pointer"
                >
                  {processingBulk ? "Validating..." : "Validate & Show"}
                </button>
              )}
 
              {/* Validation Results */}
              {bulkValidated.length > 0 && (
                <div className="mt-4 max-h-72 overflow-y-auto border rounded p-2 space-y-2">
                  {bulkValidated.map((b, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between border-b pb-2"
                    >
                      <div>
                        <div className="font-medium">
                          {b.product
                            ? b.product.name || b.product.part_number
                            : b.part_number}
                        </div>
 
                        {b.product ? (
                          <div className="text-gray-700 text-sm">
                            ₹ {b.product.price || 0} × {b.qty}
                          </div>
                        ) : (
                          <div className="text-red-600 text-sm">
                            {b.message || "Not Found"}
                          </div>
                        )}
                      </div>
 
                      {b.product && (
                        <button
                          onClick={() =>
                            addToCart({
                              id: b.product!.id,
                              name: b.product!.name || b.product!.part_number,
                              price: b.product!.price || 0,
                              image: b.product!.image || "/placeholder.png",
                              quantity: b.qty,
                            })
                          }
                          className="bg-green-600 text-white px-3 py-1 rounded cursor-pointer"
                        >
                          Add
                        </button>
                      )}
                    </div>
                  ))}
 
                  <button
                    onClick={addBulkToCart}
                    className="mt-2 bg-green-600 text-white px-4 py-2 rounded cursor-pointer"
                  >
                    Add All Valid To Cart
                  </button>
                </div>
              )}
            </div>
          )}
 
          {/* ---------------------------------------------
                PASTE TAB
          --------------------------------------------- */}
          {tab === "paste" && (
            <div>
              <textarea
                rows={7}
                value={pasteText}
                onChange={(e) => setPasteText(e.target.value)}
                placeholder={"PART_NUMBER, QTY\nPART_NUMBER, QTY"}
                className="border p-2 rounded w-full"
              />
 
              <div className="flex gap-3 mt-3">
                <button
                  onClick={handlePasteParse}
                  className="bg-blue-600 text-white px-3 py-1 rounded cursor-pointer"
                >
                  Parse
                </button>
                <button
                  onClick={validatePasteServer}
                  disabled={pasteItems.length === 0}
                  className="bg-indigo-600 text-white px-3 py-1 rounded cursor-pointer"
                >
                  {processingPaste ? "Validating..." : "Validate"}
                </button>
                <button
                  onClick={resetPaste}
                  className="ml-2 bg-gray-200 px-3 py-1 rounded cursor-pointer"
                >
                  Reset
                </button>
              </div>
 
              {pasteValidated.length > 0 && (
                <div className="mt-4 max-h-72 overflow-y-auto border rounded p-2 space-y-2">
                  {pasteValidated.map((b, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between border-b pb-2"
                    >
                      <div>
                        <div className="font-medium">
                          {b.product
                            ? b.product.name || b.product.part_number
                            : b.part_number}
                        </div>
 
                        {b.product ? (
                          <div className="text-gray-700 text-sm">
                            ₹ {b.product.price || 0} × {b.qty}
                          </div>
                        ) : (
                          <div className="text-red-600 text-sm">
                            {b.message || "Not Found"}
                          </div>
                        )}
                      </div>
 
                      {b.product && (
                        <button
                          onClick={() =>
                            addToCart({
                              id: b.product!.id,
                              name: b.product!.name || b.product!.part_number,
                              price: b.product!.price || 0,
                              image: b.product!.image || "/placeholder.png",
                              quantity: b.qty,
                            })
                          }
                          className="bg-green-600 text-white px-3 py-1 rounded cursor-pointer"
                        >
                          Add
                        </button>
                      )}
                    </div>
                  ))}
 
                  <button
                    onClick={addPasteToCart}
                    className="mt-3 bg-green-600 text-white px-4 py-2 rounded cursor-pointer"
                  >
                    Add All Valid To Cart
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}