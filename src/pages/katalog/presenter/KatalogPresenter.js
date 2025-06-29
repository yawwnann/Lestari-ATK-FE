import { KatalogModel } from "../model/KatalogModel";

export class KatalogPresenter {
  constructor() {
    this.model = new KatalogModel();
  }

  async initialize() {
    await Promise.all([
      this.model.fetchAtkList(),
      this.model.fetchKategoriList(),
    ]);
  }

  getAtkList() {
    return this.model.getAtkList();
  }

  getKategoriList() {
    return this.model.getKategoriList();
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

  getFilters() {
    return this.model.getFilters();
  }

  getCurrentPage() {
    return this.model.getCurrentPage();
  }

  formatRupiah(angka) {
    return this.model.formatRupiah(angka);
  }

  async handleFilterOrSortChange(type, value) {
    this.model.setFilters({ [type]: value });
    this.model.setCurrentPage(1);
    await this.model.fetchAtkList();
  }

  async handlePageChange(page) {
    this.model.setCurrentPage(page);
    await this.model.fetchAtkList();
  }

  async resetAllFilters() {
    this.model.setFilters({
      search: "",
      kategori: "",
      sort: "latest",
      minPrice: "",
      maxPrice: "",
    });
    this.model.setCurrentPage(1);
    await this.model.fetchAtkList();
  }

  async handleAddToCart(atkId, quantity = 1) {
    const result = await this.model.addToCart(atkId, quantity);
    if (result.success) {
      window.dispatchEvent(new CustomEvent("cartUpdated"));
    }
    return result;
  }

  handleNavigateToDetail(navigate, atk) {
    navigate(`/atk/${atk?.slug || atk?.id}`);
  }

  getStatusBadgeColor(statusKetersediaan) {
    const isTersedia = statusKetersediaan?.toLowerCase() === "tersedia";
    return isTersedia
      ? "bg-emerald-500/15 text-emerald-700 ring-1 ring-inset ring-emerald-600/30"
      : "bg-rose-500/15 text-rose-700 ring-1 ring-inset ring-rose-600/30";
  }

  isProductAvailable(atk) {
    return atk?.status_ketersediaan?.toLowerCase() === "tersedia";
  }
}
