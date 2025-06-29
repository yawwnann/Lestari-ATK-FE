import { KeranjangModel } from "../model/KeranjangModel";

export class KeranjangPresenter {
  constructor() {
    this.model = new KeranjangModel();
  }

  async initialize() {
    await this.model.fetchCartItems();
  }

  getCartItems() {
    return this.model.getCartItems();
  }

  getLoading() {
    return this.model.getLoading();
  }

  getError() {
    return this.model.getError();
  }

  isItemUpdating(itemId) {
    return this.model.isItemUpdating(itemId);
  }

  formatRupiah(angka) {
    return this.model.formatRupiah(angka);
  }

  async handleQuantityChange(itemId, newQuantity) {
    if (newQuantity < 1) {
      return { success: false, error: "Jumlah minimal adalah 1" };
    }

    return await this.model.updateQuantity(itemId, newQuantity);
  }

  async handleRemoveItem(itemId) {
    return await this.model.removeItem(itemId);
  }

  calculateSubtotal() {
    return this.model.calculateSubtotal();
  }

  calculateTotal() {
    return this.model.calculateTotal();
  }

  getTotalItems() {
    return this.model.getTotalItems();
  }

  isEmpty() {
    return this.model.isEmpty();
  }

  handleNavigateToCheckout(navigate) {
    if (this.isEmpty()) {
      return { success: false, error: "Keranjang kosong" };
    }
    navigate("/checkout");
    return { success: true };
  }

  handleNavigateToKatalog(navigate) {
    navigate("/katalog");
  }

  handleNavigateToDetail(navigate, atk) {
    navigate(`/atk/${atk?.slug || atk?.id}`);
  }

  getItemTotal(item) {
    return (item.atk?.harga || 0) * item.quantity;
  }
}
