import apiClient from "../../../api/apiClient";

export class PaymentModel {
  constructor() {
    this.pesananDetail = null;
    this.loading = true;
    this.error = null;
    this.uploading = false;
    this.uploadError = null;
    this.uploadSuccess = false;
  }

  setPesananDetail(pesananDetail) {
    this.pesananDetail = pesananDetail;
  }

  setLoading(loading) {
    this.loading = loading;
  }

  setError(error) {
    this.error = error;
  }

  setUploading(uploading) {
    this.uploading = uploading;
  }

  setUploadError(uploadError) {
    this.uploadError = uploadError;
  }

  setUploadSuccess(uploadSuccess) {
    this.uploadSuccess = uploadSuccess;
  }

  getPesananDetail() {
    return this.pesananDetail;
  }

  getLoading() {
    return this.loading;
  }

  getError() {
    return this.error;
  }

  getUploading() {
    return this.uploading;
  }

  getUploadError() {
    return this.uploadError;
  }

  getUploadSuccess() {
    return this.uploadSuccess;
  }

  formatRupiah(angka) {
    if (!angka) return "Rp -";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(angka);
  }

  formatDate(dateString) {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  async fetchPesananDetail(pesananId) {
    this.loading = true;
    this.error = null;

    try {
      const response = await apiClient.get(`/pesanan/${pesananId}`);
      this.pesananDetail = response.data.data || response.data;
    } catch (error) {
      console.error("Error fetching pesanan detail:", error);
      this.error = "Gagal memuat detail pesanan";
      this.pesananDetail = null;
    } finally {
      this.loading = false;
    }
  }

  async uploadPaymentProof(pesananId, file) {
    this.uploading = true;
    this.uploadError = null;
    this.uploadSuccess = false;

    try {
      const formData = new FormData();
      formData.append("bukti_pembayaran", file);

      const response = await apiClient.post(
        `/pesanan/${pesananId}/payment-proof`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      this.uploadSuccess = true;
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Error uploading payment proof:", error);
      this.uploadError =
        error.response?.data?.message || "Gagal mengupload bukti pembayaran";
      return { success: false, error: this.uploadError };
    } finally {
      this.uploading = false;
    }
  }

  getStatusBadgeColor(status) {
    const statusColors = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      processing: "bg-purple-100 text-purple-800",
      shipped: "bg-indigo-100 text-indigo-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      completed: "bg-green-100 text-green-800",
    };

    return statusColors[status?.toLowerCase()] || "bg-gray-100 text-gray-800";
  }

  getStatusLabel(status) {
    const statusLabels = {
      pending: "Menunggu Pembayaran",
      confirmed: "Dikonfirmasi",
      processing: "Diproses",
      shipped: "Dikirim",
      delivered: "Diterima",
      cancelled: "Dibatalkan",
      completed: "Selesai",
    };

    return statusLabels[status?.toLowerCase()] || status || "Tidak Diketahui";
  }

  getPaymentMethodLabel(method) {
    const methodLabels = {
      transfer_bank: "Transfer Bank",
      cod: "Cash on Delivery (COD)",
      e_wallet: "E-Wallet",
    };

    return methodLabels[method] || method || "Tidak Diketahui";
  }

  getBankInfo() {
    return {
      bank_name: "Bank Central Asia (BCA)",
      account_number: "1234567890",
      account_name: "LESTARI ATK",
    };
  }

  calculateTotalItems() {
    if (!this.pesananDetail?.items || !Array.isArray(this.pesananDetail.items))
      return 0;
    return this.pesananDetail.items.reduce(
      (total, item) => total + (item.quantity || 0),
      0
    );
  }

  getOrderNumber() {
    return this.pesananDetail?.id
      ? `#${this.pesananDetail.id.toString().padStart(6, "0")}`
      : "N/A";
  }

  canUploadProof() {
    return (
      this.pesananDetail?.status === "pending" &&
      this.pesananDetail?.metode_pembayaran === "transfer_bank"
    );
  }
}
