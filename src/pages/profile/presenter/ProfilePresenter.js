import { ProfileModel } from "../model/ProfileModel";

export class ProfilePresenter {
  constructor() {
    this.model = new ProfileModel();
  }

  async initialize() {
    await this.model.fetchUserProfile();
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

  getIsEditing() {
    return this.model.getIsEditing();
  }

  getUpdateLoading() {
    return this.model.getUpdateLoading();
  }

  getUpdateError() {
    return this.model.getUpdateError();
  }

  handleEditProfile() {
    this.model.setIsEditing(true);
  }

  handleCancelEdit() {
    this.model.setIsEditing(false);
    this.model.setUpdateError(null);
  }

  async handleUpdateProfile(profileData) {
    return await this.model.updateProfile(profileData);
  }

  async handleLogout(navigate) {
    const result = await this.model.logout();
    if (result.success) {
      navigate("/login");
    }
    return result;
  }

  getInitials(name) {
    return this.model.getInitials(name);
  }

  formatDate(dateString) {
    return this.model.formatDate(dateString);
  }

  handleNavigateToDashboard(navigate) {
    navigate("/dashboard");
  }

  handleNavigateToKatalog(navigate) {
    navigate("/katalog");
  }

  handleNavigateToPesanan(navigate) {
    navigate("/pesanan");
  }

  validateProfileData(data) {
    const errors = {};

    if (!data.name || data.name.trim().length < 2) {
      errors.name = "Nama minimal 2 karakter";
    }

    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = "Email tidak valid";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }
}
