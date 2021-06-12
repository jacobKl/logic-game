export default class CustomPopUp {
  constructor(popupWrapper, popupToggler) {
    this.popupWrapper = document.querySelector(popupWrapper);
    this.popupToggler = document.querySelector(popupToggler);
    this.init();
  }

  init() {
    this.popupToggler.addEventListener("click", () => {
      this.popupWrapper.classList.remove("block");
    });
  }

  showPopUp() {
    this.popupWrapper.classList.add("block");
  }

  setPopUpField(selector, value) {
    document.querySelector(selector).innerHTML = value;
  }
}
