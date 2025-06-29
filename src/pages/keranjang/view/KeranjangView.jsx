import React, { useState, useEffect, useMemo } from "react";
import apiClient from "../api/apiClient";
import { useNavigate, Link } from "react-router-dom";
import {
  ShoppingCartIcon,
  TrashIcon,
  MinusIcon,
  PlusIcon,
  InformationCircleIcon,
  CreditCardIcon,
  ArrowPathIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";

import {
  CheckCircleIcon as SolidCheckCircle,
  XCircleIcon as SolidXCircle,
} from "@heroicons/react/24/solid";
import { cn } from "../lib/utils";

const formatRupiah = (angka) => {
  const number = typeof angka === "string" ? parseInt(angka, 10) : angka;
  if (isNaN(number) || number === null || number === undefined) return "Rp -";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
};

// --- Komponen AtkCard --- (Diubah dari PupukCard, untuk produk terkait jika digunakan)
function AtkCard({ atk }) {
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const viewDetail = (slug) => navigate(`/atk/${slug}`); // <--- Diubah: /pupuk -> /atk
  const statusBadgeColor =
    atk.status_ketersediaan?.toLowerCase() === "tersedia"
      ? "bg-emerald-100 text-emerald-800" // <--- Warna diubah
      : "bg-rose-100 text-rose-800"; // <--- Warna diubah
  const namaAtkDisplay = atk?.nama_atk || atk?.nama || "ATK"; // <--- Diubah: namaPupukDisplay
  const statusKetersediaan = atk?.status_ketersediaan;
  const gambarUtama = atk?.gambar_utama;
  const hargaAtk = atk?.harga; // <--- Diubah: hargaPupuk
  const kategoriNama = atk?.kategori?.nama_kategori || atk?.kategori?.nama; // <--- Diubah: kategoriNama

  const handleAddToCartRelated = async (e) => {
    e.stopPropagation();
    if (isAdding) return;
    setIsAdding(true);
    setFeedback({ type: "", message: "" });
    try {
      await apiClient.post("/keranjang", { atk_id: atk.id, quantity: 1 }); // <--- Diubah: pupuk_id -> atk_id
      setFeedback({ type: "success", message: `Ditambahkan!` });
      setTimeout(() => setFeedback({ type: "", message: "" }), 2000);
    } catch (err) {
      console.error("Gagal menambah ke keranjang:", err);
      let errorMessage = "Gagal";
      if (
        err.response &&
        (err.response.status === 401 || err.response.status === 403)
      ) {
        errorMessage = "Login dulu";
      } else if (err.response && err.response.data?.message) {
        errorMessage = err.response.data.message;
      }
      setFeedback({ type: "error", message: errorMessage });
      setTimeout(() => setFeedback({ type: "", message: "" }), 2500);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="atk-card group bg-white rounded-lg border border-slate-200/80 overflow-hidden transition-shadow duration-300 hover:shadow-md flex flex-col h-full relative">
      {" "}
      {/* <--- Diubah: pupuk-card -> atk-card */}
      {feedback.message && (
        <div
          className={`absolute inset-x-0 top-0 z-20 p-1 text-center text-xs font-medium transition-all duration-300 ${
            feedback.type === "success"
              ? "bg-emerald-500 text-white" // <--- Warna diubah
              : "bg-rose-500 text-white" // <--- Warna diubah
          }`}
        >
          {feedback.message}
        </div>
      )}
      <div
        className="relative overflow-hidden cursor-pointer"
        onClick={viewDetail}
      >
        <img
          src={
            gambarUtama
              ? gambarUtama // Asumsi gambar_utama dari API sudah berupa URL lengkap
              : "https://placehold.co/400x300/e2e8f0/94a3b8?text=Gambar+ATK" // <--- Teks placeholder diubah
          }
          alt={namaAtkDisplay}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/400x300?text=Error";
          }}
        />
        <div className="absolute top-2 left-2 z-10 flex flex-col space-y-1">
          {kategoriNama && (
            <span className="bg-emerald-600/80 text-white text-xs font-medium px-2 py-0.5 rounded">
              {" "}
              {/* <--- Warna diubah */}
              {kategoriNama}
            </span>
          )}
          {statusKetersediaan && (
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded ${statusBadgeColor}`}
            >
              {statusKetersediaan}
            </span>
          )}
        </div>
        <button
          onClick={handleAddToCartRelated}
          disabled={
            statusKetersediaan?.toLowerCase() !== "tersedia" || isAdding
          }
          className="absolute bottom-2 right-2 z-10 p-2 bg-emerald-600 text-white rounded-full shadow-md hover:bg-emerald-700 transition-all duration-300 opacity-0 group-hover:opacity-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-400" // <--- Warna diubah
          title="Tambah ke Keranjang"
        >
          {isAdding ? (
            <ArrowPathIcon className="w-5 h-5 animate-spin" />
          ) : (
            <ShoppingCartIcon className="w-5 h-5" />
          )}
        </button>
      </div>
      <div
        className="p-4 flex flex-col flex-grow cursor-pointer"
        onClick={viewDetail}
      >
        <h3 className="text-base font-semibold text-slate-800 mb-1 line-clamp-2">
          {" "}
          {/* <--- Warna teks disesuaikan */}
          {namaAtkDisplay}
        </h3>
        <p className="text-lg font-bold text-emerald-700 mt-auto pt-2">
          {" "}
          {/* <--- Warna diubah */}
          {formatRupiah(hargaAtk)}
        </p>
      </div>
    </div>
  );
}

// --- Komponen Pagination --- (Tidak ada perubahan signifikan terkait Pupuk/Ikan)
function Pagination({ meta, onPageChange }) {
  if (!meta || meta.last_page <= 1) return null;
  const getPageNumber = (url) => {
    if (!url) return null;
    try {
      const p = new URL(url);
      return p.searchParams.get("page");
    } catch (_e) {
      console.error("Invalid URL for pagination:", url, _e);
      return null;
    }
  };
  return (
    <nav className="flex items-center justify-between border-t border-slate-200 px-4 sm:px-0 mt-10 py-5">
      <div className="hidden sm:block">
        <p className="text-sm text-slate-700">
          {" "}
          {/* <--- Warna teks disesuaikan */}
          Menampilkan <span className="font-medium">
            {meta.from || 0}
          </span> - <span className="font-medium">{meta.to || 0}</span> dari{" "}
          <span className="font-medium">{meta.total || 0}</span> hasil
        </p>
      </div>
      <div className="flex flex-1 justify-between sm:justify-end space-x-1">
        {meta.links?.map((link, index) => {
          const pageNumber = getPageNumber(link.url);
          const isDisabled = !link.url;
          const isCurrent = link.active;
          if (link.label.includes("Previous")) {
            return (
              <button
                key={`prev-${index}`}
                onClick={() =>
                  !isDisabled && pageNumber && onPageChange(pageNumber)
                }
                disabled={isDisabled}
                className={cn(
                  "relative inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold ring-1 ring-inset ring-slate-300 focus:z-20 focus:outline-offset-0", // <--- Warna ring disesuaikan
                  isDisabled
                    ? "text-slate-300 cursor-not-allowed"
                    : "text-slate-900 hover:bg-slate-50 focus:bg-slate-100" // <--- Warna teks dan hover disesuaikan
                )}
              >
                Sebelumnya
              </button>
            );
          } else if (link.label.includes("Next")) {
            return (
              <button
                key={`next-${index}`}
                onClick={() =>
                  !isDisabled && pageNumber && onPageChange(pageNumber)
                }
                disabled={isDisabled}
                className={cn(
                  "relative inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold ring-1 ring-inset ring-slate-300 focus:z-20 focus:outline-offset-0", // <--- Warna ring disesuaikan
                  isDisabled
                    ? "text-slate-300 cursor-not-allowed"
                    : "text-slate-900 hover:bg-slate-50 focus:bg-slate-100" // <--- Warna teks dan hover disesuaikan
                )}
              >
                Berikutnya
              </button>
            );
          } else if (pageNumber) {
            const currentPage = meta.current_page;
            const lastPage = meta.last_page;
            const pageNum = parseInt(pageNumber, 10);
            if (
              pageNum === 1 ||
              pageNum === lastPage ||
              Math.abs(pageNum - currentPage) <= 1
            ) {
              return (
                <button
                  key={`page-${link.label}-${index}`}
                  onClick={() => !isCurrent && onPageChange(pageNumber)}
                  disabled={isCurrent}
                  aria-current={isCurrent ? "page" : undefined}
                  className={cn(
                    "relative hidden items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-slate-300 focus:z-20 focus:outline-offset-0 md:inline-flex", // <--- Warna ring disesuaikan
                    isCurrent
                      ? "z-10 bg-emerald-600 text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 cursor-default" // <--- Warna diubah
                      : "text-slate-900 hover:bg-slate-50 focus:bg-slate-100" // <--- Warna teks dan hover disesuaikan
                  )}
                >
                  {link.label.replace(/&laquo;|&raquo;/g, "").trim()}
                </button>
              );
            } else if (Math.abs(pageNum - currentPage) === 2) {
              return (
                <span
                  key={`ellipsis-${pageNum}-${index}`}
                  className="relative hidden items-center px-4 py-2 text-sm font-semibold text-slate-700 ring-1 ring-inset ring-slate-300 focus:outline-offset-0 md:inline-flex" // <--- Warna teks dan ring disesuaikan
                >
                  ...
                </span>
              );
            }
            return null;
          }
          return null;
        })}
      </div>
    </nav>
  );
}

const CartItemSkeleton = () => (
  <div className="flex items-center justify-between py-4 border-b border-slate-200 animate-pulse">
    {" "}
    {/* <--- Warna border disesuaikan */}
    <div className="flex items-center space-x-4">
      <div className="w-16 h-16 bg-slate-300 rounded"></div>{" "}
      {/* <--- Warna skeleton disesuaikan */}
      <div>
        <div className="h-5 w-32 bg-slate-300 rounded mb-1"></div>
        <div className="h-4 w-20 bg-slate-300 rounded"></div>
      </div>
    </div>
    <div className="flex items-center space-x-4">
      <div className="h-8 w-20 bg-slate-300 rounded"></div>
      <div className="h-5 w-24 bg-slate-300 rounded hidden sm:block"></div>
      <div className="h-8 w-8 bg-slate-300 rounded-full"></div>
    </div>
  </div>
);

function KeranjangPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingItemId, setUpdatingItemId] = useState(null);
  const [removingItemId, setRemovingItemId] = useState(null);
  const navigate = useNavigate();

  const fetchCartItems = async (showMainLoading = true) => {
    if (showMainLoading) {
      setLoading(true);
    }
    setError(null);
    try {
      const response = await apiClient.get("/keranjang");
      if (response.data && Array.isArray(response.data)) {
        setCartItems(response.data);
      } else if (response.data && Array.isArray(response.data.data)) {
        setCartItems(response.data.data);
      } else {
        setCartItems([]);
        if (response.data) {
          console.error("Format data keranjang tidak sesuai:", response.data);
        }
      }
    } catch (err) {
      console.error("Gagal memuat keranjang:", err);
      let errorMessage = "Gagal memuat data keranjang.";
      if (
        err.response &&
        (err.response.status === 401 || err.response.status === 403)
      ) {
        errorMessage = "Silakan login untuk melihat keranjang Anda."; // <--- Teks diubah
      }
      setError(errorMessage);
      setCartItems([]);
    } finally {
      if (showMainLoading) {
        setLoading(false);
      }
      setUpdatingItemId(null);
      setRemovingItemId(null);
    }
  };
  useEffect(() => {
    fetchCartItems(true);
  }, []);
  const totalHarga = useMemo(() => {
    return cartItems.reduce((total, item) => {
      // <--- Diubah: item?.pupuk?.harga -> item?.atk?.harga
      const harga = parseInt(item?.atk?.harga, 10) || 0;
      const quantity = item?.quantity ?? 0;
      return total + harga * quantity;
    }, 0);
  }, [cartItems]);
  const handleUpdateQuantity = async (cartItemId, newQuantity) => {
    const quantityNum = Math.max(1, parseInt(newQuantity, 10));
    const currentItem = cartItems.find((item) => item.id === cartItemId);
    if (currentItem && currentItem.quantity === quantityNum) return;
    setUpdatingItemId(cartItemId);
    try {
      await apiClient.put(`/keranjang/${cartItemId}`, {
        quantity: quantityNum,
      });
      await fetchCartItems(false);
    } catch (err) {
      console.error(`Gagal update kuantitas item ${cartItemId}:`, err);
      setError(err.response?.data?.message || "Gagal update kuantitas item.");
      setUpdatingItemId(null);
    }
  };
  const handleRemoveItem = async (cartItemId, itemName) => {
    const displayNama = itemName || "item ini";
    if (
      window.confirm(`Yakin ingin menghapus ${displayNama} dari keranjang?`)
    ) {
      setRemovingItemId(cartItemId);
      try {
        await apiClient.delete(`/keranjang/${cartItemId}`);
        await fetchCartItems(false);
      } catch (err) {
        console.error(`Gagal hapus item ${cartItemId}:`, err);
        setError(err.response?.data?.message || "Gagal menghapus item.");
        setRemovingItemId(null);
      }
    }
  };
  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Link
              to="/katalog"
              className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              <span className="text-sm font-medium">Kembali ke Katalog</span>
            </Link>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items Section */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                  <h1 className="text-2xl font-bold text-slate-800">
                    Keranjang Belanja
                  </h1>
                  <p className="text-slate-500 mt-1">
                    {cartItems.length} item dalam keranjang
                  </p>
                </div>

                {error && (
                  <div className="m-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl">
                    <p>{error}</p>
                    {(error.includes("login") || error.includes("Sesi")) && (
                      <button
                        onClick={() => navigate("/login")}
                        className="mt-3 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
                      >
                        Login
                      </button>
                    )}
                  </div>
                )}

                {loading ? (
                  <div className="p-6 space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <CartItemSkeleton key={i} />
                    ))}
                  </div>
                ) : cartItems.length === 0 ? (
                  <div className="text-center p-12">
                    <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ShoppingCartIcon className="h-10 w-10 text-emerald-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">
                      Keranjang Anda Kosong
                    </h3>
                    <p className="text-slate-500 mb-6">
                      Tambahkan beberapa ATK berkualitas untuk memulai.
                    </p>
                    <Link
                      to="/katalog"
                      className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200"
                    >
                      Mulai Belanja
                    </Link>
                  </div>
                ) : (
                  <ul role="list" className="divide-y divide-slate-100">
                    {cartItems.map((item) => {
                      const isUpdating = updatingItemId === item.id;
                      const isRemoving = removingItemId === item.id;
                      const currentItemLoading = isUpdating || isRemoving;
                      const isAvailable =
                        item.atk?.status_ketersediaan?.toLowerCase() ===
                        "tersedia";
                      const namaAtk =
                        item.atk?.nama_atk ||
                        item.atk?.nama ||
                        "Nama ATK Tidak Tersedia";
                      const hargaAtk = parseInt(item.atk?.harga, 10) || 0;

                      return (
                        <li
                          key={item.id}
                          className={cn(
                            "p-6 transition-all duration-200",
                            currentItemLoading && "opacity-50 bg-slate-50"
                          )}
                        >
                          <div className="flex items-center gap-6">
                            <div className="relative">
                              <img
                                src={item.atk?.gambar_utama}
                                alt={namaAtk}
                                className="w-24 h-24 rounded-xl object-cover bg-slate-100"
                                loading="lazy"
                                onError={(e) => {
                                  e.target.src =
                                    "https://via.placeholder.com/100?text=Err";
                                }}
                              />
                              {!isAvailable && (
                                <div className="absolute inset-0 bg-slate-900/50 rounded-xl flex items-center justify-center">
                                  <span className="text-white text-xs font-medium px-2 py-1 bg-rose-500 rounded-full">
                                    Habis
                                  </span>
                                </div>
                              )}
                            </div>

                            <div className="flex-grow min-w-0">
                              <Link
                                to={`/atk/${item.atk?.slug || "#"}`}
                                className="text-lg font-semibold text-slate-800 hover:text-emerald-600 transition-colors line-clamp-2"
                              >
                                {namaAtk}
                              </Link>
                              <p className="text-emerald-600 font-medium mt-1">
                                {formatRupiah(hargaAtk)}
                              </p>
                            </div>

                            <div className="flex flex-col items-end gap-4">
                              <div className="flex items-center gap-4">
                                <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                                  <button
                                    onClick={() =>
                                      handleUpdateQuantity(
                                        item.id,
                                        item.quantity - 1
                                      )
                                    }
                                    disabled={
                                      item.quantity <= 1 || currentItemLoading
                                    }
                                    className="px-3 py-2 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    aria-label="Kurangi"
                                  >
                                    <MinusIcon className="h-4 w-4" />
                                  </button>
                                  <span
                                    className={cn(
                                      "px-4 py-2 text-sm font-medium border-x border-slate-200 w-12 text-center",
                                      isUpdating &&
                                        "animate-pulse text-transparent"
                                    )}
                                  >
                                    {isUpdating ? "..." : item.quantity}
                                  </span>
                                  <button
                                    onClick={() =>
                                      handleUpdateQuantity(
                                        item.id,
                                        item.quantity + 1
                                      )
                                    }
                                    disabled={
                                      currentItemLoading || !isAvailable
                                    }
                                    className="px-3 py-2 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    aria-label="Tambah"
                                  >
                                    <PlusIcon className="h-4 w-4" />
                                  </button>
                                </div>

                                <button
                                  onClick={() =>
                                    handleRemoveItem(item.id, namaAtk)
                                  }
                                  disabled={currentItemLoading}
                                  className="p-2 text-slate-400 hover:text-rose-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  title="Hapus Item"
                                >
                                  {isRemoving ? (
                                    <ArrowPathIcon className="h-5 w-5 animate-spin" />
                                  ) : (
                                    <TrashIcon className="h-5 w-5" />
                                  )}
                                </button>
                              </div>

                              <p className="text-lg font-semibold text-slate-800">
                                {formatRupiah(hargaAtk * item.quantity)}
                              </p>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>

            {/* Order Summary Section */}
            {!loading && cartItems.length > 0 && (
              <div className="lg:w-1/3">
                <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
                  <h2 className="text-xl font-bold text-slate-800 mb-6">
                    Ringkasan Belanja
                  </h2>

                  <div className="space-y-4">
                    <div className="flex justify-between text-slate-600">
                      <span>Subtotal</span>
                      <span className="font-medium">
                        {formatRupiah(totalHarga)}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Pengiriman</span>
                      <span className="text-emerald-600">
                        Dihitung saat checkout
                      </span>
                    </div>
                    <div className="border-t border-slate-200 pt-4 mt-4">
                      <div className="flex justify-between text-lg font-bold text-slate-800">
                        <span>Total</span>
                        <span>{formatRupiah(totalHarga)}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleCheckout}
                    disabled={cartItems.length === 0}
                    className={cn(
                      "w-full mt-6 flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-medium transition-all duration-200",
                      cartItems.length === 0
                        ? "bg-slate-400 cursor-not-allowed"
                        : "bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/20"
                    )}
                  >
                    <CreditCardIcon className="h-5 w-5" />
                    <span>Lanjut ke Pembayaran</span>
                  </button>

                  <p className="mt-4 text-sm text-center text-slate-500">
                    <InformationCircleIcon className="h-4 w-4 inline mr-1 align-text-bottom" />
                    Biaya pengiriman akan dihitung pada langkah berikutnya
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default KeranjangPage;
