import apiClient from "../../../api/apiClient";

export class DashboardModel {
  constructor() {
    this.atkList = [];
    this.loading = true;
  }

  async fetchAtkList() {
    this.loading = true;
    try {
      const response = await apiClient.get("/atk?page=1&per_page=4");
      this.atkList = response.data.data || [];
    } catch (error) {
      this.atkList = [];
      console.error("Error fetching ATK list:", error);
    } finally {
      this.loading = false;
    }
  }

  getAtkList() {
    return this.atkList;
  }

  getLoading() {
    return this.loading;
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
}
