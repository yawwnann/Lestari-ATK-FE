import apiClient from "../../../api/apiClient";

export class KatalogModel {
  constructor() {
    this.atkList = [];
    this.kategoriList = [];
    this.loading = true;
    this.error = null;
    this.meta = null;
    this.filters = {
      search: "",
      kategori: "",
      sort: "latest",
      minPrice: "",
      maxPrice: "",
    };
    this.currentPage = 1;
    this.perPage = 12;
  }

  setAtkList(atkList) {
    this.atkList = atkList;
  }

  setKategoriList(kategoriList) {
    this.kategoriList = kategoriList;
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

  setFilters(filters) {
    this.filters = { ...this.filters, ...filters };
  }

  setCurrentPage(page) {
    this.currentPage = page;
  }

  getAtkList() {
    return this.atkList;
  }

  getKategoriList() {
    return this.kategoriList;
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

  getFilters() {
    return this.filters;
  }

  getCurrentPage() {
    return this.currentPage;
  }

  formatRupiah(angka) {
    const number = typeof angka === "string" ? parseInt(angka, 10) : angka;
    if (isNaN(number) || number === null || number === undefined) return "Rp -";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(number);
  }

  async fetchAtkList() {
    this.loading = true;
    this.error = null;

    try {
      const params = new URLSearchParams({
        page: this.currentPage,
        per_page: this.perPage,
        ...this.filters,
      });

      const response = await apiClient.get(`/atk?${params}`);
      this.atkList = response.data.data || [];
      this.meta = response.data.meta || null;
    } catch (error) {
      console.error("Error fetching ATK list:", error);
      this.error = "Gagal memuat data produk";
      this.atkList = [];
    } finally {
      this.loading = false;
    }
  }

  async fetchKategoriList() {
    try {
      const response = await apiClient.get("/kategori");
      this.kategoriList = response.data.data || [];
    } catch (error) {
      console.error("Error fetching kategori list:", error);
      this.kategoriList = [];
    }
  }

  async addToCart(atkId, quantity = 1) {
    try {
      await apiClient.post("/keranjang", { atk_id: atkId, quantity });
      return { success: true };
    } catch (error) {
      console.error("Error adding to cart:", error);
      return {
        success: false,
        error:
          error.response?.data?.message || "Gagal menambahkan ke keranjang",
      };
    }
  }
}
