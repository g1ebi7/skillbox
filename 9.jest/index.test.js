import { form } from './src/index.js';

test('Функция создания DOM-дерева должна вернуть DOM-элемент, в котором содержится строго четыре поля для ввода', () => {
  const expected = `<form><input type="text" id="number-input" placeholder="Card number" class=" number-input "><input type="text" id="date-input" placeholder="MM/YYYY" class=" date-input"><input type="text" id="cvv-input" placeholder="Cvv-code" class=" cvv-input"><input type="email" id="email-input" placeholder="Email" class=" email-input"></form>`;

  expect(form().outerHTML).toMatch(expected);
});
