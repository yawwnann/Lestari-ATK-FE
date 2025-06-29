// File: src/pages/CheckoutPage.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import apiClient from "../api/apiClient";
import {
  ShoppingCartIcon,
  UserCircleIcon,
  MapPinIcon,
  PhoneIcon,
  PencilIcon,
  CreditCardIcon,
  ArrowPathIcon,
  XCircleIcon,
  InformationCircleIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import {
  CheckCircleIcon as SolidCheckCircle,
  XCircleIcon as SolidXCircle,
} from "@heroicons/react/24/solid";
import { CheckoutPageSkeleton } from "../components/CheckoutSkeletons";
import { formatRupiah } from "../components/formatRupiah";

function CheckoutPage() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loadingCart, setLoadingCart] = useState(true);
  const [checkoutError, setCheckoutError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    namaPemesan: "",
    nomorHp: "",
    alamatPengiriman: "",
    catatan: "",
  });
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchCartAndUser = async () => {
      setLoadingCart(true);
      setCheckoutError(null);
      setCurrentUser(null);
      setCartItems([]);
      try {
        let userData = null;
        try {
          const userResponse = await apiClient.get("/user");
          if (isMounted && userResponse.data) {
            userData = userResponse.data.user;
            setCurrentUser(userData);
            setFormData((prev) => ({
              ...prev,
              namaPemesan: userData.name || "",
              nomorHp: userData.phone || userData.nomor_whatsapp || "",
            }));
          }
        } catch (userErr) {
          if (isMounted)
            console.warn("Gagal memuat data user:", userErr.message);
          if (userErr.response && userErr.response.status === 401) {
            navigate("/login");
            return;
          }
        }
        const cartResponse = await apiClient.get("/keranjang");
        if (isMounted) {
          if (cartResponse.data && Array.isArray(cartResponse.data.data)) {
            setCartItems(cartResponse.data.data);
          } else {
            setCartItems([]);
          }
        }
      } catch (err) {
        if (isMounted) {
          console.error("Gagal memuat data checkout:", err);
          if (err.response && err.response.status === 401) {
            setCheckoutError("Sesi Anda berakhir. Silakan login kembali.");
          } else {
            setCheckoutError(
              "Gagal memuat data keranjang. Muat ulang halaman."
            );
          }
          setCartItems([]);
        }
      } finally {
        if (isMounted) setLoadingCart(false);
      }
    };
    fetchCartAndUser();
    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const totalHarga = useMemo(() => {
    return cartItems.reduce((total, item) => {
      return total + (item.atk?.harga || 0) * (item.quantity || 0);
    }, 0);
  }, [cartItems]);

  const orderItems = cartItems.map((item) => ({
    atk_id: item.atk.id,
    quantity: item.quantity,
    harga_saat_pesanan: item.atk.harga,
  }));

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      alert("Keranjang Anda kosong.");
      return;
    }
    if (
      !formData.namaPemesan.trim() ||
      !formData.nomorHp.trim() ||
      !formData.alamatPengiriman.trim()
    ) {
      alert("Harap lengkapi Nama Penerima, Nomor HP, dan Alamat Pengiriman.");
      return;
    }
    setIsProcessingOrder(true);
    setCheckoutError(null);

    // Dapatkan tanggal saat ini dalam format YYYY-MM-DD
    const today = new Date();
    const tanggalPesananFormatted = today.toISOString().split("T")[0]; // "YYYY-MM-DD"

    const orderPayload = {
      user_id: currentUser?.id || null,
      nama_pelanggan: formData.namaPemesan,
      nomor_whatsapp: formData.nomorHp,
      alamat_pengiriman: formData.alamatPengiriman,
      catatan: formData.catatan,
      tanggal_pesanan: tanggalPesananFormatted, // <--- PERBAIKAN: Tambahkan tanggal_pesanan
      items: orderItems,
      total_harga: totalHarga,
    };
    try {
      const response = await apiClient.post("/pesanan", orderPayload);
      if (response.data && response.data.data && response.data.data.id) {
        const createdOrderData = response.data.data;
        setCartItems([]); // Kosongkan keranjang setelah order dibuat
        navigate(`/payment/${createdOrderData.id}`, {
          state: { order: createdOrderData },
        });
      } else {
        throw new Error("Respons pembuatan pesanan tidak valid.");
      }
    } catch (error) {
      console.error(
        "Gagal membuat pesanan:",
        error.response?.data || error.message
      );
      const serverErrorMessage =
        error.response?.data?.message ||
        "Terjadi kesalahan saat membuat pesanan.";
      const validationErrors = error.response?.data?.errors;
      let displayError = serverErrorMessage;
      if (validationErrors) {
        displayError +=
          "\n\nDetail:\n" + Object.values(validationErrors).flat().join("\n");
      }
      setCheckoutError(displayError);
    } finally {
      setIsProcessingOrder(false);
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(135deg, #fff 0%, var(--atk-primary) 10%, #fff 100%)",
      }}
    >
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="max-w-7xl mx-auto">
          {/* Navigation */}
          <div className="flex items-center gap-4 mb-8">
            <Link
              to="/keranjang"
              className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              <span className="text-sm font-medium">Kembali ke Keranjang</span>
            </Link>
          </div>

          {/* Header Checkout */}
          <div className="mb-8">
            <h1
              className="text-2xl sm:text-3xl font-bold mb-4"
              style={{ color: "var(--atk-dark)" }}
            >
              Checkout
            </h1>
            <p className="text-slate-500 mt-1">
              Lengkapi informasi pengiriman untuk melanjutkan
            </p>
          </div>

          {loadingCart ? (
            <CheckoutPageSkeleton />
          ) : checkoutError ? (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <XCircleIcon className="h-12 w-12 text-rose-500 mx-auto mb-4" />
              <p className="text-lg text-rose-600 mb-4 whitespace-pre-line">
                {checkoutError}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-medium"
              >
                Coba Lagi
              </button>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCartIcon className="h-10 w-10 text-emerald-500" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">
                Keranjang Anda kosong
              </h3>
              <p className="text-slate-500 mb-6">
                Tambahkan ATK ke keranjang untuk melanjutkan
              </p>
              <Link
                to="/katalog"
                className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-all duration-200"
              >
                Lihat Katalog
              </Link>
            </div>
          ) : (
            <form
              onSubmit={handleCreateOrder}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* SHIPPING SECTION */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <div className="p-6 border-b border-slate-100">
                    <h2 className="text-lg font-bold text-slate-800">
                      Informasi Pengiriman
                    </h2>
                    <p className="text-slate-500 mt-1">
                      Lengkapi data pengiriman dengan benar
                    </p>
                  </div>
                  <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="namaPemesan"
                          className="block text-sm font-medium text-slate-700 mb-2"
                        >
                          Nama Penerima <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="namaPemesan"
                          id="namaPemesan"
                          value={formData.namaPemesan}
                          onChange={handleInputChange}
                          className="block w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm transition-colors"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="nomorHp"
                          className="block text-sm font-medium text-slate-700 mb-2"
                        >
                          Nomor HP (WhatsApp){" "}
                          <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="tel"
                          name="nomorHp"
                          id="nomorHp"
                          value={formData.nomorHp}
                          onChange={handleInputChange}
                          className="block w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm transition-colors"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="alamatPengiriman"
                        className="block text-sm font-medium text-slate-700 mb-2"
                      >
                        Alamat Pengiriman Lengkap{" "}
                        <span className="text-rose-500">*</span>
                      </label>
                      <textarea
                        name="alamatPengiriman"
                        id="alamatPengiriman"
                        rows="3"
                        value={formData.alamatPengiriman}
                        onChange={handleInputChange}
                        className="block w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm transition-colors"
                        required
                      ></textarea>
                      <p className="mt-2 text-xs text-slate-500">
                        Detail: Jalan, No Rumah, RT/RW, Kel/Desa, Kec, Kab/Kota,
                        Prov, Kode Pos
                      </p>
                    </div>
                    <div>
                      <label
                        htmlFor="catatan"
                        className="block text-sm font-medium text-slate-700 mb-2"
                      >
                        Catatan (Opsional)
                      </label>
                      <textarea
                        name="catatan"
                        id="catatan"
                        rows="2"
                        value={formData.catatan}
                        onChange={handleInputChange}
                        className="block w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm transition-colors"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>

              {/* ORDER SUMMARY SECTION */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
                  <h2 className="text-lg font-bold text-slate-800 mb-6">
                    Ringkasan Pesanan
                  </h2>

                  {/* Order Items */}
                  <div className="mb-6">
                    <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex items-center gap-4">
                          <img
                            src={item.atk?.gambar_utama}
                            alt={item.atk?.nama_atk}
                            className="w-16 h-16 rounded-lg object-cover bg-slate-100"
                            loading="lazy"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-slate-800 truncate">
                              {item.atk?.nama_atk || "Item"}
                            </h4>
                            <p className="text-sm text-slate-500">
                              {formatRupiah(item.atk?.harga || 0)} x{" "}
                              {item.quantity}
                            </p>
                          </div>
                          <div className="text-sm font-medium text-slate-800">
                            {formatRupiah(
                              (item.atk?.harga || 0) * item.quantity
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price Summary */}
                  <div className="space-y-3 border-t border-slate-200 pt-4">
                    <div className="flex justify-between text-sm text-slate-600">
                      <span>Subtotal</span>
                      <span>{formatRupiah(totalHarga)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-slate-600">
                      <span>Pengiriman</span>
                      <span className="text-emerald-600">
                        Dihitung saat checkout
                      </span>
                    </div>
                    <div className="border-t border-slate-200 pt-3 mt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-base font-bold text-slate-800">
                          Total
                        </span>
                        <span className="text-xl font-bold text-emerald-600">
                          {formatRupiah(totalHarga)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessingOrder || cartItems.length === 0}
                    className="w-full mt-6 text-white font-medium py-3 rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{ background: "var(--atk-primary)" }}
                  >
                    {isProcessingOrder ? (
                      <>
                        <ArrowPathIcon className="animate-spin h-5 w-5" />
                        Memproses Pesanan...
                      </>
                    ) : (
                      <>
                        <CreditCardIcon className="h-5 w-5" />
                        Lanjut ke Pembayaran
                      </>
                    )}
                  </button>

                  <p className="mt-4 text-xs text-center text-slate-500 flex items-center justify-center gap-1">
                    <InformationCircleIcon className="h-4 w-4" />
                    Biaya pengiriman akan dihitung pada langkah berikutnya
                  </p>
                </div>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
export default CheckoutPage;
