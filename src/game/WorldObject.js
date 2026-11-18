export class WorldObject {
  constructor(props, { root, box, maxArmLength } = {}) {
    Object.assign(this, {
      x: 0,
      y: 0,
      z: 0,
      angle: 0,
      transformOrigin: '',
      interval: null,
      default: {},
      moveWith: [],
      el: props.className && root?.querySelector(`.${props.className}`),
      ...props,
    })
    this.box = box
    this.maxArmLength = maxArmLength

    if (props.className) {
      const { width, height } = this.el.getBoundingClientRect()
      this.w = width
      this.h = height
    }

    this.setStyles()
    ;['x', 'y', 'w', 'h'].forEach(key => {
      this.default[key] = this[key]
    })
  }

  setStyles() {
    Object.assign(this.el.style, {
      left: `${this.x}px`,
      top: `${this.y}px`,
      width: `${this.w}px`,
      height: `${this.h}px`,
      transformOrigin: this.transformOrigin,
      zIndex: this.z,
    })
  }

  setClawPos(clawPos) {
    this.clawPos = clawPos
  }

  setTransformOrigin(transformOrigin) {
    this.transformOrigin =
      transformOrigin === 'center'
        ? 'center'
        : `${transformOrigin.x}px ${transformOrigin.y}px`
    this.setStyles()
  }

  handleNext(next) {
    clearInterval(this.interval)
    this.interval = null
    next?.()
  }

  resumeMove(options) {
    this.interval = null
    this.move(options)
  }

  resizeShadow() {
    this.box.style.setProperty('--scale', 0.5 + this.h / this.maxArmLength / 2)
  }

  move({ moveKey, target, moveTime, next }) {
    if (this.interval) {
      this.handleNext(next)
      return
    }

    const moveTarget = target ?? this.default[moveKey]
    const step = () => {
      if (this[moveKey] === moveTarget) {
        this.handleNext(next)
        return false
      }

      const distance = Math.min(Math.abs(this[moveKey] - moveTarget), 10)
      const increment = this[moveKey] > moveTarget ? -distance : distance
      this[moveKey] += increment
      this.setStyles()

      if (moveKey === 'h') this.resizeShadow()
      this.moveWith.forEach(object => {
        if (!object) return
        object[moveKey === 'h' ? 'y' : moveKey] += increment
        object.setStyles()
      })

      if (this[moveKey] === moveTarget) {
        this.handleNext(next)
        return false
      }
      return true
    }

    if (step()) this.interval = setInterval(step, moveTime || 100)
  }

  distanceBetween(target) {
    return Math.round(Math.hypot(this.x - target.x, this.y - target.y))
  }
}