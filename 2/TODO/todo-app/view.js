//Короче я нихера ниче не понимаю так что буду разбирать этот код строчка за строчкой
//Создаем и возращаем заголовок приложения
function createAppTitle(title) {
  const appTitle = document.createElement("h2");
  appTitle.innerHTML = title;
  return appTitle;
}

//Создаем и возращаем форму для создания дела
function createTodoItemForm() {
  const form = document.createElement("form");
  const input = document.createElement("input");
  const buttonWrapper = document.createElement("div");
  const button = document.createElement("button");

  form.classList.add("input-group", "mb-3");
  input.classList.add("form-control");
  input.placeholder = "Write a new task";
  buttonWrapper.classList.add("input-group-append");
  button.classList.add("btn", "btn-primary");
  button.textContent = "Add";

  buttonWrapper.append(button);
  form.append(input);
  form.append(buttonWrapper);

  return {
    form,
    input,
    button,
  };
}

//Создаем и возращаем список элементов
function createTodoList() {
  const list = document.createElement("ul");
  list.classList.add("list-group");
  return list;
}

//До этого момента все было понятно, теперь начинается жесть

//Итак, тут в функцию передается два аргумента. Первый это todoItem, который мы позже возьмем из
//массива todoItemList а второй аргумент, это объект с хз чем)))))
function createTodoItemElement(todoItem, { onDone, onDelete }) {
  const doneClass = "list-group-item-success";

  const item = document.createElement("li");

  //кнопки помещаем в элемент, который красиво покажет их в одной группе
  const buttonGroup = document.createElement("div");
  const doneButton = document.createElement("button");
  const deleteButton = document.createElement("button");

  //устанавливаем стили для элемента списка, а также для размещения кнопок
  // в его правой части с помощью flex
  item.classList.add(
    "list-group-item",
    "d-flex",
    "justify-content-between",
    "align-items-center"
  );
  //Если у дела свойство done станет true, то элемент окрасится в зеленый
  if (todoItem.done) {
    item.classList.add(doneClass);
  }

  //Берем имя тоже из объекта todoItem
  item.textContent = todoItem.name;

  //Стили для кнопок
  buttonGroup.classList.add("btn-group", "btn-group-sm");
  doneButton.classList.add("btn", "btn-success");
  doneButton.textContent = "Done";
  deleteButton.classList.add("btn", "btn-danger");
  deleteButton.textContent = "Delete";

  //Добавляем обработчики на кнопки
  doneButton.addEventListener("click", () => {
    //Тут по клику вызывается функция onDone, в которую передаются объект элемента и li, то есть само дело
    onDone({ todoItem, element: item });
    //Тут у дела убирают класс, если true то класс добавят, если false то класс уберут
    item.classList.toggle(doneClass, todoItem.done);
  });
  deleteButton.addEventListener("click", () => {
    //По клику вызывается функция onDelete, в которую передают объект элемента и li, то есть само дело
    onDelete({ todoItem, element: item });
  });

  //Вкладываем кнопки в отдельный элемент, чтобы они объединились в один блок
  buttonGroup.append(doneButton);
  buttonGroup.append(deleteButton);
  item.append(buttonGroup);

  return item;
}

async function createTodoApp(
  container,
  {
    title,
    owner,
    todoItemList = [],
    onCreateFormSubmit,
    onDoneClick,
    onDeleteClick,
  }
) {
  const todoAppTitle = createAppTitle(title);
  const todoItemForm = createTodoItemForm();
  const todoList = createTodoList();
  const handlers = { onDone: onDoneClick, onDelete: onDeleteClick };

  container.append(todoAppTitle);
  container.append(todoItemForm.form);
  container.append(todoList);

  todoItemList.forEach((todoItem) => {
    const todoItemElement = createTodoItemElement(todoItem, handlers);
    todoList.append(todoItemElement);
  });

  //Браузер создает событие submit на форме по нажатию на Enter или на кнопку созданния дела
  todoItemForm.form.addEventListener("submit", async (e) => {
    e.preventDefault();

    //Игнорируем создание элемента, если пользователь ничего не ввел в поле
    if (!todoItemForm.input.value) {
      return;
    }

    const todoItem = await onCreateFormSubmit({
      owner,
      name: todoItemForm.input.value.trim(),
    });

    const todoItemElement = createTodoItemElement(todoItem, handlers);

    //создаем и добавляем в список новое дело с названием из поля для ввода
    todoList.append(todoItemElement);

    //обнуляем значение в поле, чтобы не пришлось стирать его вручную
    todoItemForm.input.value = "";
  });
}

export { createTodoApp };
