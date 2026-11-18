/** Handles press-and-hold pointer input for machine controls.*/
export class Button {
  constructor({ root, className, onPress, onRelease }) {
    this.el = root.querySelector(`.${className}`)
    this.isLocked = true
    this.isPressed = false
    this.onPress = onPress
    this.onRelease = onRelease

    // Keeps a held direction active until release
    this.handlePointerDown = event => {
      if (this.isLocked) return
      this.el.setPointerCapture(event.pointerId)
      this.isPressed = true
      this.onPress?.()
    }

    this.handleRelease = () => {
      if (!this.isPressed) return
      this.isPressed = false
      this.onRelease?.()
    }

    this.el.addEventListener('pointerdown', this.handlePointerDown)
    ;['pointerup', 'pointercancel', 'lostpointercapture'].forEach(type =>
      this.el.addEventListener(type, this.handleRelease),
    )
  }

  activate() {
    this.isLocked = false
    this.el.classList.add('active')
  }

  deactivate() {
    this.isLocked = true
    this.el.classList.remove('active')
    this.handleRelease()
  }

  destroy() {
    this.el.removeEventListener('pointerdown', this.handlePointerDown)
    ;['pointerup', 'pointercancel', 'lostpointercapture'].forEach(type =>
      this.el.removeEventListener(type, this.handleRelease),
    )
  }
}