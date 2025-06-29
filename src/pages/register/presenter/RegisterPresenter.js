import { RegisterModel } from "../model/RegisterModel";

export class RegisterPresenter {
  constructor() {
    this.model = new RegisterModel();
  }

  setName(name) {
    this.model.setName(name);
  }

  setEmail(email) {
    this.model.setEmail(email);
  }

  setPassword(password) {
    this.model.setPassword(password);
  }

  setPasswordConfirmation(passwordConfirmation) {
    this.model.setPasswordConfirmation(passwordConfirmation);
  }

  setAgree(agree) {
    this.model.setAgree(agree);
  }

  getName() {
    return this.model.getName();
  }

  getEmail() {
    return this.model.getEmail();
  }

  getPassword() {
    return this.model.getPassword();
  }

  getPasswordConfirmation() {
    return this.model.getPasswordConfirmation();
  }

  getAgree() {
    return this.model.getAgree();
  }

  getError() {
    return this.model.getError();
  }

  getLoading() {
    return this.model.getLoading();
  }

  getIsSuccessModalOpen() {
    return this.model.getIsSuccessModalOpen();
  }

  async handleRegister() {
    return await this.model.register();
  }

  closeModalAndNavigate(navigate) {
    this.model.setIsSuccessModalOpen(false);
    navigate("/login");
  }

  handleNavigateToLogin(navigate) {
    navigate("/login");
  }
}
