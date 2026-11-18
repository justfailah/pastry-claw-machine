const STORAGE_KEY = 'pastry-claw-machine-leaderboard'
const MAX_SCORES = 50
const VISIBLE_SCORES = 10

export class Leaderboard {
  constructor(root, getCurrentScore) {
    this.getCurrentScore = getCurrentScore
    this.list = root.querySelector('.leaderboard-list')
    this.emptyMessage = root.querySelector('.leaderboard-empty')
    this.form = root.querySelector('.leaderboard-form')
    this.nameInput = root.querySelector('.player-name')
    this.feedback = root.querySelector('.leaderboard-feedback')

    this.handleSubmit = event => this.save(event)
    this.form.addEventListener('submit', this.handleSubmit)
    this.render()
  }

  read() {
    try {
      const entries = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
      return Array.isArray(entries)
        ? entries.filter(
            entry =>
              typeof entry?.name === 'string' &&
              Number.isFinite(entry?.score),
          )
        : []
    } catch {
      return []
    }
  }

  render() {
    const entries = this.read()
      .sort((a, b) => b.score - a.score || a.createdAt - b.createdAt)
      .slice(0, VISIBLE_SCORES)

    this.list.replaceChildren()
    this.emptyMessage.hidden = entries.length > 0

    entries.forEach((entry, index) => {
      const row = document.createElement('li')
      row.className = 'leaderboard-row'

      const rank = document.createElement('span')
      rank.className = 'leaderboard-rank'
      rank.textContent = `${String(index + 1).padStart(2, '0')}.`

      const name = document.createElement('span')
      name.className = 'leaderboard-name'
      name.textContent = entry.name

      const score = document.createElement('span')
      score.className = 'leaderboard-points'
      score.textContent = `${entry.score} PTS`
      row.append(rank, name, score)
      this.list.append(row)
    })
  }

  save(event) {
    event.preventDefault()
    const name = this.nameInput.value.trim()
    if (!name) {
      this.feedback.textContent = 'Enter a name to save your score.'
      this.nameInput.focus()
      return
    }

    const entries = this.read()
    entries.push({
      name: name.slice(0, 14),
      score: this.getCurrentScore(),
      createdAt: Date.now(),
    })
    entries.sort((a, b) => b.score - a.score || a.createdAt - b.createdAt)

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(0, MAX_SCORES)))
      this.render()
      this.form.hidden = true
      this.feedback.textContent = 'Score saved to this browser!'
    } catch {
      this.feedback.textContent = 'Could not save score in this browser.'
    }
  }

  destroy() {
    this.form.removeEventListener('submit', this.handleSubmit)
  }
}