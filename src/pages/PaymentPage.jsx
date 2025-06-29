// File: src/pages/PaymentPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import apiClient from "../api/apiClient";
import PaymentProofUploadForm from "./PaymentProofUploadForm.jsx"; // Sesuaikan path jika berbeda
import {
  ArrowPathIcon,
  CheckCircleIcon,
  BanknotesIcon,
  InformationCircleIcon,
  XCircleIcon,
  ArrowLeftIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { formatRupiah } from "../components/formatRupiah.jsx"; // Sesuaikan path jika berbeda

function PaymentPage() {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [order, setOrder] = useState(location.state?.order || null);
  const [loadingOrder, setLoadingOrder] = useState(!location.state?.order);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    if (!order && orderId) {
      const fetchOrderDetails = async () => {
        setLoadingOrder(true);
        setFetchError(null);
        try {
          const response = await apiClient.get(`/pesanan/${orderId}`);
          if (response.data && response.data.data) {
            setOrder(response.data.data);
          } else {
            throw new Error("Data pesanan tidak ditemukan.");
          }
        } catch (err) {
          console.error("Gagal memuat detail pesanan:", err);
          setFetchError(
            "Gagal memuat detail pesanan. Pastikan ID pesanan valid."
          );
        } finally {
          setLoadingOrder(false);
        }
      };
      fetchOrderDetails();
    } else if (order) {
      setLoadingOrder(false);
    }
  }, [orderId, order]);

  const handleProofUploadSuccess = (data) => {
    alert(
      data.message || "Bukti pembayaran berhasil. Admin akan memverifikasi."
    );
    navigate(`/pesanan`); // <--- Diubah: /PesananPage -> /pesanan
  };

  const handleProofUploadError = (errorMessage) => {
    console.warn("Gagal unggah bukti dari PaymentPage:", errorMessage);
  };

  if (loadingOrder) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <ArrowPathIcon className="animate-spin h-12 w-12 text-emerald-600 mx-auto mb-4" />
          <p className="text-lg text-slate-700">Memuat detail pembayaran...</p>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <XCircleIcon className="h-16 w-16 text-rose-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-800 mb-2">
              Terjadi Kesalahan
            </h2>
            <p className="text-slate-600 mb-6">{fetchError}</p>
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-all duration-200"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <InformationCircleIcon className="h-16 w-16 text-amber-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-800 mb-2">
              Informasi Pesanan Tidak Ditemukan
            </h2>
            <p className="text-slate-600 mb-6">
              Tidak dapat menemukan detail untuk pesanan ini.
            </p>
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-all duration-200"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="max-w-2xl mx-auto">
          {/* Navigation */}
          <div className="flex items-center gap-4 mb-8">
            <Link
              to="/pesanan"
              className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              <span className="text-sm font-medium">
                Kembali ke Daftar Pesanan
              </span>
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Success Header */}
            <div className="p-8 text-center border-b border-slate-100">
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircleIcon className="h-10 w-10 text-emerald-500" />
              </div>
              <h1 className="text-2xl font-bold text-slate-800 mb-2">
                Pesanan Anda Berhasil Dibuat!
              </h1>
              <div className="flex items-center justify-center gap-2 text-slate-600 mb-4">
                <ClockIcon className="h-5 w-5" />
                <span className="text-sm">Batas waktu pembayaran: 24 jam</span>
              </div>
              <div className="space-y-2">
                <p className="text-slate-600">
                  ID Pesanan:{" "}
                  <span className="font-semibold text-emerald-600">
                    {order.id}
                  </span>
                </p>
                <p className="text-lg">
                  Total Pembayaran:{" "}
                  <span className="font-bold text-emerald-600">
                    {formatRupiah(order.total_harga)}
                  </span>
                </p>
              </div>
            </div>

            {/* Payment Instructions */}
            <div className="p-8 bg-emerald-50/50">
              <div className="bg-white rounded-xl p-6 border border-emerald-100">
                <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <BanknotesIcon className="h-6 w-6 text-emerald-600" />
                  Instruksi Pembayaran
                </h2>
                <p className="text-slate-600 mb-4">
                  Silakan lakukan transfer ke salah satu rekening bank kami:
                </p>
                <div className="space-y-4">
                  <div className="bg-slate-50 rounded-lg p-4">
                    <p className="text-sm font-medium text-slate-700 mb-1">
                      Bank BCA
                    </p>
                    <p className="text-lg font-bold text-emerald-600">
                      1234567890
                    </p>
                    <p className="text-sm text-slate-500">
                      a/n: PT Andika Tani Sejahtera
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4">
                    <p className="text-sm font-medium text-slate-700 mb-1">
                      Bank Mandiri
                    </p>
                    <p className="text-lg font-bold text-emerald-600">
                      0987654321
                    </p>
                    <p className="text-sm text-slate-500">
                      a/n: PT Andika Tani Sejahtera
                    </p>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-100">
                  <p className="text-sm font-medium text-amber-800 mb-2">
                    PENTING: Pastikan Anda mentransfer sesuai dengan jumlah
                    total di atas.
                  </p>
                  <p className="text-xs text-amber-700">
                    Setelah melakukan transfer, mohon unggah bukti pembayaran
                    Anda di bawah ini dalam waktu 1x24 jam.
                  </p>
                </div>
              </div>
            </div>

            {/* Upload Form */}
            <div className="p-8">
              <PaymentProofUploadForm
                orderId={order.id}
                onUploadSuccess={handleProofUploadSuccess}
                onUploadError={handleProofUploadError}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default PaymentPage;
