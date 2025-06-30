// src/pages/PesananDetailPage.jsx

import React, { useState, useEffect, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import apiClient from "../../../api/apiClient"; // Sesuaikan path apiClient Anda
import {
  ArrowLeftIcon,
  ShoppingBagIcon,
  UserCircleIcon,
  MapPinIcon,
  PhoneIcon,
  CreditCardIcon,
  TagIcon,
  CalendarDaysIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  ClockIcon,
  ShieldCheckIcon,
  PencilIcon,
  XCircleIcon,
  PhotoIcon,
  CubeTransparentIcon, // Untuk Nomor Resi
  CheckBadgeIcon, // Untuk tombol Tandai Selesai
  BanknotesIcon, // Untuk Rincian Pembayaran
  ReceiptPercentIcon, // Untuk status
  TruckIcon, // Untuk Pengiriman
} from "@heroicons/react/24/outline";
import { CheckCircleIcon as SolidCheckCircleIcon } from "@heroicons/react/24/solid";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

const getStatusPesananColor = (status) => {
  const lowerStatus = status?.toLowerCase();
  switch (lowerStatus) {
    case "baru":
    case "pending":
      return {
        bg: "bg-blue-100",
        text: "text-blue-700",
        ring: "ring-blue-200",
        icon: ShoppingBagIcon,
      };
    case "menunggu_konfirmasi_pembayaran":
      return {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        ring: "ring-yellow-300",
        icon: ClockIcon,
      };
    case "lunas":
    case "diproses":
      return {
        bg: "bg-atk-secondary/10",
        text: "text-atk-secondary",
        ring: "ring-atk-secondary/20",
        icon: ArrowPathIcon,
      };
    case "dikirim":
      return {
        bg: "bg-atk-tertiary/10",
        text: "text-atk-tertiary",
        ring: "ring-atk-tertiary/20",
        icon: TruckIcon,
      };
    case "selesai":
      return {
        bg: "bg-green-100",
        text: "text-green-700",
        ring: "ring-green-200",
        icon: SolidCheckCircleIcon,
      };
    case "dibatalkan":
    case "batal":
      return {
        bg: "bg-red-100",
        text: "text-red-700",
        ring: "ring-red-200",
        icon: XCircleIcon,
      };
    default:
      return {
        bg: "bg-slate-100",
        text: "text-slate-700",
        ring: "ring-slate-200",
        icon: InformationCircleIcon,
      };
  }
};

const formatRupiah = (angka) => {
  if (angka === null || angka === undefined || isNaN(Number(angka)))
    return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(angka));
};

