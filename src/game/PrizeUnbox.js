/** Tracks reward tiers and prize-unboxing interaction. */
const REWARDS = [
  {
    id: 'trophy',
    order: 1,
    score: 6,
    title: 'Trophy Gift',
    message: 'Best boyfriend in the world',
    art: 'is-trophy',
  },
  {
    id: 'mystery',
    order: 2,
    score: 15,
    title: 'Mystery Surprise',
    message: 'A sweet surprise is waiting for you!',
    art: 'is-mystery',
  },
]

export class PrizeUnbox {
  constructor(root, { onPause, onResume } = {}) {
    this.root = root
    this.modal = root.querySelector('.prize-popup')
    this.card = root.querySelector('.prize-card')
    this.tierLabel = root.querySelector('.prize-tier-label')
    this.title = root.querySelector('.prize-title')
    this.openButton = root.querySelector('.prize-open-btn')
    this.reveal = root.querySelector('.prize-reveal')
    this.revealArt = root.querySelector('.prize-reveal-art')
    this.message = root.querySelector('.prize-message')
    this.closeButton = root.querySelector('.prize-close-btn')
    this.progress = root.querySelector('.reward-progress')
    this.progressScore = root.querySelector('.reward-progress-score')
    this.nextReward = root.querySelector('.reward-next')
    this.markers = new Map(
      REWARDS.map(reward => [
        reward.id,
        root.querySelector(`[data-reward="${reward.id}"]`),
      ]),
    )

    this.onPause = onPause
    this.onResume = onResume
    this.highestScore = 0
    this.currentScore = 0
    this.unlockedRewards = new Set()
    this.pendingRewards = []
    this.activeReward = null
    this.opened = false
    this.returnFocusTo = null

    this.handleOpen = () => this.open()
    this.handleClose = () => this.close()
    this.openButton.addEventListener('click', this.handleOpen)
    this.closeButton.addEventListener('click', this.handleClose)
    this.renderProgress()
  }

  /** Unlocks each threshold once while keeping the bar tied to current score. */
  updateScore(score) {
    this.currentScore = score
    this.highestScore = Math.max(this.highestScore, score)
    this.renderProgress()

    REWARDS.forEach(reward => {
      if (this.highestScore < reward.score || this.unlockedRewards.has(reward.id)) return
      this.unlockedRewards.add(reward.id)
      this.pendingRewards.push(reward)
    })

    this.showNextReward()
  }

  renderProgress() {
    const maximum = REWARDS[REWARDS.length - 1].score
    const progressScore = Math.max(0, Math.min(maximum, this.currentScore))
    const percent = Math.min(100, (progressScore / maximum) * 100)
    this.progress.style.setProperty('--reward-progress', `${percent}%`)
    this.progress.setAttribute('aria-valuenow', String(Math.min(maximum, progressScore)))
    this.progressScore.textContent = progressScore

    REWARDS.forEach(reward => {
      this.markers.get(reward.id)?.classList.toggle(
        'is-unlocked',
        this.unlockedRewards.has(reward.id),
      )
    })

    const next = REWARDS.find(reward => !this.unlockedRewards.has(reward.id))
    this.nextReward.textContent = next
      ? `NEXT PRIZE AT ${next.score} PTS`
      : 'ALL PRIZES UNLOCKED!'
  }

  /** Queues reward dialogs one at a time and pauses play while being shown. */
  showNextReward() {
    if (this.activeReward || !this.pendingRewards.length) return

    this.activeReward = this.pendingRewards.shift()
    this.opened = false
    this.returnFocusTo = document.activeElement
    this.tierLabel.textContent = `TIER ${this.activeReward.order} UNLOCKED`
    this.title.textContent = this.activeReward.title
    this.message.textContent = this.activeReward.message
    this.revealArt.className = `prize-reveal-art ${this.activeReward.art}`
    this.openButton.hidden = false
    this.reveal.hidden = true
    this.card.classList.remove('is-unboxed')
    this.card.dataset.reward = this.activeReward.id
    this.onPause?.()
    this.modal.hidden = false
    this.openButton.focus()
  }

  open() {
    if (!this.activeReward || this.opened) return

    this.opened = true
    this.card.classList.add('is-unboxed')
    this.openButton.hidden = true
    this.reveal.hidden = false
    this.closeButton.focus()
  }

  close() {
    if (!this.activeReward) return

    this.modal.hidden = true
    this.activeReward = null
    this.returnFocusTo?.focus?.()

    if (this.pendingRewards.length) {
      this.showNextReward()
      return
    }

    this.onResume?.()
  }

  destroy() {
    this.openButton.removeEventListener('click', this.handleOpen)
    this.closeButton.removeEventListener('click', this.handleClose)
  }
}