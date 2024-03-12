export function getTodoListLocal(owner) {
  //Отправляем запрос на список всех дел

  const response = JSON.parse(localStorage.getItem(owner));

  if (response) {
    return response;
  } else {
    return [];
  }
}

export function createTodoItemLocal({ owner, name }) {
  let taskList = JSON.parse(localStorage.getItem(owner));

  if (!taskList) {
    taskList = [];
  }
  const newItem = {};

  //Начинаем создавать объект дела
  //Начинаем с генерации id

  const min = 10000; // Минимальное значение (включительно)
  const max = 99999; // Максимальное значение (включительно)
  const newId = Math.floor(Math.random() * (max - min + 1)) + min;

  newItem.id = newId;

  //Добавляем имя дела
  newItem.name = name;

  //Добавляем done = false, так как дело не могли еще сделать
  newItem.done = false;

  //Ну и добавим имя владельца дела, так как мне легче будет его искать потом
  newItem.owner = owner;

  //Добавляем объект в массив
  taskList.push(newItem);

  taskList = JSON.stringify(taskList);

  localStorage.setItem(owner, taskList);

  return newItem;
}

export function switchTodoItemDoneLocal({ todoItem }) {
  todoItem.done = !todoItem.done;

  const owner = todoItem.owner;

  const taskList = getTodoListLocal(owner);

  taskList.forEach((task) => {
    if (task.id === todoItem.id) {
      task.done = todoItem.done;
    }
  });

  localStorage.setItem(owner, JSON.stringify(taskList));
}

export function deleteTodoItemLocal({ element, todoItem }) {
  if (!confirm("Are you sure?")) {
    return;
  }
  element.remove();

  const owner = todoItem.owner;

  const taskList = getTodoListLocal(owner);

  taskList.forEach((task) => {
    if (task.id === todoItem.id) {
      const index = taskList.indexOf(task);
      taskList.splice(index, 1);
    }
  });

  localStorage.setItem(owner, JSON.stringify(taskList));
}
