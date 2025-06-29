import { PesananModel } from "../model/PesananModel";

export class PesananPresenter {
  constructor() {
    this.model = new PesananModel();
  }

  async initialize() {
    await this.model.fetchPesananList();
  }

  getPesananList() {
    return this.model.getPesananList();
  }

  getLoading() {
    return this.model.getLoading();
  }

  getError() {
    return this.model.getError();
  }

  getMeta() {
    return this.model.getMeta();
  }

  getCurrentPage() {
    return this.model.getCurrentPage();
  }

  formatRupiah(angka) {
    return this.model.formatRupiah(angka);
  }

  formatDate(dateString) {
    return this.model.formatDate(dateString);
  }

  async handlePageChange(page) {
    this.model.setCurrentPage(page);
    await this.model.fetchPesananList();
  }

  async handleRefresh() {
    await this.model.fetchPesananList();
  }

  async handleViewDetail(pesananId) {
    return await this.model.fetchPesananDetail(pesananId);
  }

  handleNavigateToDetail(navigate, pesananId) {
    navigate(`/pesanan/${pesananId}`);
  }

  handleNavigateToDashboard(navigate) {
    navigate("/dashboard");
  }

  handleNavigateToKatalog(navigate) {
    navigate("/katalog");
  }

  getStatusBadgeColor(status) {
    return this.model.getStatusBadgeColor(status);
  }

  getStatusLabel(status) {
    return this.model.getStatusLabel(status);
  }

  getPaymentMethodLabel(method) {
    return this.model.getPaymentMethodLabel(method);
  }

  calculateTotalItems(pesanan) {
    return this.model.calculateTotalItems(pesanan);
  }

  isEmpty() {
    return this.model.getPesananList().length === 0;
  }

  getOrderNumber(pesanan) {
    return pesanan.id ? `#${pesanan.id.toString().padStart(6, "0")}` : "N/A";
  }
}