const StatusPesananDisplay = ({ status }) => {
  const { bg, text, ring, icon: Icon } = getStatusPesananColor(status);
  const lowerStatus = status?.toLowerCase();
  const formattedText = status
    ? status.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
    : "Tidak Diketahui";

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${bg} ${text} ring-1 ring-inset ${ring}`}
    >
      <Icon
        className={`h-5 w-5 ${
          (lowerStatus === "diproses" || lowerStatus === "lunas") &&
          "animate-spin"
        }`}
      />
      <span>{formattedText}</span>
    </div>
  );
};

const StatusPembayaranDisplay = ({ status }) => {
  let colorClass = "bg-gray-100 text-gray-800";
  let Icon = InformationCircleIcon;
  let text = status || "Belum Ada Info";
  const lowerStatus = status?.toLowerCase();

  switch (lowerStatus) {
    case "pending":
    case "menunggu_pembayaran":
      colorClass = "bg-yellow-100 text-yellow-700";
      Icon = ClockIcon;
      break;
    case "paid":
    case "settlement":
    case "capture":
    case "lunas":
      colorClass = "bg-green-100 text-green-700";
      Icon = ShieldCheckIcon;
      text = "Lunas";
      break;
    case "challenge":
      colorClass = "bg-orange-100 text-orange-700";
      Icon = ExclamationTriangleIcon;
      text = "Challenge";
      break;
    case "failure":
    case "failed":
    case "deny":
    case "cancel":
    case "cancelled":
    case "expire":
    case "expired":
      colorClass = "bg-red-100 text-red-700";
      Icon = XCircleIcon;
      text = status
        ? status.charAt(0).toUpperCase() + status.slice(1)
        : "Gagal/Batal";
      break;
    default:
      text = "N/A";
      Icon = InformationCircleIcon;
      break;
  }
  return (
    <span
      className={`px-3 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${colorClass}`}
    >
      <Icon className="h-4 w-4 mr-1.5" />
      {text}
    </span>
  );
};

const DetailSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-8 w-3/4 rounded-md bg-slate-200 mb-8"></div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Kolom Kiri */}
      <div className="lg:col-span-2 space-y-8">
        {/* Card Produk */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-lg">
          <div className="p-6 border-b border-slate-200">
            <div className="h-6 w-1/3 rounded-md bg-slate-200"></div>
          </div>
          <div className="p-6 space-y-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-24 h-24 rounded-lg bg-slate-200"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-5 w-3/4 rounded-md bg-slate-200"></div>
                  <div className="h-4 w-1/2 rounded-md bg-slate-200"></div>
                </div>
                <div className="h-5 w-1/4 rounded-md bg-slate-200"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Kolom Kanan */}
      <div className="lg:col-span-1 space-y-8">
        {/* Card Info Pelanggan */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-lg">
          <div className="p-6 border-b border-slate-200">
            <div className="h-6 w-1/2 rounded-md bg-slate-200"></div>
          </div>
          <div className="p-6 space-y-4">
            <div className="h-4 w-full rounded-md bg-slate-200"></div>
            <div className="h-4 w-3/4 rounded-md bg-slate-200"></div>
            <div className="h-4 w-5/6 rounded-md bg-slate-200"></div>
          </div>
        </div>
        {/* Card Rincian Pembayaran */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-lg">
          <div className="p-6 border-b border-slate-200">
            <div className="h-6 w-2/3 rounded-md bg-slate-200"></div>
          </div>
          <div className="p-6 space-y-4">
            <div className="h-4 w-full rounded-md bg-slate-200"></div>
            <div className="h-4 w-3/4 rounded-md bg-slate-200"></div>
            <div className="h-5 w-full rounded-md bg-slate-300 mt-2"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const InfoCard = ({ title, icon, children }) => (
  <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
    <div className="p-5 sm:p-6 border-b border-slate-100 bg-slate-50/50">
      <div className="flex items-center gap-3">
        {React.createElement(icon, { className: "h-6 w-6 text-atk-primary" })}
        <h3 className="text-lg font-bold text-atk-dark">{title}</h3>
      </div>
    </div>
    <div className="p-5 sm:p-6">{children}</div>
  </div>
);

const InfoRow = ({ label, value, children, className = "" }) => (
  <div
    className={`flex justify-between items-start py-2.5 ${className} border-b border-slate-100 last:border-b-0`}
  >
    <span className="text-sm text-slate-500">{label}</span>
    {children || (
      <span className="text-sm font-semibold text-atk-dark text-right">
        {value || "-"}
      </span>
    )}
  </div>
);

function PesananDetailPage() {
  const { orderId: id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(null);

  const fetchOrderDetail = useCallback(async (orderId) => {
    console.log(
      `[DEBUG] Memulai fetchOrderDetail untuk ID: ${orderId}. URL: /api/pesanan/${orderId}`
    );
    setLoading(true);
    setError(null);
    setUpdateError(null);
    try {
      const response = await apiClient.get(`/pesanan/${orderId}`);
      console.log("[DEBUG] Respon mentah dari API:", response);

      if (response.data && response.data.data) {
        console.log("[DEBUG] Data pesanan DITERIMA:", response.data.data);
        setOrder(response.data.data);
      } else {
        console.warn(
          "[DEBUG] Respon diterima, tapi format data tidak sesuai atau data kosong:",
          response.data
        );
        setOrder(null);
        setError("Format data pesanan tidak sesuai.");
      }
    } catch (err) {
      console.error("[DEBUG] Gagal total saat fetch:", err);
      if (err.response) {
        console.error("[DEBUG] Error response data:", err.response.data);
        console.error("[DEBUG] Error response status:", err.response.status);
      }
      if (err.response?.status === 404) {
        setError("Pesanan tidak ditemukan.");
      } else if (err.response?.status === 403) {
        setError("Anda tidak memiliki izin untuk melihat pesanan ini.");
      } else {
        setError("Terjadi kesalahan saat mengambil data. Silakan coba lagi.");
      }
      setOrder(null);
    } finally {
      console.log("[DEBUG] Proses fetch selesai, setLoading(false).");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log(`[DEBUG] useEffect dijalankan dengan id: ${id}`);
    if (id) {
      fetchOrderDetail(id);
    }
  }, [id, fetchOrderDetail]);

  const handleMarkAsDone = async () => {
    setIsUpdating(true);
    setUpdateError(null);
    try {
      const response = await apiClient.post(`/pesanan/${id}/tandai-selesai`);
      if (response.data && response.data.data) {
        setOrder(response.data.data);
      } else {
        throw new Error("Gagal memperbarui status pesanan dari server.");
      }
    } catch (err) {
      console.error("Gagal menandai pesanan selesai:", err);
      const errorMessage =
        err.response?.data?.message ||
        "Gagal terhubung ke server. Silakan coba lagi.";
      setUpdateError(errorMessage);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleImageError = (e) => {
    e.target.onerror = null; // mencegah loop tak terbatas jika gambar placeholder juga gagal
    e.target.src = "/placeholder-image.png"; // Ganti dengan path gambar placeholder Anda
  };

  const formatDate = (dateString) => {
    if (!dateString) return { tanggal: "N/A", jam: "" };
    try {
      const dateObj = new Date(dateString);
      if (isNaN(dateObj.getTime())) {
        // Handle invalid date string
        return { tanggal: "Format Tanggal Salah", jam: "" };
      }
      return {
        tanggal: format(dateObj, "dd MMMM yyyy", { locale: idLocale }),
        jam: format(dateObj, "HH:mm", { locale: idLocale }),
      };
    } catch (e) {
      console.error("Error formatting date:", e);
      return { tanggal: "Error", jam: "" };
    }
  };

  if (loading) return <DetailSkeleton />;
  if (error)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
        <ExclamationTriangleIcon className="h-16 w-16 text-red-400 mb-4" />
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          Gagal Memuat Detail Pesanan
        </h2>
        <p className="text-slate-500 max-w-md">{error}</p>
        <button
          onClick={() => fetchOrderDetail(id)}
          className="mt-6 inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-atk-primary hover:bg-atk-secondary focus:outline-none"
        >
          <ArrowPathIcon className="h-5 w-5 mr-2" /> Coba Lagi
        </button>
        {updateError && (
          <p className="mt-4 text-sm text-red-600 bg-red-100 p-3 rounded-md">
            {updateError}
          </p>
        )}
      </div>
    );
  if (!order)
    return (
      <div className="text-center p-10">
        Pesanan tidak ditemukan atau Anda tidak memiliki akses.
      </div>
    );

  const { tanggal: tanggalPesan, jam: jamPesan } = formatDate(
    order.tanggal_pesanan || order.created_at
  );

  // Perhitungan Subtotal, Ongkir, dll. (Contoh)
  const subtotal = order.items.reduce(
    (acc, item) => acc + (item.harga_saat_pesanan || 0) * (item.jumlah || 0),
    0
  );
  const ongkir = 15000; // Contoh statis
  const totalPembayaran = order.total_harga || subtotal + ongkir;

  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <Link
              to="/pesanan"
              className="inline-flex items-center gap-2 text-sm font-semibold text-atk-secondary hover:text-atk-primary transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              Kembali ke Riwayat Pesanan
            </Link>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-atk-dark mt-2">
              Detail Pesanan
            </h1>
            <p className="text-slate-500 mt-1">
              ID Pesanan:{" "}
              <span className="font-semibold text-atk-tertiary">
                #{order.id}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-4">
            <StatusPesananDisplay status={order.status} />
          </div>
        </div>

        {/* Konten Utama */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* Kolom Kiri: Rincian Produk & Pengiriman */}
          <div className="lg:col-span-3 space-y-8">
            <InfoCard title="Produk Dipesan" icon={ShoppingBagIcon}>
              <div className="divide-y divide-slate-100">
                {(order.items || []).map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 py-4 first:pt-0 last:pb-0"
                  >
                    <img
                      src={item.gambar_utama_url}
                      alt={item.nama_atk}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover bg-slate-100 flex-shrink-0"
                      onError={handleImageError}
                      loading="lazy"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm sm:text-base font-bold text-atk-dark truncate">
                        {item.nama_atk || "Produk"}
                      </p>
                      <p className="text-xs sm:text-sm text-slate-500 mt-1">
                        {item.jumlah || 0} x{" "}
                        {formatRupiah(item.harga_saat_pesanan || 0)}
                      </p>
                    </div>
                    <p className="text-sm sm:text-base font-semibold text-atk-dark whitespace-nowrap">
                      {formatRupiah(
                        (item.harga_saat_pesanan || 0) * (item.jumlah || 0)
                      )}
                    </p>
                  </div>
                ))}
              </div>
            </InfoCard>

            <InfoCard title="Info Pengiriman" icon={TruckIcon}>
              <InfoRow label="Kurir" value="JNE Express (Contoh)" />
              <InfoRow label="Nomor Resi">
                {order.nomor_resi ? (
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-atk-tertiary bg-atk-tertiary/10 px-2 py-1 rounded-md">
                    <CubeTransparentIcon className="h-4 w-4" />
                    {order.nomor_resi}
                  </span>
                ) : (
                  <span className="text-sm text-slate-400 italic">
                    Belum tersedia
                  </span>
                )}
              </InfoRow>
              <InfoRow label="Alamat Pengiriman" />
              <div className="text-sm text-slate-600 pt-2">
                <p className="font-semibold">{order.nama_pelanggan}</p>
                <p>{order.nomor_whatsapp}</p>
                <p>{order.alamat_pengiriman}</p>
              </div>
            </InfoCard>
          </div>

          {/* Kolom Kanan: Rincian Pembayaran, Pelanggan, Aksi */}
          <div className="lg:col-span-2 space-y-8">
            <InfoCard title="Rincian Pembayaran" icon={BanknotesIcon}>
              <InfoRow label="Subtotal Produk" value={formatRupiah(subtotal)} />
              <InfoRow label="Ongkos Kirim" value={formatRupiah(ongkir)} />
              <InfoRow
                label="Total Pembayaran"
                value={formatRupiah(totalPembayaran)}
                className="!font-extrabold !text-lg !text-atk-primary"
              />
              <InfoRow
                label="Metode Pembayaran"
                value={order.metode_pembayaran || "N/A"}
              />
              <InfoRow label="Status Pembayaran">
                <StatusPembayaranDisplay status={order.status_pembayaran} />
              </InfoRow>
            </InfoCard>

            <InfoCard title="Informasi Pelanggan" icon={UserCircleIcon}>
              <InfoRow label="Nama" value={order.nama_pelanggan} />
              <InfoRow label="No. WhatsApp" value={order.nomor_whatsapp} />
              <InfoRow
                label="Tanggal Pesan"
                value={`${tanggalPesan}, ${jamPesan} WIB`}
              />
            </InfoCard>

            {/* Tombol Aksi */}
            <div className="space-y-3">
              {order.status === "dikirim" && (
                <button
                  onClick={handleMarkAsDone}
                  className="w-full flex items-center justify-center gap-2 bg-atk-primary text-white font-bold px-6 py-3 rounded-lg shadow-lg hover:bg-atk-secondary transition-all"
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <ArrowPathIcon className="h-5 w-5 animate-spin" />
                  ) : (
                    <CheckBadgeIcon className="h-6 w-6" />
                  )}
                  Tandai Pesanan Selesai
                </button>
              )}
              {order.status === "baru" && (
                <Link
                  to={`/payment/${order.id}`}
                  className="w-full flex items-center justify-center gap-2 bg-green-500 text-white font-bold px-6 py-3 rounded-lg shadow-lg hover:bg-green-600 transition-all"
                >
                  <BanknotesIcon className="h-6 w-6" />
                  Lanjutkan Pembayaran
                </Link>
              )}
              <button className="w-full border border-slate-300 text-atk-dark font-semibold px-6 py-3 rounded-lg hover:bg-slate-100 transition-colors">
                Hubungi Penjual
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PesananDetailPage;
