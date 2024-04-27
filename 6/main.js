//getOwnPropertyDescriptors
//

const form = document.getElementById("my-form");
const input = document.getElementById("form-input");
const errorContainer = document.getElementById("error-container");
const listBtns = document.querySelectorAll(".list-btn");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  errorContainer.innerHTML = "";

  if (input.value === "") return;

  let val = input.value.trim();

  if (val.endsWith(".js")) {
    console.log("Working");
    const module = await import(`./${val}`);
    val = module.default;
  } else {
    val = window[input.value.trim()];

    if (!val || typeof val !== "function") {
      errorContainer.textContent = "There is no such class";
      return;
    }
  }

  input.value = "";

  const classArr = [];

  let check = val.prototype;

  classArr.push(check);

  while (true) {
    check = Object.getPrototypeOf(check);

    if (!check) {
      break;
    }

    classArr.push(check);
  }
  console.log(classArr);

  createList(classArr);
});

// console.log(Object.getOwnPropertyNames("Node"));

// console.log(Object.getPrototypeOf("Node".prototype));

function createList(arr) {
  const list = document.querySelector(".info-list");
  list.innerHTML = "";
  for (const item of arr) {
    const listItem = document.createElement("li");
    const listBtn = document.createElement("button");
    const listText = createPrototypeList(item);

    listBtn.classList.add("list-btn");
    listText.classList.add("list-text");

    listBtn.textContent = item.constructor.name;

    listItem.append(listBtn, listText);
    list.append(listItem);

    listBtn.addEventListener("click", () => {
      const text = listBtn.nextElementSibling;
      text.classList.toggle("visible");
    });
  }
}

function createPrototypeList(obj) {
  const list = Object.keys(obj);
  const textWrapper = document.createElement("div");

  if (list.length < 1) {
    textWrapper.innerHTML = `
    No propertys
  `;
  }
  for (const item of list) {
    let objVal = Object.getOwnPropertyDescriptor(obj, item);

    const text = document.createElement("p");

    text.innerHTML = `
      Property: ${item}, Type of: ${typeof objVal.value} 
    `;
    textWrapper.append(text);
  }

  return textWrapper;
}
