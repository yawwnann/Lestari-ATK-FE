import apiClient from "../../../api/apiClient";

export class DetailAtkModel {
  constructor() {
    this.atkDetail = null;
    this.loading = true;
    this.error = null;
    this.quantity = 1;
    this.relatedAtkList = [];
    this.relatedLoading = false;
    this.relatedError = null;
    this.isAddingToCart = false;
    this.addToCartStatus = null;
  }

  setAtkDetail(atkDetail) {
    this.atkDetail = atkDetail;
  }

  setLoading(loading) {
    this.loading = loading;
  }

  setError(error) {
    this.error = error;
  }

  setQuantity(quantity) {
    this.quantity = quantity;
  }

  setRelatedAtkList(relatedAtkList) {
    this.relatedAtkList = relatedAtkList;
  }

  setRelatedLoading(relatedLoading) {
    this.relatedLoading = relatedLoading;
  }

  setRelatedError(relatedError) {
    this.relatedError = relatedError;
  }

  setIsAddingToCart(isAddingToCart) {
    this.isAddingToCart = isAddingToCart;
  }

  setAddToCartStatus(addToCartStatus) {
    this.addToCartStatus = addToCartStatus;
  }

  getAtkDetail() {
    return this.atkDetail;
  }

  getLoading() {
    return this.loading;
  }

  getError() {
    return this.error;
  }

  getQuantity() {
    return this.quantity;
  }

  getRelatedAtkList() {
    return this.relatedAtkList;
  }

  getRelatedLoading() {
    return this.relatedLoading;
  }

  getRelatedError() {
    return this.relatedError;
  }

  getIsAddingToCart() {
    return this.isAddingToCart;
  }

  getAddToCartStatus() {
    return this.addToCartStatus;
  }

  formatRupiah(angka) {
    if (angka === null || angka === undefined) return "Rp -";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(angka);
  }

  async fetchDetailAtk(slug) {
    this.loading = true;
    this.error = null;
    this.atkDetail = null;
    this.relatedAtkList = [];

    try {
      const response = await apiClient.get(`/atk/${slug}`);
      if (response.data && response.data.data) {
        this.atkDetail = response.data.data;
        this.quantity = 1;
      } else {
        this.error = "Data ATK tidak ditemukan atau format tidak sesuai.";
      }
    } catch (err) {
      console.error(`Gagal memuat detail ATK (slug: ${slug}):`, err);
      if (err.response && err.response.status === 404) {
        this.error = "ATK yang Anda cari tidak ditemukan.";
      } else {
        this.error = "Terjadi kesalahan saat memuat detail ATK.";
      }
    } finally {
      this.loading = false;
    }
  }

  async fetchRelatedAtk(categorySlug, currentAtkId) {
    this.relatedLoading = true;
    this.relatedError = null;

    try {
      const response = await apiClient.get(
        `/atk?kategori=${categorySlug}&per_page=4`
      );
      const relatedAtk = response.data.data || [];

      // Filter out current ATK from related list
      this.relatedAtkList = relatedAtk.filter((atk) => atk.id !== currentAtkId);
    } catch (err) {
      console.error("Gagal memuat ATK terkait:", err);
      this.relatedError = "Gagal memuat produk terkait";
      this.relatedAtkList = [];
    } finally {
      this.relatedLoading = false;
    }
  }

  async addToCart(atkId, quantity) {
    this.isAddingToCart = true;
    this.addToCartStatus = null;

    try {
      await apiClient.post("/keranjang", { atk_id: atkId, quantity });
      this.addToCartStatus = {
        type: "success",
        message: "Berhasil ditambahkan ke keranjang!",
      };
      window.dispatchEvent(new CustomEvent("cartUpdated"));
      return { success: true };
    } catch (err) {
      console.error("Gagal menambah ke keranjang:", err);
      let errorMessage = "Gagal menambahkan ke keranjang";

      if (err.response) {
        if (err.response.status === 401 || err.response.status === 403) {
          errorMessage = "Silakan login terlebih dahulu";
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        }
      }

      this.addToCartStatus = { type: "error", message: errorMessage };
      return { success: false, error: errorMessage };
    } finally {
      this.isAddingToCart = false;
    }
  }

  getStatusBadgeColor(statusKetersediaan) {
    return statusKetersediaan?.toLowerCase() === "tersedia"
      ? "bg-emerald-100 text-emerald-800"
      : "bg-rose-100 text-rose-800";
  }

  isProductAvailable() {
    return this.atkDetail?.status_ketersediaan?.toLowerCase() === "tersedia";
  }
}
