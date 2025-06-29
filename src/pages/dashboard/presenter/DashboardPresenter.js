import { DashboardModel } from "../model/DashboardModel";

export class DashboardPresenter {
  constructor() {
    this.model = new DashboardModel();
  }

  async initialize() {
    await this.model.fetchAtkList();
  }

  getAtkList() {
    return this.model.getAtkList();
  }

  getLoading() {
    return this.model.getLoading();
  }

  formatRupiah(angka) {
    return this.model.formatRupiah(angka);
  }

  handleNavigateToKatalog(navigate) {
    navigate("/katalog");
  }

  handleNavigateToAtkDetail(navigate, atk) {
    navigate(`/atk/${atk.slug || atk.id}`);
  }

  handleScrollToPromo() {
    window.scrollTo({ top: 800, behavior: "smooth" });
  }

  handleViewPromo(navigate) {
    navigate("/katalog");
  }
}
