/** Geometry and randomization helpers shared by board and pickup logic. */
export const randomInt = (min, max) =>
  Math.round(min - 0.5 + Math.random() * (max - min + 1))

/** Computes a prize slot position with small per-spawn placement variation. */
export const getGridPosition = (index, width, height, board) => {
  const column = index % 4
  const row = Math.floor(index / 4)
  const { machineWidth, machineTop, machineBottomTop, machineBottomHeight } = board
  const { cornerBuffer = 16 } = board

  return {
    x:
      cornerBuffer +
      column * ((machineWidth - cornerBuffer * 3) / 4) +
      width / 2 +
      randomInt(-6, 6),
    y:
      machineBottomTop -
      machineTop +
      cornerBuffer +
      row * ((machineBottomHeight - cornerBuffer * 2) / 3) -
      height / 2 +
      randomInt(-2, 2),
  }
}

/** Strict detect intersection between two objects. */
export const rectanglesOverlap = (first, second) =>
  first.x < second.x + second.w &&
  first.x + first.w > second.x &&
  first.y < second.y + second.h &&
  first.y + first.h > second.y

export const normalizeAngle = angle => ((angle % 360) + 360) % 360