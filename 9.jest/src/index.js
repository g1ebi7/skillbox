import './main.css';
import { el, mount } from 'redom';
import * as EmailValidator from 'email-validator';
import IMask from 'imask';
import {
  isValid,
  isExpirationDateValid,
  isSecurityCodeValid,
  getCreditCardNameByNumber,
} from 'creditcard.js';

//Создаю wrapper для контента

export const form = () => {
  return el('form', [
    el('input', {
      type: 'text',
      id: 'number-input',
      placeholder: 'Card number',
      class: 'number-input ',
    }),
    el('input', {
      type: 'text',
      id: 'date-input',
      placeholder: 'MM/YYYY',
      class: 'date-input',
    }),
    el('input', {
      type: 'text',
      id: 'cvv-input',
      placeholder: 'Cvv-code',
      class: 'cvv-input',
    }),
    el('input', {
      type: 'email',
      id: 'email-input',
      placeholder: 'Email',
      class: 'email-input',
    }),
  ]);
};

const wrapper = el(
  'div',
  { class: 'form-wrapper' },
  form(),

  el(
    'div',
    { class: 'card-name-wrapper' },
    el('p', { class: 'card-name-text' }, 'Payment card service:'),

    el('img', { class: 'img-wrapper hidden' })
  ),
  el('button', { class: 'pay-btn', disabled: true }, 'Pay'),

  el('p', { id: 'error-text' }, '')
);

mount(document.body, wrapper);

//Добавляю маски для инпута

IMask(document.getElementById('number-input'), { mask: '0000 0000 0000 0000', lazy: false });

IMask(document.getElementById('date-input'), { mask: '00/0000', lazy: false });

IMask(document.getElementById('cvv-input'), { mask: '000', lazy: false });

//Создаю объект для проверки состояния инпутов

const formCheck = {};

const inputs = document.querySelectorAll('input');

inputs.forEach((input) => {
  //По событию blur проверяем какой инпут, правильно ли написан и выкидываем ошибку если неправильно
  input.addEventListener('blur', () => {
    let cardNumber;

    if (input.id === 'number-input') {
      document.querySelector('.img-wrapper').classList.add('hidden');
      formCheck.number = false;

      const check = input.value.replaceAll(' ', '');

      if (!isValid(check)) {
        errorTextAction(input, 'Card number is not valid');
      } else {
        formCheck.number = true;
        cardNumber = check;
        creditCardName(cardNumber);
      }
    }
    if (input.id === 'date-input') {
      formCheck.date = false;

      const check = input.value.split('/');

      if (!isExpirationDateValid(check[0], check[1])) {
        errorTextAction(input, 'Date is not valid');
      } else {
        formCheck.date = true;
      }
    }
    if (input.id === 'cvv-input') {
      formCheck.cvv = false;
      if (!isSecurityCodeValid(cardNumber, input.value)) {
        errorTextAction(input, 'Cvv is not valid');
      } else {
        formCheck.cvv = true;
      }
    }
    if (input.id === 'email-input') {
      formCheck.email = false;
      if (!EmailValidator.validate(input.value)) {
        errorTextAction(input, 'Email is not valid');
      } else {
        formCheck.email = true;
      }
    }
    checkCreditCard();
  });
  input.addEventListener('input', () => {
    document.querySelector('.pay-btn').disabled = true;
  });
});

//Функция добавки текста с ошибкой в контейнер

function errorTextAction(input, error) {
  const errorText = document.getElementById('error-text');
  if (!errorText.innerHTML.includes(`<p>${error}</p>`)) {
    errorText.innerHTML = errorText.innerHTML + `<p>${error}</p>`;
  }

  input.addEventListener('input', () => {
    errorText.innerHTML = errorText.innerHTML.replace(`<p>${error}</p>`, '');
  });
}

//Проверяем объект formCheck и если все инпуты правильные, включаем кнопку

function checkCreditCard() {
  if (formCheck.number && formCheck.date && formCheck.cvv && formCheck.email)
    document.querySelector('.pay-btn').disabled = false;
}

//Функция подключения картинки платежной системы, сделал пока что только Visa и Mastercard)

async function creditCardName(num) {
  const img = document.querySelector('.img-wrapper');
  const name = getCreditCardNameByNumber(num);

  img.classList.remove('hidden');
  if (name === 'Visa') {
    const visa = await import('./images/visa.png');

    img.src = visa.default;
  }

  if (name === 'Mastercard') {
    const mastercard = await import('./images/mastercard.png');

    img.src = mastercard.default;
  }
}
