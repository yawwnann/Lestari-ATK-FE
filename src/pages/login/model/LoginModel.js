import apiClient from "../../../api/apiClient";

export class LoginModel {
  constructor() {
    this.email = "";
    this.password = "";
    this.loading = false;
    this.error = null;
  }

  setEmail(email) {
    this.email = email;
  }

  setPassword(password) {
    this.password = password;
  }

  setLoading(loading) {
    this.loading = loading;
  }

  setError(error) {
    this.error = error;
  }

  getEmail() {
    return this.email;
  }

  getPassword() {
    return this.password;
  }

  getLoading() {
    return this.loading;
  }

  getError() {
    return this.error;
  }

  async login() {
    this.loading = true;
    this.error = null;

    try {
      const response = await apiClient.post("/login", {
        email: this.email,
        password: this.password,
      });

      localStorage.setItem("authToken", response.data.access_token);
      return { success: true, data: response.data };
    } catch (err) {
      this.error =
        err.response?.data?.message ||
        "Login gagal. Periksa email dan password Anda.";
      return { success: false, error: this.error };
    } finally {
      this.loading = false;
    }
  }
}
