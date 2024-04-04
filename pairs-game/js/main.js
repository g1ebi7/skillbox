import Card from "./card.js";
import TimerDisplay from "./timer.js";

//TODOLIST

//работа над ошибками, проверка инпута,

const gameContainer = document.getElementById("game");
const formWrapper = document.querySelector(".form-wrapper");
const timerContainer = document.querySelector(".timer-container");
const errorText = document.querySelector(".error-container");
let successCheckArray = [];
let cardsNumberArray = [];
let cardsArray = [];
let firstCard = null;
let secondCard = null;

const timer = new TimerDisplay(30, timerContainer, function () {
  cardsArray.forEach((card) => {
    console.log(card);
    card._open = true;
    card.card.classList.add("open");
  });

  restartgame(".error-container", "Game over");
});

function formAction() {
  const form = document.createElement("form");
  const input = document.createElement("input");
  const btn = document.createElement("button");

  input.type = "number";
  input.placeholder = "How many pairs of cards";
  btn.textContent = "Play";

  form.append(input, btn);
  formWrapper.append(form);

  input.addEventListener("input", () => {
    errorText.textContent = "";
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (input.value == "" || input.value == 0 || input.value > 9) {
      errorText.textContent = "Value should be a number and between 1 and 9";
      return;
    }

    formWrapper.innerHTML = "";
    createGame(gameContainer, input.value);
  });
}

formAction();

function createGame(container, cardsCount) {
  //Создаем массив чисел
  for (let i = 1; i <= cardsCount; i++) {
    cardsNumberArray.push(i, i);
  }

  //Сортируем массив чисел
  cardsNumberArray = cardsNumberArray.sort(() => Math.random() - 0.5);

  //Создаем DOM-карточки используя класс
  for (const cardNumber of cardsNumberArray) {
    cardsArray.push(new Card(container, cardNumber, onCardClick));
  }

  timer.element.textContent = "Seconds left: 30";
  timer.start();
}

//Создаем функцию клика на карточку
function onCardClick(card) {
  //Проверяем карточки
  if (firstCard !== null && secondCard !== null) {
    if (firstCard.number !== secondCard.number) {
      firstCard.open = false;
      secondCard.open = false;

      firstCard = null;
      secondCard = null;
    }
  }

  //Присваиваем карточкам значения, переданные в класс
  if (!firstCard) {
    firstCard = card;
  } else {
    if (!secondCard) {
      secondCard = card;
    }
  }

  //Когда две карты открыты, проверяем на совпадение карточек
  if (firstCard !== null && secondCard !== null) {
    if (firstCard.number === secondCard.number) {
      firstCard.success = true;
      secondCard.success = true;

      successCheckArray.push(firstCard, secondCard);

      firstCard = null;
      secondCard = null;
    }
  }

  if (successCheckArray.length === cardsArray.length) {
    console.log(timer);
    setTimeout(() => {
      timer.pause();

      restartgame(".info-container", "Congratulations, you won!");
    }, 300);
  }
}

function restartgame(container, message) {
  const infoContainer = document.querySelector(container);
  const infoText = document.createElement("p");
  const restartBtn = document.createElement("button");

  infoText.textContent = message;
  restartBtn.textContent = "Restart";

  infoContainer.append(infoText, restartBtn);

  restartBtn.addEventListener("click", () => {
    successCheckArray = [];
    cardsNumberArray = [];
    cardsArray = [];

    infoContainer.innerHTML = "";
    gameContainer.innerHTML = "";

    formAction();
  });
}
