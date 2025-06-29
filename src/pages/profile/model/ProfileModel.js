import apiClient from "../../../api/apiClient";

export class ProfileModel {
  constructor() {
    this.userProfile = null;
    this.loading = true;
    this.error = null;
    this.isEditing = false;
    this.updateLoading = false;
    this.updateError = null;
  }

  setUserProfile(userProfile) {
    this.userProfile = userProfile;
  }

  setLoading(loading) {
    this.loading = loading;
  }

  setError(error) {
    this.error = error;
  }

  setIsEditing(isEditing) {
    this.isEditing = isEditing;
  }

  setUpdateLoading(updateLoading) {
    this.updateLoading = updateLoading;
  }

  setUpdateError(updateError) {
    this.updateError = updateError;
  }

  getUserProfile() {
    return this.userProfile;
  }

  getLoading() {
    return this.loading;
  }

  getError() {
    return this.error;
  }

  getIsEditing() {
    return this.isEditing;
  }

  getUpdateLoading() {
    return this.updateLoading;
  }

  getUpdateError() {
    return this.updateError;
  }

  async fetchUserProfile() {
    this.loading = true;
    this.error = null;

    try {
      const response = await apiClient.get("/profile");
      this.userProfile = response.data.data || response.data;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      this.error = "Gagal memuat profil pengguna";
      this.userProfile = null;
    } finally {
      this.loading = false;
    }
  }

  async updateProfile(profileData) {
    this.updateLoading = true;
    this.updateError = null;

    try {
      const response = await apiClient.put("/profile", profileData);
      this.userProfile = response.data.data || response.data;
      this.isEditing = false;
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Error updating profile:", error);
      this.updateError =
        error.response?.data?.message || "Gagal mengupdate profil";
      return { success: false, error: this.updateError };
    } finally {
      this.updateLoading = false;
    }
  }

  async logout() {
    try {
      await apiClient.post("/logout");
      localStorage.removeItem("authToken");
      return { success: true };
    } catch (error) {
      console.error("Error logging out:", error);
      // Even if logout fails, remove token from localStorage
      localStorage.removeItem("authToken");
      return { success: true };
    }
  }

  getInitials(name) {
    if (!name) return "U";
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  formatDate(dateString) {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
}
