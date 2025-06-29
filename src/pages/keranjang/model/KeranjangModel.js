import apiClient from "../../../api/apiClient";

export class KeranjangModel {
  constructor() {
    this.cartItems = [];
    this.loading = true;
    this.error = null;
    this.updatingItems = new Set();
  }

  setCartItems(cartItems) {
    this.cartItems = cartItems;
  }

  setLoading(loading) {
    this.loading = loading;
  }

  setError(error) {
    this.error = error;
  }

  addUpdatingItem(itemId) {
    this.updatingItems.add(itemId);
  }

  removeUpdatingItem(itemId) {
    this.updatingItems.delete(itemId);
  }

  getCartItems() {
    return this.cartItems;
  }

  getLoading() {
    return this.loading;
  }

  getError() {
    return this.error;
  }

  isItemUpdating(itemId) {
    return this.updatingItems.has(itemId);
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

  async fetchCartItems() {
    this.loading = true;
    this.error = null;

    try {
      const response = await apiClient.get("/keranjang");
      this.cartItems = response.data.data || [];
    } catch (error) {
      console.error("Error fetching cart items:", error);
      this.error = "Gagal memuat keranjang";
      this.cartItems = [];
    } finally {
      this.loading = false;
    }
  }

  async updateQuantity(itemId, quantity) {
    this.addUpdatingItem(itemId);

    try {
      await apiClient.put(`/keranjang/${itemId}`, { quantity });
      await this.fetchCartItems(); // Refresh cart data
      return { success: true };
    } catch (error) {
      console.error("Error updating quantity:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Gagal mengupdate jumlah",
      };
    } finally {
      this.removeUpdatingItem(itemId);
    }
  }

  async removeItem(itemId) {
    this.addUpdatingItem(itemId);

    try {
      await apiClient.delete(`/keranjang/${itemId}`);
      await this.fetchCartItems(); // Refresh cart data
      return { success: true };
    } catch (error) {
      console.error("Error removing item:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Gagal menghapus item",
      };
    } finally {
      this.removeUpdatingItem(itemId);
    }
  }

  calculateSubtotal() {
    return this.cartItems.reduce((total, item) => {
      return total + (item.atk?.harga || 0) * item.quantity;
    }, 0);
  }

  calculateTotal() {
    return this.calculateSubtotal();
  }

  getTotalItems() {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  isEmpty() {
    return this.cartItems.length === 0;
  }
}
