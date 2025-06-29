import { LoginModel } from "../model/LoginModel";

export class LoginPresenter {
  constructor() {
    this.model = new LoginModel();
  }

  setEmail(email) {
    this.model.setEmail(email);
  }

  setPassword(password) {
    this.model.setPassword(password);
  }

  getEmail() {
    return this.model.getEmail();
  }

  getPassword() {
    return this.model.getPassword();
  }

  getLoading() {
    return this.model.getLoading();
  }

  getError() {
    return this.model.getError();
  }

  async handleLogin(navigate) {
    const result = await this.model.login();

    if (result.success) {
      navigate("/dashboard");
    }

    return result;
  }

  handleGoogleLogin() {
    // Implementasi login Google jika diperlukan
    console.log("Google login clicked");
  }

  handleNavigateToRegister(navigate) {
    navigate("/register");
  }

  handleNavigateToForgotPassword(navigate) {
    navigate("/forgot-password");
  }
}
