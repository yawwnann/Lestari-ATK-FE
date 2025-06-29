// File: src/components/PaymentProofUploadForm.jsx (Contoh path)
import React, { useState } from "react";
import apiClient from "../../../api/apiClient"; // Sesuaikan path ke apiClient Anda
import { ArrowPathIcon, CloudArrowUpIcon } from "@heroicons/react/24/outline";

function PaymentProofUploadForm({ orderId, onUploadSuccess, onUploadError }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setMessage("");
    setError("");
  };

  const handleSubmitProof = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      setError("Silakan pilih file bukti pembayaran.");
      return;
    }
    setIsUploading(true);
    setMessage("");
    setError("");
    const formData = new FormData();
    formData.append("payment_proof", selectedFile);
    try {
      const response = await apiClient.post(
        `/pesanan/${orderId}/submit-payment-proof`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setMessage(response.data.message || "Bukti pembayaran berhasil dikirim!");
      setSelectedFile(null);
      if (event.target && typeof event.target.reset === "function")
        event.target.reset();
      if (onUploadSuccess) onUploadSuccess(response.data);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Terjadi kesalahan.";
      if (err.response?.data?.errors?.payment_proof) {
        setError(err.response.data.errors.payment_proof.join(", "));
      } else {
        setError(errorMessage);
      }
      if (onUploadError) onUploadError(errorMessage);
      console.error(
        "Error submitting payment proof:",
        err.response?.data || err.message
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <form
        onSubmit={handleSubmitProof}
        className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
      >
        <div className="flex items-center mb-6">
          <div className="p-2 bg-red-50 rounded-lg mr-3">
            <CloudArrowUpIcon className="h-6 w-6 text-atk-primary" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800">
            Unggah Bukti Pembayaran
          </h3>
        </div>

        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-700 mb-1">
            Pesanan ID:{" "}
            <span className="font-semibold text-atk-primary">{orderId}</span>
          </p>
          <p className="text-xs text-gray-500">
            Format: JPG, PNG, GIF (Maks 2MB)
          </p>
        </div>

        <div className="mb-6">
          <label
            htmlFor={`paymentProofFile-${orderId}`}
            className="block text-sm font-medium text-gray-700 mb-3"
          >
            Pilih File Bukti Pembayaran
          </label>
          <input
            type="file"
            id={`paymentProofFile-${orderId}`}
            accept="image/jpeg,image/png,image/gif"
            onChange={handleFileChange}
            required
            className="block w-full text-sm text-gray-500 
                     file:mr-4 file:py-2.5 file:px-4 file:rounded-lg 
                     file:border file:border-red-200 file:bg-red-50 
                     file:text-atk-primary file:text-sm file:font-medium 
                     hover:file:bg-red-100 hover:file:border-red-300
                     disabled:opacity-50 disabled:cursor-not-allowed 
                     transition-all duration-200 cursor-pointer"
            disabled={isUploading}
          />
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="ml-3 text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {message && (
          <div className="mb-6 p-4 bg-green-50 border border-green-100 rounded-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-green-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="ml-3 text-sm text-green-700">{message}</p>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isUploading || !selectedFile}
          className="w-full bg-gradient-to-r from-atk-primary to-atk-secondary 
                   hover:from-atk-secondary hover:to-atk-tertiary
                   text-white font-medium py-3 px-4 rounded-lg 
                   focus:outline-none focus:ring-2 focus:ring-atk-primary focus:ring-offset-2 
                   disabled:opacity-50 disabled:cursor-not-allowed 
                   transition-all duration-200 shadow-sm"
        >
          {isUploading ? (
            <div className="flex items-center justify-center">
              <ArrowPathIcon className="animate-spin h-5 w-5 mr-2" />
              Mengirim Bukti...
            </div>
          ) : (
            "Kirim Bukti Pembayaran"
          )}
        </button>
      </form>
    </div>
  );
}

export default PaymentProofUploadForm;
