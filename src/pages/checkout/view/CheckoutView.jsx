// File: src/pages/CheckoutPage.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import apiClient from "../../../api/apiClient";
import {
  ArrowLeftIcon,
  CreditCardIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  UserCircleIcon,
  MapPinIcon,
  PhoneIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import { CheckoutPageSkeleton as CheckoutSkeleton } from "../../../components/CheckoutSkeletons";
import { formatRupiah } from "../../../components/formatRupiah";

const FormInput = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = true,
  icon,
  error,
}) => (
  <div>
    <label
      htmlFor={id}
      className="block text-sm font-medium text-slate-700 mb-1"
    >
      {label}
    </label>
    <div className="relative">
      <span className="absolute inset-y-0 left-0 flex items-center pl-3">
        {React.createElement(icon, {
          className: "h-5 w-5 text-slate-400",
          "aria-hidden": true,
        })}
      </span>
      <input
        type={type}
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`block w-full rounded-md border-slate-300 pl-10 shadow-sm focus:border-atk-primary focus:ring-atk-primary sm:text-sm ${
          error ? "border-red-500" : ""
        }`}
      />
    </div>
    {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
  </div>
);

const FormTextarea = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  icon,
  error,
}) => (
  <div>
    <label
      htmlFor={id}
      className="block text-sm font-medium text-slate-700 mb-1"
    >
      {label}
    </label>
    <div className="relative">
      <span className="absolute top-3 left-0 flex items-center pl-3">
        {React.createElement(icon, {
          className: "h-5 w-5 text-slate-400",
          "aria-hidden": true,
        })}
      </span>
      <textarea
        id={id}
        name={id}
        rows={4}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`block w-full rounded-md border-slate-300 pl-10 shadow-sm focus:border-atk-primary focus:ring-atk-primary sm:text-sm ${
          error ? "border-red-500" : ""
        }`}
      />
    </div>
    {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
  </div>
);

