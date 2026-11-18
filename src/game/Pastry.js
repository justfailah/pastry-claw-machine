/** Normal pastry and its points. */
import { getGridPosition } from './geometry.js'
import { Prize } from './Prize.js'

export class Pastry extends Prize {
  constructor({ index, pastryType: selectedType }, game) {
    const pastryType = selectedType ?? game.sortedPastries[index]
    const { w, h } = game.pastrySize
    const position = getGridPosition(index, w, h, game.boardGeometry)

    super(
      {
        el: Object.assign(document.createElement('div'), {
          className: `pastry pix ${pastryType}`,
        }),
        ...position,
        w,
        h,
        z: 0,
        index,
        pastryType,
        points: 1,
      },
      game,
    )
  }

  getTrayMarkup() {
    return `<div class="pastry pix ${this.pastryType}"></div>`
  }
}