/** Negative prize point mechanism */
import { getGridPosition } from './geometry.js'
import { Prize } from './Prize.js'

export class Chilli extends Prize {
  constructor({ index }, game) {
    const position = getGridPosition(index, game.prizeSize, game.prizeSize, game.boardGeometry)

    super(
      {
        el: Object.assign(document.createElement('div'), {
          className: 'chilli pix before',
        }),
        ...position,
        w: game.prizeSize,
        h: game.prizeSize,
        z: 0,
        index,
        points: -1,
      },
      game,
    )
  }

  setAfter() {
    this.el.classList.remove('before')
    this.el.classList.add('after')
  }

  getTrayMarkup() {
    return '<div class="chilli pix after"></div>'
  }
}