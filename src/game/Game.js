/** Game session with its world objects and controls */
import { Button } from './Button.js'
import { Chilli } from './Chilli.js'
import { Leaderboard } from './Leaderboard.js'
import { GameEffects } from './GameEffects.js'
import { GoldenPastry } from './GoldenPastry.js'
import { ScoreManager } from './ScoreManager.js'
import { Pastry } from './Pastry.js'
import { PrizeUnbox } from './PrizeUnbox.js'
import { randomInt, rectanglesOverlap } from './geometry.js'
import { WorldObject } from './WorldObject.js'

const MACHINE_BUFFER = { x: 36, y: 16 }
const CORNER_BUFFER = 16
const GAME_SECONDS = 60

export class ClawMachineGame {
  constructor(root) {
    this.root = root
    this.elements = this.getElements()
    this.settings = {
      targetPrize: null,
      collectedNumber: 0,
      score: 0,
      timeRemaining: GAME_SECONDS,
      timer: null,
      started: false,
      ended: false,
      timerPaused: false,
    }
    this.elements.timer.textContent = GAME_SECONDS
    this.elements.startButton.disabled = true
    this.measureBoard()
    this.worldContext = {
      root,
      box: this.elements.box,
      maxArmLength: this.maxArmLength,
    }
    this.elements.box.style.setProperty('--shadow-pos', `${this.maxArmLength}px`)
    this.leaderboard = new Leaderboard(root, () => this.settings.score)
    this.prizeUnbox = new PrizeUnbox(root, {
      onPause: () => this.pauseTimer(),
      onResume: () => this.resumeTimer(),
    })
    this.scoreManager = new ScoreManager({
      scoreElement: this.elements.score,
      comboElement: this.elements.combo,
      onScoreChange: score => {
        this.settings.score = score
        this.prizeUnbox.updateScore(score)
      },
    })
    this.effects = new GameEffects(this.elements.box)
    this.createWorldObjects()
    this.createControls()
    this.createPrizes()
    this.bindRestart()
    this.bindStart()
    this.playIntro()
  }

  getElements() {
    return {
      clawMachine: this.root.querySelector('.claw-machine'),
      box: this.root.querySelector('.box'),
      collectionBox: this.root.querySelector('.collection-box'),
      collectionArrow: this.root.querySelector('.collection-arrow'),
      timer: this.root.querySelector('.timer-value'),
      timerCard: this.root.querySelector('.timer-card'),
      score: this.root.querySelector('.score-value'),
      combo: this.root.querySelector('.combo-value'),
      gameOver: this.root.querySelector('.game-over'),
      finalScore: this.root.querySelector('.final-score'),
      startScreen: this.root.querySelector('.start-screen'),
      startButton: this.root.querySelector('.start-game-btn'),
      prizes: [],
    }
  }

  /** Reads the claw machine dimensions */
  measureBoard() {
    this.m =
      parseFloat(getComputedStyle(document.body).getPropertyValue('--m')) || 2
    this.prizeSize = 28 * this.m
    this.pastrySize = { w: this.prizeSize, h: this.prizeSize }

    const { height: machineHeight, top: machineTop } =
      this.elements.clawMachine.getBoundingClientRect()
    const { width: machineWidth } = this.elements.box.getBoundingClientRect()
    const { height: machineTopHeight } = this.root
      .querySelector('.machine-top')
      .getBoundingClientRect()
    const { height: machineBottomHeight, top: machineBottomTop } = this.root
      .querySelector('.machine-bottom')
      .getBoundingClientRect()

    this.machineHeight = machineHeight
    this.machineWidth = machineWidth
    this.machineTopHeight = machineTopHeight
    this.maxArmLength = machineBottomTop - machineTop - MACHINE_BUFFER.y
    this.boardGeometry = {
      machineWidth,
      machineTop,
      machineBottomTop,
      machineBottomHeight,
      cornerBuffer: CORNER_BUFFER,
    }
  }

  createWorldObjects() {
    this.armJoint = new WorldObject(
      { className: 'arm-joint' },
      this.worldContext,
    )
    this.vertRail = new WorldObject(
      { className: 'vert', moveWith: [null, this.armJoint] },
      this.worldContext,
    )
    this.arm = new WorldObject({ className: 'arm' }, this.worldContext)
    this.worldObjects = [this.vertRail, this.armJoint, this.arm]
    this.arm.resizeShadow()
  }

