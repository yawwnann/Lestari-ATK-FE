import { DetailAtkModel } from "../model/DetailAtkModel";

export class DetailAtkPresenter {
  constructor() {
    this.model = new DetailAtkModel();
  }

  async initialize(slug) {
    await this.model.fetchDetailAtk(slug);

    // Fetch related ATK if we have category info
    const atkDetail = this.model.getAtkDetail();
    if (atkDetail?.kategori?.slug && atkDetail?.id) {
      await this.model.fetchRelatedAtk(atkDetail.kategori.slug, atkDetail.id);
    }
  }

  getAtkDetail() {
    return this.model.getAtkDetail();
  }

  getLoading() {
    return this.model.getLoading();
  }

  getError() {
    return this.model.getError();
  }

  getQuantity() {
    return this.model.getQuantity();
  }

  getRelatedAtkList() {
    return this.model.getRelatedAtkList();
  }

  getRelatedLoading() {
    return this.model.getRelatedLoading();
  }

  getRelatedError() {
    return this.model.getRelatedError();
  }

  getIsAddingToCart() {
    return this.model.getIsAddingToCart();
  }

  getAddToCartStatus() {
    return this.model.getAddToCartStatus();
  }

  formatRupiah(angka) {
    return this.model.formatRupiah(angka);
  }

  handleQuantityChange(amount) {
    const currentQuantity = this.model.getQuantity();
    const newQuantity = Math.max(1, currentQuantity + amount);
    this.model.setQuantity(newQuantity);
  }

  async handleAddToCart() {
    const atkDetail = this.model.getAtkDetail();
    const quantity = this.model.getQuantity();

    if (!atkDetail || !this.model.isProductAvailable()) {
      return { success: false, error: "Produk tidak tersedia" };
    }

    return await this.model.addToCart(atkDetail.id, quantity);
  }

  handleNavigateToDetail(navigate, atk) {
    navigate(`/atk/${atk?.slug || atk?.id}`);
  }

  getStatusBadgeColor(statusKetersediaan) {
    return this.model.getStatusBadgeColor(statusKetersediaan);
  }

  isProductAvailable() {
    return this.model.isProductAvailable();
  }

  getButtonContent() {
    const isAddingToCart = this.model.getIsAddingToCart();
    const isAvailable = this.model.isProductAvailable();

    if (isAddingToCart) {
      return { text: "Menambahkan...", disabled: true };
    }

    if (!isAvailable) {
      return { text: "Stok Habis", disabled: true };
    }

    return { text: "Tambah ke Keranjang", disabled: false };
  }
}
