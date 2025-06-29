// File: src/pages/PaymentPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import apiClient from "../../../api/apiClient";
import PaymentProofUploadForm from "./PaymentProofUploadFormView.jsx";
import {
  ArrowPathIcon,
  CheckCircleIcon,
  BanknotesIcon,
  InformationCircleIcon,
  XCircleIcon,
  ArrowLeftIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { formatRupiah } from "../../../components/formatRupiah.jsx"; // Sesuaikan path jika berbeda

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ArrowPathIcon className="animate-spin h-12 w-12 text-atk-primary mx-auto mb-4" />
          <p className="text-lg text-gray-700">Memuat detail pembayaran...</p>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-white border border-gray-200 rounded-xl p-8 text-center shadow-sm">
            <XCircleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Terjadi Kesalahan
            </h2>
            <p className="text-gray-600 mb-6">{fetchError}</p>
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 bg-atk-primary text-white font-medium rounded-lg hover:bg-atk-secondary transition-colors"
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
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-white border border-gray-200 rounded-xl p-8 text-center shadow-sm">
            <InformationCircleIcon className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Informasi Pesanan Tidak Ditemukan
            </h2>
            <p className="text-gray-600 mb-6">
              Tidak dapat menemukan detail untuk pesanan ini.
            </p>
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 bg-atk-primary text-white font-medium rounded-lg hover:bg-atk-secondary transition-colors"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="max-w-2xl mx-auto">
          {/* Navigation */}
          <div className="flex items-center gap-4 mb-8">
            <Link
              to="/pesanan"
              className="flex items-center gap-2 text-atk-primary hover:text-atk-secondary transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              <span className="text-sm font-medium">
                Kembali ke Daftar Pesanan
              </span>
            </Link>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            {/* Success Header */}
            <div className="p-8 text-center border-b border-gray-100 bg-gradient-to-r from-red-50 to-pink-50">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircleIcon className="h-10 w-10 text-atk-primary" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Pesanan Anda Berhasil Dibuat!
              </h1>
              <div className="flex items-center justify-center gap-2 text-gray-600 mb-4">
                <ClockIcon className="h-5 w-5" />
                <span className="text-sm">Batas waktu pembayaran: 24 jam</span>
              </div>
              <div className="space-y-2">
                <p className="text-gray-600">
                  ID Pesanan:{" "}
                  <span className="font-semibold text-atk-primary">
                    {order.id}
                  </span>
                </p>
                <p className="text-lg">
                  Total Pembayaran:{" "}
                  <span className="font-bold text-atk-secondary">
                    {formatRupiah(order.total_harga)}
                  </span>
                </p>
              </div>
            </div>

            {/* Payment Instructions */}
            <div className="p-8 bg-gray-50">
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <BanknotesIcon className="h-6 w-6 text-atk-primary" />
                  Instruksi Pembayaran
                </h2>
                <p className="text-gray-600 mb-4">
                  Silakan lakukan transfer ke salah satu rekening bank kami:
                </p>
                <div className="space-y-4">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      Bank BCA
                    </p>
                    <p className="text-lg font-bold text-atk-primary">
                      1234567890
                    </p>
                    <p className="text-sm text-gray-500">
                      a/n: PT Andika Tani Sejahtera
                    </p>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      Bank Mandiri
                    </p>
                    <p className="text-lg font-bold text-atk-primary">
                      0987654321
                    </p>
                    <p className="text-sm text-gray-500">
                      a/n: PT Andika Tani Sejahtera
                    </p>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm font-medium text-yellow-800 mb-2">
                    PENTING: Pastikan Anda mentransfer sesuai dengan jumlah
                    total di atas.
                  </p>
                  <p className="text-xs text-yellow-700">
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
