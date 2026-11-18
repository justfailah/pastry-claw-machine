/** Base class for collectible objects and their shared collection behavior. */
import { normalizeAngle } from "./geometry.js";
import { WorldObject } from "./WorldObject.js";

export class Prize extends WorldObject {
  constructor(props, game) {
    super(props, game.worldContext);
    this.game = game;
    this.elements = game.elements;
    this.settings = game.settings;

    this.elements.box.append(this.el);
    this.elements.prizes.push(this);
    this.el.addEventListener("click", () => this.collect());
  }

  setRotateAngle() {
    const radians = Math.atan2(
      this.y + this.h / 2 - this.clawPos.y,
      this.x + this.w / 2 - this.clawPos.x,
    );
    const angle = Math.round(
      normalizeAngle(Math.round((radians * 180) / Math.PI) - 90),
    );
    this.angle = angle < 180 ? angle * -1 : 360 - angle;
    this.el.style.setProperty("--rotate-angle", `${this.angle}deg`);
  }

  /** Moves a delivered prize into the collection tray and removes its board entry. */
  collect() {
    if (this.settings.ended || !this.el.classList.contains("selected")) return;

    // Remove collected prizes from the claw's pickup
    this.elements.prizes = this.elements.prizes.filter(
      (prize) => prize !== this,
    );
    this.el.classList.remove("selected");
    this.x = this.game.machineWidth / 2 - this.w / 2;
    this.y = this.game.machineHeight / 2 - this.h / 2;
    this.z = 7;
    this.el.style.setProperty("--rotate-angle", "0deg");
    this.setTransformOrigin("center");
    this.el.classList.add("display");
    this.elements.clawMachine.classList.add("show-overlay");

    this.settings.collectedNumber++;
    const wrapper = document.createElement("div");
    wrapper.className = `pastry-wrapper ${
      this.settings.collectedNumber > 6 ? "squeeze-in" : ""
    }`;
    wrapper.innerHTML = this.getTrayMarkup();
    this.elements.collectionBox.append(wrapper);

    setTimeout(() => {
      this.elements.clawMachine.classList.remove("show-overlay");
      if (!this.game.root.querySelector(".selected"))
        this.elements.collectionArrow.classList.remove("active");
    }, 1000);
    setTimeout(() => this.el.remove(), 2000);
  }
}
