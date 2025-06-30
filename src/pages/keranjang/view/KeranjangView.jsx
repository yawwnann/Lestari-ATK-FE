import React, { useState, useEffect, useMemo } from "react";
import apiClient from "../../../api/apiClient";
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
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

import {
  CheckCircleIcon as SolidCheckCircle,
  XCircleIcon as SolidXCircle,
} from "@heroicons/react/24/solid";
import { cn } from "../../../lib/utils";
import CartList from "./CartList";

const formatRupiah = (angka) => {
  const number = typeof angka === "string" ? parseInt(angka, 10) : angka;
  if (isNaN(number) || number === null || number === undefined) return "Rp 0";
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

// --- Komponen Skeleton ---
const CartSkeleton = () => (
  <div className="animate-pulse">
    <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 xl:gap-x-16">
      <div className="lg:col-span-7">
        <div className="h-8 w-1/3 bg-slate-200 rounded-md mb-6"></div>
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-4 border border-slate-200 rounded-lg"
            >
              <div className="w-24 h-24 bg-slate-200 rounded-md"></div>
              <div className="flex-1 space-y-2">
                <div className="h-5 w-3/4 bg-slate-200 rounded-md"></div>
                <div className="h-4 w-1/4 bg-slate-200 rounded-md"></div>
                <div className="h-6 w-1/2 bg-slate-200 rounded-md mt-2"></div>
              </div>
              <div className="h-5 w-1/6 bg-slate-200 rounded-md"></div>
            </div>
          ))}
        </div>
      </div>
      <div className="lg:col-span-5 mt-10 lg:mt-0">
        <div className="bg-slate-100 rounded-lg p-6">
          <div className="h-7 w-1/2 bg-slate-300 rounded-md mb-6"></div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <div className="h-4 w-1/4 bg-slate-200 rounded-md"></div>
              <div className="h-4 w-1/3 bg-slate-200 rounded-md"></div>
            </div>
            <div className="flex justify-between">
              <div className="h-4 w-1/4 bg-slate-200 rounded-md"></div>
              <div className="h-4 w-1/3 bg-slate-200 rounded-md"></div>
            </div>
            <div className="h-px w-full bg-slate-300 my-4"></div>
            <div className="flex justify-between">
              <div className="h-6 w-1/3 bg-slate-300 rounded-md"></div>
              <div className="h-6 w-1/2 bg-slate-300 rounded-md"></div>
            </div>
          </div>
          <div className="h-12 w-full bg-slate-300 rounded-lg mt-6"></div>
        </div>
      </div>
    </div>
  </div>
);