function CheckoutPage() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [formData, setFormData] = useState({
    nama_pelanggan: "",
    nomor_whatsapp: "",
    alamat_pengiriman: "",
    catatan: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [userResponse, cartResponse] = await Promise.all([
          apiClient.get("/user").catch((err) => {
            if (err.response?.status === 401) throw err;
            return null;
          }),
          apiClient.get("/keranjang"),
        ]);

        if (userResponse?.data?.user) {
          const { user } = userResponse.data;
          setFormData((prev) => ({
            ...prev,
            nama_pelanggan: user.name || "",
            nomor_whatsapp: user.phone || user.nomor_whatsapp || "",
            alamat_pengiriman: user.alamat || "",
          }));
        }

        const items = cartResponse.data?.data || [];
        if (items.length === 0) {
          navigate("/keranjang", {
            state: { message: "Keranjang Anda kosong, tidak bisa checkout." },
          });
          return;
        }
        setCartItems(items);
      } catch (err) {
        console.error("Gagal memuat data checkout:", err);
        if (err.response?.status === 401) {
          navigate("/login", { state: { from: "/checkout" } });
        } else {
          setError("Gagal memuat data. Silakan coba lagi.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const totalBelanja = useMemo(() => {
    return cartItems.reduce((total, item) => {
      const harga = parseInt(item.atk?.harga, 10) || 0;
      return total + item.quantity * harga;
    }, 0);
  }, [cartItems]);

  const ongkosKirim = 15000;
  const totalPembayaran = totalBelanja + ongkosKirim;

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);
    setValidationErrors({});

    const orderPayload = {
      ...formData,
      items: cartItems.map((item) => ({
        atk_id: item.atk.id,
        quantity: item.quantity,
        harga_saat_pesanan: item.atk.harga,
      })),
      total_harga: totalPembayaran,
    };

    try {
      const response = await apiClient.post("/pesanan", orderPayload);
      const createdOrder = response.data?.data;
      if (createdOrder?.id) {
        navigate(`/payment/${createdOrder.id}`);
      } else {
        throw new Error("Respons server tidak valid setelah membuat pesanan.");
      }
    } catch (err) {
      console.error(
        "Gagal membuat pesanan:",
        err.response?.data || err.message
      );
      const res = err.response;
      if (res?.status === 422 && res.data?.errors) {
        setValidationErrors(res.data.errors);
        setError("Harap periksa kembali data yang Anda masukkan.");
      } else {
        setError(
          res?.data?.message || "Terjadi kesalahan saat memproses pesanan Anda."
        );
      }
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white">
        <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-atk-dark sm:text-4xl mb-12">
            Checkout
          </h1>
          <CheckoutSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 pt-16 pb-24 sm:px-6 lg:px-8">
        <div className="flex items-center mb-8">
          <Link
            to="/keranjang"
            className="inline-flex items-center gap-2 text-sm font-semibold text-atk-secondary hover:text-atk-primary transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            Kembali ke Keranjang
          </Link>
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight text-atk-dark sm:text-4xl">
          Informasi Pengiriman
        </h1>

        <form
          onSubmit={handleCreateOrder}
          className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16"
        >
          <section aria-labelledby="shipping-heading" className="lg:col-span-7">
            <h2 id="shipping-heading" className="sr-only">
              Detail Pengiriman
            </h2>

            <div className="space-y-6 bg-white border border-slate-200 rounded-lg p-6">
              <FormInput
                id="nama_pelanggan"
                label="Nama Penerima"
                value={formData.nama_pelanggan}
                onChange={handleInputChange}
                placeholder="Masukkan nama lengkap"
                icon={UserCircleIcon}
                error={validationErrors.nama_pelanggan?.[0]}
              />
              <FormInput
                id="nomor_whatsapp"
                label="Nomor Telepon (WhatsApp)"
                type="tel"
                value={formData.nomor_whatsapp}
                onChange={handleInputChange}
                placeholder="Contoh: 081234567890"
                icon={PhoneIcon}
                error={validationErrors.nomor_whatsapp?.[0]}
              />
              <FormTextarea
                id="alamat_pengiriman"
                label="Alamat Lengkap Pengiriman"
                value={formData.alamat_pengiriman}
                onChange={handleInputChange}
                placeholder="Masukkan jalan, nomor rumah, RT/RW, kelurahan, kecamatan, kota, dan kode pos"
                icon={MapPinIcon}
                error={validationErrors.alamat_pengiriman?.[0]}
              />
              <FormTextarea
                id="catatan"
                label="Catatan untuk Penjual (Opsional)"
                value={formData.catatan}
                onChange={handleInputChange}
                placeholder="Misalnya: Patokan alamat, permintaan khusus, dll."
                icon={PencilIcon}
              />
            </div>
          </section>

          {/* Order summary */}
          <section
            aria-labelledby="summary-heading"
            className="mt-16 rounded-lg bg-slate-50 lg:col-span-5 lg:mt-0"
          >
            <div className="sticky top-20 p-6">
              <h2
                id="summary-heading"
                className="text-lg font-bold text-atk-dark"
              >
                Ringkasan Pesanan
              </h2>

              {error && (
                <div className="mt-4 rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <ExclamationTriangleIcon
                        className="h-5 w-5 text-red-400"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        {error}
                      </h3>
                    </div>
                  </div>
                </div>
              )}

              <ul role="list" className="divide-y divide-slate-200 my-6">
                {cartItems.map((item) => (
                  <li key={item.id} className="flex py-4">
                    <div className="flex-shrink-0">
                      <img
                        src={
                          item.atk.gambar_utama_url ||
                          "https://placehold.co/80x80/e2e8f0/94a3b8?text=Gambar"
                        }
                        alt={item.atk.nama_atk}
                        className="w-20 h-20 rounded-md object-cover"
                      />
                    </div>
                    <div className="ml-4 flex flex-1 flex-col">
                      <div>
                        <div className="flex justify-between text-sm font-medium text-slate-900">
                          <h3>{item.atk.nama_atk}</h3>
                          <p className="ml-4">
                            {formatRupiah(item.atk.harga * item.quantity)}
                          </p>
                        </div>
                        <p className="mt-1 text-sm text-slate-500">
                          {item.quantity} x {formatRupiah(item.atk.harga)}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <dl className="space-y-4 border-t border-slate-200 pt-6">
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-slate-600">Total Belanja</dt>
                  <dd className="text-sm font-medium text-slate-900">
                    {formatRupiah(totalBelanja)}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-slate-600">Ongkos Kirim</dt>
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
                  type="submit"
                  disabled={isProcessing}
                  className="w-full flex items-center justify-center rounded-md border border-transparent bg-atk-primary px-6 py-4 text-base font-bold text-white shadow-sm hover:bg-atk-secondary transition-colors disabled:opacity-50 disabled:cursor-wait"
                >
                  {isProcessing ? (
                    <>
                      <ArrowPathIcon className="h-5 w-5 mr-2 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    <>
                      <CreditCardIcon className="h-5 w-5 mr-2" />
                      Buat Pesanan & Lanjut Bayar
                    </>
                  )}
                </button>
              </div>
            </div>
          </section>
        </form>
      </div>
    </div>
  );
}

export default CheckoutPage;
