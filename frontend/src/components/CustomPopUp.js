export default class CustomPopUp {
  constructor(popupWrapper, popupToggler) {
    this.popUpWrapper = document.querySelector(popupWrapper);
    this.popUpToggler = document.querySelector(popupToggler);

    this.init();
  }

  init() {
    this.popUpToggler.addEventListener("click", () => {
      this.popUpWrapper.classList.remove("block");
    });
  }

  showPopUp() {
    this.popUpWrapper.classList.add("block");
  }

  setPopUpField(selector, value) {
    document.querySelector(selector).innerHTML = value;
  }
}