  createControls() {
    const directions = {
      left: {
        object: this.vertRail,
        moveKey: 'x',
        target: () => MACHINE_BUFFER.x,
      },
      right: {
        object: this.vertRail,
        moveKey: 'x',
        target: () => this.machineWidth - this.armJoint.w - MACHINE_BUFFER.x,
      },
      up: {
        object: this.armJoint,
        moveKey: 'y',
        target: () => MACHINE_BUFFER.y,
      },
      down: {
        object: this.armJoint,
        moveKey: 'y',
        target: () => this.armJoint.default.y,
      },
    }

    this.directionButtons = Object.entries(directions).map(
      ([name, { object, moveKey, target }]) =>
        new Button({
          root: this.root,
          className: `${name}-btn`,
          onPress: () => {
            this.stopMove(object)
            this.arm.el.classList.remove('missed')
            object.heldDir = name
            object.move({ moveKey, target: target() })
          },
          onRelease: () => {
            if (object.heldDir === name) this.stopMove(object)
          },
        }),
    )

    this.dropButton = new Button({
      root: this.root,
      className: 'drop-btn',
      onPress: () => this.startGrab(),
    })
    this.controlButtons = [...this.directionButtons, this.dropButton]
  }

  /** Seeds the board with randomized standard, golden, and negative prizes. */
  createPrizes() {
    this.pastryTypes = ['beignet', 'egg_tart', 'lemon_tart', 'pretzel', 'tiramisu']
    this.sortedPastries = [...this.pastryTypes, ...this.pastryTypes, ...this.pastryTypes]
      .sort(() => 0.5 - Math.random())
      .slice(0, 12)

    const chilliIndex = randomInt(0, 11)
    const pastryIndexes = Array.from({ length: 12 }, (_, index) => index).filter(index => index !== chilliIndex)
    const goldenIndex = Math.random() < 0.15
      ? pastryIndexes[randomInt(0, pastryIndexes.length - 1)]
      : -1
    for (let index = 0; index < 12; index++) {
      if (index === chilliIndex) new Chilli({ index }, this)
      else if (index === goldenIndex) new GoldenPastry({ index }, this)
      else new Pastry({ index }, this)
    }
  }

  randomPastryType() {
    return this.pastryTypes[randomInt(0, this.pastryTypes.length - 1)]
  }

  spawnReplacement(prize) {
    if (this.settings.ended) return

    const { index } = prize
    this.elements.prizes = this.elements.prizes.filter(candidate => candidate !== prize)
    if (randomInt(0, 11) === 0) {
      new Chilli({ index }, this)
    } else if (Math.random() < 0.15) {
      new GoldenPastry({ index, pastryType: this.randomPastryType() }, this)
    } else {
      new Pastry({ index, pastryType: this.randomPastryType() }, this)
    }
  }
  bindRestart() {
    this.handleRestart = () => window.location.reload()
    this.root.querySelector('.restart-btn').addEventListener('click', this.handleRestart)
  }

  bindStart() {
    this.handleStart = () => {
      if (this.settings.started || this.elements.startButton.disabled) return

      this.settings.started = true
      this.elements.startScreen.hidden = true
      this.activateControls()
      this.startTimer()
      this.dropButton.el.focus()
    }
    this.elements.startButton.addEventListener('click', this.handleStart)
  }

  /** Selects the nearest prize that overlap the claw-shadow hit area. */
  getClosestPrize() {
    this.settings.targetPrize = null
    // Match pickup area to the visible shadow under the claw
    const shadowScale =
      Number.parseFloat(getComputedStyle(this.elements.box).getPropertyValue('--scale')) || 1
    const shadowWidth = 40 * shadowScale
    const shadowHeight = 32 * shadowScale
    const hitPadding = 3
    const claw = {
      x: this.armJoint.x - 15 + (40 - shadowWidth) / 2 - hitPadding,
      y: this.armJoint.y + this.maxArmLength + (32 - shadowHeight) / 2 - hitPadding,
      w: shadowWidth + hitPadding * 2,
      h: shadowHeight + hitPadding * 2,
    }
    const overlappedPrizes = this.elements.prizes.filter(prize =>
      rectanglesOverlap(prize, claw),
    )

    if (!overlappedPrizes.length) return

    const distanceFromClawCenter = prize =>
      Math.hypot(
        prize.x + prize.w / 2 - (claw.x + claw.w / 2),
        prize.y + prize.h / 2 - (claw.y + claw.h / 2),
      )
    const prize = overlappedPrizes.sort(
      (a, b) => distanceFromClawCenter(a) - distanceFromClawCenter(b),
    )[0]

    prize.setTransformOrigin({ x: claw.x - prize.x, y: claw.y - prize.y })
    prize.setClawPos({ x: claw.x, y: claw.y })
    this.settings.targetPrize = prize
  }

  stopMove(object) {
    clearInterval(object.interval)
    object.interval = null
    object.heldDir = null
  }

