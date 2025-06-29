import { CheckoutModel } from "../model/CheckoutModel";

export class CheckoutPresenter {
  constructor() {
    this.model = new CheckoutModel();
  }

  async initialize() {
    await Promise.all([
      this.model.fetchCartItems(),
      this.model.fetchUserProfile(),
    ]);
  }

  getCartItems() {
    return this.model.getCartItems();
  }

  getUserProfile() {
    return this.model.getUserProfile();
  }

  getLoading() {
    return this.model.getLoading();
  }

  getError() {
    return this.model.getError();
  }

  getSubmitting() {
    return this.model.getSubmitting();
  }

  getSubmitError() {
    return this.model.getSubmitError();
  }

  getOrderData() {
    return this.model.getOrderData();
  }

  formatRupiah(angka) {
    return this.model.formatRupiah(angka);
  }

  setOrderData(orderData) {
    this.model.setOrderData(orderData);
  }

  calculateSubtotal() {
    return this.model.calculateSubtotal();
  }

  calculateShippingCost() {
    return this.model.calculateShippingCost();
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

  async handleSubmitOrder(navigate) {
    if (this.isEmpty()) {
      return { success: false, error: "Keranjang kosong" };
    }

    const result = await this.model.submitOrder();

    if (result.success) {
      // Navigate to payment page or order confirmation
      navigate(`/payment/${result.data.id}`);
    }

    return result;
  }

  handleNavigateToKeranjang(navigate) {
    navigate("/keranjang");
  }

  handleNavigateToKatalog(navigate) {
    navigate("/katalog");
  }

  getPaymentMethods() {
    return [
      { value: "transfer_bank", label: "Transfer Bank" },
      { value: "cod", label: "Cash on Delivery (COD)" },
      { value: "e_wallet", label: "E-Wallet" },
    ];
  }

  getItemTotal(item) {
    return (item.atk?.harga || 0) * item.quantity;
  }

  validateOrderData() {
    return this.model.validateOrderData();
  }
}
