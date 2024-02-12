//По клику на страницу запускаю функцию открытия и закрытия модалки
document.addEventListener("click", modal);

//ну тут все понятно
function modal(event) {
  const btn = document.querySelector(".modal-btn");
  const modal = document.querySelector(".modal");
  const body = document.querySelector("body");

  if (event.target.classList.contains("modal")) {
    return;
  } else if (event.target.classList.contains("modal-btn")) {
    modal.classList.add("open");
    body.classList.add("black");
    event.target.classList.add("hidden");
  } else {
    modal.classList.remove("open");
    body.classList.remove("black");
    btn.classList.remove("hidden");
  }
}

//Нахожу все инпуты на страницы и создаю для каждого инпута свои валидации и действия
const inputs = document.querySelectorAll("input");

inputs.forEach((input) => {
  // При нажатии клавиши вниз, провожу проверку, если элементы проходят валидацию check. Если нет, то символ в инпуте не появится
  // ВНИМАНИЕ! Проблема с event.key = "Dead" так и не решена
  input.addEventListener("keydown", (event) => {
    //Создаю большой regexp, который ищет независимо от регистра (i) букву кирриллицы, пробел, тире или управляющие кнопки
    const check = /[а-я]|\s|\-|Backspace|ArrowLeft|ArrowRight|Tab|Enter/i;

    if (check.test(event.key) !== true) {
      event.preventDefault();
    }
  });

  //При событии "blur", то есть потери фокуса у инпута, начинаю проверять инпут на правильность содержимого
  input.addEventListener("blur", () => {
    //Проверяем, чтобы у инпута было какое то значение
    if (input.value != "") {
      //Находим массив классов у инпута
      const classArr = input.classList;
      //Меняю value у инпута
      input.value = checkInputValue(classArr[0]);
    }
  });
});

//Нахожу форму
const form = document.querySelector(".form");

//Делаем действие после отправки вормы
form.addEventListener("submit", (event) => {
  //Предотвращаем перезагрузку страницы
  event.preventDefault();

  // Проверяем, чтобы у каждого инпута было хоть какое то значение
  if ((inputs[0].value && inputs[1].value && inputs[2].value) != "") {
    //Еще раз перепроверяем каждый инпут и находим отфильтрованные значения инпута
    const name = checkInputValue("name-input");
    const surname = checkInputValue("surname-input");
    const secondName = checkInputValue("secondname-input");

    //очищаем строки инпута от их старых данных
    inputs.forEach((input) => {
      input.value = "";
    });

    // Находим контейнер для данных клиентов
    const clientInfoWrapper = document.querySelector(".client-info-wrapper");

    // Создаем параграф и загружаем в него данные клиента
    const clientInfo = document.createElement("paragraph");
    clientInfo.classList.add("client-info");
    clientInfo.innerHTML = `Имя: ${name} <br> Фамилия: ${surname} <br> Отчество: ${secondName}`;

    // Закидываем параграф в общий контейнер
    clientInfoWrapper.append(clientInfo);
  }
});

// Делаем функцию, проверяющую инпут по его классу и возвращающая отфильтрованное значение для инпута
function checkInputValue(className) {
  //Находим инпут по классу, который передасться через аргумент функции
  const inputToCheck = document.querySelector(`.${className}`);

  //делаю regexp для всех (g) букв кириллицы независимо от регистар (i), также нахожу пробелы и тире
  const inputCheck = /[а-я]|\s|\-/gi;

  //нахожу все тире, повторяющиеся больше одного раза
  const dashCheck = /-{2,}/g;

  //нахожу все пробелы, повторяющиеся больше одного раза
  const gapCheck = /\s{2,}/g;

  //Создаю переменную со значением инпута, который мы хотим проверить
  let inputValue = inputToCheck.value;

  //нахожу все элементы, которые проходят валидацию inputCheck и создаю массив
  let checkVal = inputValue.match(inputCheck);

  //Проверяю, были ли совпадения с inputCheck
  if (checkVal !== null) {
    //Запоминаю длину массива checkVal, так как его длина будет постоянно уменьшаться
    const length = checkVal.length;

    //Проверяю каждый первый и каждый последний элемент массива на пробел и тире
    for (let i = 0; i < length; i++) {
      if (checkVal[0] == " " || checkVal[0] == "-") {
        checkVal.shift();
      } else if (
        checkVal[checkVal.length - 1] == " " ||
        checkVal[checkVal.length - 1] == "-"
      ) {
        checkVal.pop();
      }
    }

    // Собираю строку из массива
    inputValue = checkVal.join("");

    // Проверяю, есть ли в строке больше чем один пробел или дефис подряд и заменяю их на один пробел/дефис
    if (dashCheck.test(inputValue)) {
      console.log("Working");
      inputValue = inputValue.replace(dashCheck, "-");
    }
    if (gapCheck.test(inputValue)) {
      inputValue = inputValue.replace(gapCheck, " ");
    }

    //Делаю первую буквы заглавной и последние привожу в нижний регистр
    //Нет смысла искать именно первую букву, так как проходит валидация выше и вначале строки всегда будут только буквы
    inputValue =
      inputValue[0].toUpperCase() + inputValue.slice(1).toLowerCase();

    return inputValue;
  } else {
    //Возвращаем пустую строку если чтото не так
    return "";
  }
}

//Нахожу кнопку прокрутки
const scrollBtn = document.querySelector(".scroll-btn");

//Создаю пассивный обработчик события scroll для window
//Пассивный для того чтобы он не реагировал на preventdefault и прокрутка была плавной
window.addEventListener(
  "scroll",
  () => {
    //Как только высота пользователя превышает 100px, появляется кнопка
    if (window.scrollY >= 100) {
      scrollBtn.classList.add("visible");
    } else {
      scrollBtn.classList.remove("visible");
    }
  },
  { passive: true }
);

//делаем по клику на кнопку плавное прокручивание страницы в самых вверх
scrollBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
