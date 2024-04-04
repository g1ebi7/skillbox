export default class Card {
  //Делаем значения по дефолту false
  _open = false;
  _success = false;

  //закидваем элементы
  constructor(container, number, action) {
    this.number = number;

    container.append(this.createElement());

    this.card.addEventListener("click", () => {
      if (this.open === false && this.success === false) {
        this.open = true;
        action(this);
      }
    });
  }

  createElement() {
    this.card = document.createElement("div");
    this.card.classList.add("game-card");

    const cardsImgArray = [
      "/img/1.webp",
      "/img/2.webp",
      "/img/3.webp",
      "/img/4.webp",
      "/img/5.webp",
      "/img/6.webp",
      "/img/7.webp",
      "/img/8.webp",
      "/img/9.webp",
    ];
    const img = document.createElement("img");
    img.src = cardsImgArray[this.number - 1];

    img.onerror = function () {
      img.src = "/img/error.avif";
    };

    this.card.append(img);

    return this.card;
  }

  set open(value) {
    this._open = value;
    value ? this.card.classList.add("open") : this.card.classList.remove("open");
  }

  get open() {
    return this._open;
  }

  set success(value) {
    this._success = value;
    value ? this.card.classList.add("success") : this.card.classList.add("success");
  }

  get success() {
    return this._open;
  }
}
