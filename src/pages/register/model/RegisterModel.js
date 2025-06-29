import apiClient from "../../../api/apiClient";

export class RegisterModel {
  constructor() {
    this.name = "";
    this.email = "";
    this.password = "";
    this.passwordConfirmation = "";
    this.agree = false;
    this.error = null;
    this.loading = false;
    this.isSuccessModalOpen = false;
  }

  setName(name) {
    this.name = name;
  }

  setEmail(email) {
    this.email = email;
  }

  setPassword(password) {
    this.password = password;
  }

  setPasswordConfirmation(passwordConfirmation) {
    this.passwordConfirmation = passwordConfirmation;
  }

  setAgree(agree) {
    this.agree = agree;
  }

  setError(error) {
    this.error = error;
  }

  setLoading(loading) {
    this.loading = loading;
  }

  setIsSuccessModalOpen(isOpen) {
    this.isSuccessModalOpen = isOpen;
  }

  getName() {
    return this.name;
  }

  getEmail() {
    return this.email;
  }

  getPassword() {
    return this.password;
  }

  getPasswordConfirmation() {
    return this.passwordConfirmation;
  }

  getAgree() {
    return this.agree;
  }

  getError() {
    return this.error;
  }

  getLoading() {
    return this.loading;
  }

  getIsSuccessModalOpen() {
    return this.isSuccessModalOpen;
  }

  validateForm() {
    if (this.password !== this.passwordConfirmation) {
      return { valid: false, error: "Konfirmasi password tidak cocok." };
    }
    if (this.password.length < 8) {
      return { valid: false, error: "Password minimal harus 8 karakter." };
    }
    if (!this.agree) {
      return {
        valid: false,
        error:
          "Anda harus menyetujui Syarat & Ketentuan serta Kebijakan Privasi.",
      };
    }
    return { valid: true };
  }

  async register() {
    const validation = this.validateForm();
    if (!validation.valid) {
      this.error = validation.error;
      return { success: false, error: this.error };
    }

    this.loading = true;
    this.error = null;

    try {
      const response = await apiClient.post("/register", {
        name: this.name,
        email: this.email,
        password: this.password,
        password_confirmation: this.passwordConfirmation,
      });

      console.log("Registration successful:", response.data);
      this.isSuccessModalOpen = true;
      return { success: true, data: response.data };
    } catch (err) {
      console.error("Registration error:", err.response || err.message);
      if (err.response?.data?.errors) {
        const errorMessages = Object.values(err.response.data.errors)
          .flat()
          .join(" ");
        this.error = `Registrasi gagal: ${errorMessages}`;
      } else {
        this.error =
          err.response?.data?.message || "Registrasi gagal. Silakan coba lagi.";
      }
      return { success: false, error: this.error };
    } finally {
      this.loading = false;
    }
  }
}
