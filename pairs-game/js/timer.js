export default class TimerDisplay {
  constructor(seconds, container, action) {
    if (typeof seconds !== "number" || seconds < 1) {
      throw new TypeError("Amount of seconds should be a number");
    }

    this.startTime = seconds;
    this.currentTime = seconds;

    this.action = action;

    container.append(this.getComponentElement());
  }

  set currentTime(time) {
    this._currentTime = time;
    if (this.element) {
      this.element.textContent = `Seconds left: ${time}`;
    }
  }

  get currentTime() {
    return this._currentTime;
  }

  start() {
    this.interval = setInterval(() => this.tick(), 1000);
  }

  pause() {
    clearInterval(this.interval);
  }

  reset() {
    this.pause();
    this.element.textContent = "";
    this._currentTime = this.startTime;
  }

  tick() {
    if (this.currentTime <= 1) {
      this.element.textContent = "";
      this.action();
      return;
    }
    --this.currentTime;
  }

  getComponentElement() {
    const element = document.createElement("div");

    this.element = element;
    this.element.classList.add("timer");
    this.element.textContent = "You will have 30 seconds";
    return this.element;
  }
}
