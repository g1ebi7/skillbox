export default class MyFunction {
  constructor(name) {
    this.name = name;
  }

  sayHi() {
    if (this.name) {
      console.log(this.name);
    }
    return;
  }
}
