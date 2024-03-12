async function clientSide(owner, title, func) {
  const btn = document.querySelector(".choose-server-btn");
  let serverStatus = "localStorage";

  const response = localStorage.getItem("serverStatus");

  if (response) {
    serverStatus = response;
  }

  if (serverStatus === "server") {
    const serverImport = await import("./api.js");

    btn.textContent = "Перейти на локальное хранилище";

    const todoItemList = await serverImport.getTodoList(owner);
    func(document.getElementById("todo-app"), {
      title,
      owner,
      todoItemList,
      onCreateFormSubmit: serverImport.createTodoItem,
      onDoneClick: serverImport.switchTodoItemDone,
      onDeleteClick: serverImport.deleteTodoItem,
    });
  } else if (serverStatus === "localStorage") {
    const localImport = await import("./localStorage.js");
    btn.textContent = "Перейти на серверное хранилище";

    func(document.getElementById("todo-app"), {
      title,
      owner,
      todoItemList: localImport.getTodoListLocal(owner),
      onCreateFormSubmit: localImport.createTodoItemLocal,
      onDoneClick: localImport.switchTodoItemDoneLocal,
      onDeleteClick: localImport.deleteTodoItemLocal,
    });
  }

  btn.addEventListener("click", () => {
    if (serverStatus === "server") {
      serverStatus = "localStorage";
    } else if (serverStatus === "localStorage") {
      serverStatus = "server";
    }
    localStorage.setItem("serverStatus", serverStatus);
    location.reload();
  });
}

export { clientSide };
