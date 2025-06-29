import { PaymentModel } from "../model/PaymentModel";

export class PaymentPresenter {
  constructor() {
    this.model = new PaymentModel();
  }

  async initialize(pesananId) {
    await this.model.fetchPesananDetail(pesananId);
  }

  getPesananDetail() {
    return this.model.getPesananDetail();
  }

  getLoading() {
    return this.model.getLoading();
  }

  getError() {
    return this.model.getError();
  }

  getUploading() {
    return this.model.getUploading();
  }

  getUploadError() {
    return this.model.getUploadError();
  }

  getUploadSuccess() {
    return this.model.getUploadSuccess();
  }

  formatRupiah(angka) {
    return this.model.formatRupiah(angka);
  }

  formatDate(dateString) {
    return this.model.formatDate(dateString);
  }

  async handleUploadPaymentProof(file) {
    const pesananDetail = this.model.getPesananDetail();
    if (!pesananDetail?.id) {
      return { success: false, error: "ID pesanan tidak ditemukan" };
    }

    return await this.model.uploadPaymentProof(pesananDetail.id, file);
  }

  handleNavigateToPesanan(navigate) {
    navigate("/pesanan");
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

  getBankInfo() {
    return this.model.getBankInfo();
  }

  calculateTotalItems() {
    return this.model.calculateTotalItems();
  }

  getOrderNumber() {
    return this.model.getOrderNumber();
  }

  canUploadProof() {
    return this.model.canUploadProof();
  }

  validateFile(file) {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    if (!file) {
      return { valid: false, error: "File tidak dipilih" };
    }

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: "Format file tidak didukung. Gunakan JPG, PNG, atau WebP",
      };
    }

    if (file.size > maxSize) {
      return { valid: false, error: "Ukuran file terlalu besar. Maksimal 5MB" };
    }

    return { valid: true };
  }

  getPaymentInstructions() {
    const pesananDetail = this.model.getPesananDetail();
    const bankInfo = this.model.getBankInfo();

    if (pesananDetail?.metode_pembayaran === "transfer_bank") {
      return {
        title: "Instruksi Pembayaran",
        steps: [
          `Transfer ke rekening ${bankInfo.bank_name}`,
          `Nomor Rekening: ${bankInfo.account_number}`,
          `Atas Nama: ${bankInfo.account_name}`,
          `Jumlah: ${this.formatRupiah(pesananDetail?.total_amount)}`,
          "Upload bukti transfer setelah pembayaran",
        ],
      };
    }

    return {
      title: "Instruksi Pembayaran",
      steps: ["Pembayaran dilakukan saat pengiriman"],
    };
  }
}
