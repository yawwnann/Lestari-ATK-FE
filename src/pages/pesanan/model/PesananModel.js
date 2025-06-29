import apiClient from "../../../api/apiClient";

export class PesananModel {
  constructor() {
    this.pesananList = [];
    this.loading = true;
    this.error = null;
    this.meta = null;
    this.currentPage = 1;
    this.perPage = 10;
  }

  setPesananList(pesananList) {
    this.pesananList = pesananList;
  }

  setLoading(loading) {
    this.loading = loading;
  }

  setError(error) {
    this.error = error;
  }

  setMeta(meta) {
    this.meta = meta;
  }

  setCurrentPage(page) {
    this.currentPage = page;
  }

  getPesananList() {
    return this.pesananList;
  }

  getLoading() {
    return this.loading;
  }

  getError() {
    return this.error;
  }

  getMeta() {
    return this.meta;
  }

  getCurrentPage() {
    return this.currentPage;
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

  async fetchPesananList() {
    this.loading = true;
    this.error = null;

    try {
      const params = new URLSearchParams({
        page: this.currentPage,
        per_page: this.perPage,
      });

      const response = await apiClient.get(`/pesanan?${params}`);
      this.pesananList = response.data.data || [];
      this.meta = response.data.meta || null;
    } catch (error) {
      console.error("Error fetching pesanan list:", error);
      this.error = "Gagal memuat daftar pesanan";
      this.pesananList = [];
    } finally {
      this.loading = false;
    }
  }

  async fetchPesananDetail(pesananId) {
    try {
      const response = await apiClient.get(`/pesanan/${pesananId}`);
      return { success: true, data: response.data.data || response.data };
    } catch (error) {
      console.error("Error fetching pesanan detail:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Gagal memuat detail pesanan",
      };
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
      pending: "Menunggu Konfirmasi",
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

  calculateTotalItems(pesanan) {
    if (!pesanan.items || !Array.isArray(pesanan.items)) return 0;
    return pesanan.items.reduce(
      (total, item) => total + (item.quantity || 0),
      0
    );
  }
}