  /** Runs the entire sequence for one drop. */
  startGrab() {
    this.deactivateControls()
    this.arm.el.classList.remove('missed')
    this.getClosestPrize()

    setTimeout(() => {
      this.arm.el.classList.add('open')
      this.arm.move({
        moveKey: 'h',
        target: this.maxArmLength,
        next: () =>
          setTimeout(() => {
            this.arm.el.classList.remove('open')
            this.grabPrize()
            this.arm.resumeMove({
              moveKey: 'h',
              next: () =>
                this.vertRail.resumeMove({
                  moveKey: 'x',
                  next: () =>
                    this.armJoint.resumeMove({
                      moveKey: 'y',
                      next: () => this.dropPrize(),
                    }),
                }),
            })
          }, 500),
      })
    }, 500)
  }

  grabPrize() {
    const prize = this.settings.targetPrize
    if (!prize) {
      this.arm.el.classList.add('missed')
      return
    }

    ;[this.vertRail, this.armJoint, this.arm].forEach(
      object => (object.moveWith[0] = prize),
    )
    prize.setRotateAngle()
    prize.setAfter?.()
    prize.el.classList.add('grabbed')
  }

  dropPrize() {
    this.arm.el.classList.add('open')
    const prize = this.settings.targetPrize
    if (prize) {
      prize.z = 3
      prize.move({
        moveKey: 'y',
        target: this.machineHeight - prize.h - 30,
        moveTime: 50,
      })
      ;[this.vertRail, this.armJoint, this.arm].forEach(
        object => (object.moveWith[0] = null),
      )
    }

    setTimeout(() => {
      this.arm.el.classList.remove('open')
      this.activateControls()
      if (!prize) return

      prize.el.classList.add('selected')
      this.spawnReplacement(prize)
      this.elements.collectionArrow.classList.add('active')
      if (!this.settings.ended) {
        const result = this.scoreManager.award(prize)
        this.effects.showPrizeDrop(prize, result.delta)
      }
      this.settings.targetPrize = null
    }, 700)
  }

  /** Starts the clock once. */
  startTimer() {
    if (this.settings.ended || this.settings.timer) return
    this.settings.timer = setInterval(() => {
      this.settings.timeRemaining = Math.max(0, this.settings.timeRemaining - 1)
      this.elements.timer.textContent = this.settings.timeRemaining
      if (this.settings.timeRemaining <= 10)
        this.elements.timerCard.classList.add('is-low')
      if (this.settings.timeRemaining === 0) this.finishGame()
    }, 1000)
  }

  pauseTimer() {
    if (this.settings.ended || !this.settings.timer) return
    clearInterval(this.settings.timer)
    this.settings.timer = null
    this.settings.timerPaused = true
  }

  resumeTimer() {
    if (this.settings.ended || !this.settings.timerPaused) return
    this.settings.timerPaused = false
    this.startTimer()
  }
  activateControls() {
    if (this.settings.ended) return

    if (!this.settings.started) {
      this.elements.startButton.disabled = false
      this.elements.startButton.focus()
      return
    }

    this.worldObjects.forEach(object => (object.interval = null))
    this.controlButtons.forEach(button => button.activate())
  }

  deactivateControls() {
    ;[this.vertRail, this.armJoint].forEach(object => this.stopMove(object))
    this.controlButtons.forEach(button => button.deactivate())
  }

  finishGame() {
    this.settings.ended = true
    clearInterval(this.settings.timer)
    this.deactivateControls()
    this.worldObjects.forEach(object => this.stopMove(object))
    this.elements.finalScore.textContent = this.settings.score
    this.elements.gameOver.hidden = false
  }

  playIntro() {
    this.armJoint.move({
      moveKey: 'y',
      target: this.machineTopHeight - MACHINE_BUFFER.y,
      moveTime: 50,
      next: () =>
        this.vertRail.resumeMove({
          moveKey: 'x',
          target: MACHINE_BUFFER.x,
          moveTime: 50,
          next: () => {
            Object.assign(this.armJoint.default, {
              y: this.machineTopHeight - MACHINE_BUFFER.y,
              x: MACHINE_BUFFER.x,
            })
            this.vertRail.default.x = MACHINE_BUFFER.x
            this.activateControls()
          },
        }),
    })
  }

  /** Releases timers and event listeners. */
  destroy() {
    clearInterval(this.settings.timer)
    this.worldObjects.forEach(object => clearInterval(object.interval))
    this.controlButtons.forEach(button => button.destroy())
    this.leaderboard.destroy()
    this.scoreManager.destroy()
    this.prizeUnbox.destroy()
    this.elements.startButton.removeEventListener('click', this.handleStart)
    this.root
      .querySelector('.restart-btn')
      .removeEventListener('click', this.handleRestart)
  }
}