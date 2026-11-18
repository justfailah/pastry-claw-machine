/** Gold pastry variant with bonus score. */
import { Pastry } from './Pastry.js'

export class GoldenPastry extends Pastry {
  constructor(props, game) {
    super(props, game)
    this.points = 5
    this.isGolden = true
    this.el.classList.add('golden')
  }

  getTrayMarkup() {
    return `<div class="pastry pix ${this.pastryType} golden"></div>`
  }
}