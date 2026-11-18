/** Score and combo rules, publishing updates to the game view. */
export class ScoreManager {
  constructor({ scoreElement, comboElement, onScoreChange }) {
    this.scoreElement = scoreElement
    this.comboElement = comboElement
    this.onScoreChange = onScoreChange
    this.score = 0
    this.combo = 0
    this.feedbackTimer = null
  }

  /** Prize points, combo multipliers and score-change callback. */
  award(prize) {
    let multiplier = 1
    if (prize.points < 0) {
      this.combo = 0
      this.score += prize.points
      clearTimeout(this.feedbackTimer)
      this.comboElement.textContent = 'COMBO LOST!'
      this.comboElement.classList.add('combo-broken')
      this.feedbackTimer = setTimeout(() => {
        this.comboElement.textContent = ''
        this.comboElement.classList.remove('combo-broken')
      }, 1100)
    } else {
      this.combo++
      multiplier = Math.min(5, 1 + Math.floor(this.combo / 3))
      this.score += prize.points * multiplier
      clearTimeout(this.feedbackTimer)
      this.comboElement.classList.remove('combo-broken')
      this.comboElement.textContent =
        this.combo >= 3
          ? `${this.combo} STREAK · x${multiplier}`
          : this.combo >= 2
            ? `${this.combo} IN A ROW`
            : ''
    }

    this.scoreElement.textContent = this.score
    this.onScoreChange(this.score)
    this.scoreElement.classList.remove('score-pop')
    void this.scoreElement.offsetWidth
    this.scoreElement.classList.add('score-pop')

    return { delta: prize.points * multiplier, combo: this.combo, multiplier }
  }

  destroy() {
    clearTimeout(this.feedbackTimer)
  }
}