function KeranjangPage() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingItemId, setUpdatingItemId] = useState(null);
  const [removingItemId, setRemovingItemId] = useState(null);

  const fetchCartItems = async (showMainLoading = true) => {
    if (showMainLoading) setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get("/keranjang");
      setCartItems(response.data.data || []);
    } catch (err) {
      console.error("Gagal mengambil item keranjang:", err);
      if (
        err.response &&
        (err.response.status === 401 || err.response.status === 403)
      ) {
        setError(
          "Sesi Anda telah berakhir. Silakan login kembali untuk melihat keranjang."
        );
        setTimeout(
          () => navigate("/login", { state: { from: "/keranjang" } }),
          3000
        );
      } else {
        setError("Gagal memuat item keranjang. Coba muat ulang halaman.");
      }
      setCartItems([]);
    } finally {
      if (showMainLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const handleUpdateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;
    setUpdatingItemId(cartItemId);
    try {
      await apiClient.put(`/keranjang/${cartItemId}`, {
        quantity: newQuantity,
      });
      await fetchCartItems(false);
    } catch (err) {
      console.error("Gagal memperbarui kuantitas:", err);
      alert("Gagal memperbarui kuantitas. Silakan coba lagi.");
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleRemoveItem = async (cartItemId, itemName) => {
    if (
      !window.confirm(
        `Apakah Anda yakin ingin menghapus "${itemName}" dari keranjang?`
      )
    )
      return;
    setRemovingItemId(cartItemId);
    try {
      await apiClient.delete(`/keranjang/${cartItemId}`);
      await fetchCartItems(false);
    } catch (err) {
      console.error("Gagal menghapus item:", err);
      alert("Gagal menghapus item. Silakan coba lagi.");
    } finally {
      setRemovingItemId(null);
    }
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  const totalBelanja = useMemo(() => {
    return cartItems.reduce((total, item) => {
      const harga = parseInt(item.atk?.harga, 10) || 0;
      return total + item.quantity * harga;
    }, 0);
  }, [cartItems]);

  const ongkosKirim = 15000; // Contoh statis
  const totalPembayaran = totalBelanja + ongkosKirim;

  if (loading) {
    return (
      <div className="bg-white">
        <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-atk-dark sm:text-4xl mb-12">
            Keranjang Belanja
          </h1>
          <CartSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 px-6 bg-white min-h-[60vh] flex flex-col justify-center items-center">
        <ExclamationTriangleIcon className="h-16 w-16 text-red-400 mb-4" />
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          Terjadi Kesalahan
        </h2>
        <p className="text-slate-500 max-w-md">{error}</p>
        <button
          onClick={() => fetchCartItems()}
          className="mt-6 inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-atk-primary hover:bg-atk-secondary focus:outline-none"
        >
          <ArrowPathIcon className="h-5 w-5 mr-2 -ml-1" />
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 pt-16 pb-24 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-atk-dark sm:text-4xl">
          Keranjang Belanja
        </h1>

        <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          <section aria-labelledby="cart-heading" className="lg:col-span-7">
            <h2 id="cart-heading" className="sr-only">
              Item di dalam keranjang belanja Anda
            </h2>

            {cartItems.length > 0 ? (
              <CartList
                items={cartItems}
                updatingItemId={updatingItemId}
                removingItemId={removingItemId}
                onUpdateQuantity={handleUpdateQuantity}
                onRemove={handleRemoveItem}
              />
            ) : (
              <div className="text-center py-16 px-6 border-2 border-dashed border-slate-200 rounded-lg">
                <ShoppingCartIcon className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-700">
                  Keranjang Anda kosong
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Sepertinya Anda belum menambahkan item apa pun.
                </p>
                <Link
                  to="/katalog"
                  className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-atk-primary hover:bg-atk-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Mulai Belanja
                </Link>
              </div>
            )}
          </section>

          {/* Order summary */}
          {cartItems.length > 0 && (
            <section
              aria-labelledby="summary-heading"
              className="mt-16 rounded-lg bg-slate-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
            >
              <h2
                id="summary-heading"
                className="text-lg font-bold text-atk-dark"
              >
                Ringkasan Pesanan
              </h2>

              <dl className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-slate-600">Total Belanja</dt>
                  <dd className="text-sm font-medium text-slate-900">
                    {formatRupiah(totalBelanja)}
                  </dd>
                </div>
                <div className="flex items-center justify-between border-t border-slate-200 pt-4">
                  <dt className="flex items-center text-sm text-slate-600">
                    <span>Ongkos Kirim</span>
                    <a
                      href="#"
                      className="ml-2 flex-shrink-0 text-slate-400 hover:text-slate-500"
                    >
                      <span className="sr-only">
                        Pelajari tentang estimasi ongkos kirim
                      </span>
                      <InformationCircleIcon
                        className="h-5 w-5"
                        aria-hidden="true"
                      />
                    </a>
                  </dt>
                  <dd className="text-sm font-medium text-slate-900">
                    {formatRupiah(ongkosKirim)}
                  </dd>
                </div>
                <div className="flex items-center justify-between border-t border-slate-200 pt-4">
                  <dt className="text-base font-bold text-atk-dark">
                    Total Pembayaran
                  </dt>
                  <dd className="text-base font-bold text-atk-primary">
                    {formatRupiah(totalPembayaran)}
                  </dd>
                </div>
              </dl>

              <div className="mt-6">
                <button
                  onClick={handleCheckout}
                  className="w-full flex items-center justify-center rounded-md border border-transparent bg-atk-primary px-6 py-3 text-base font-bold text-white shadow-sm hover:bg-atk-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={cartItems.length === 0}
                >
                  <CreditCardIcon className="h-5 w-5 mr-2" />
                  Lanjut ke Pembayaran
                </button>
              </div>

              <div className="mt-6 flex justify-center text-center text-sm text-slate-500">
                <p>
                  atau{" "}
                  <Link
                    to="/katalog"
                    className="font-medium text-atk-secondary hover:text-atk-primary"
                  >
                    Lanjutkan Belanja
                    <span aria-hidden="true"> &rarr;</span>
                  </Link>
                </p>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

export default KeranjangPage;
