/** Score labels and collection particles. */
export class GameEffects {
  constructor(box) {
    this.box = box
  }

  showPrizeDrop(prize, points) {
    const label = document.createElement('div')
    label.className = `score-float${prize.isGolden ? ' golden-score' : ''}${points < 0 ? ' penalty-score' : ''}`
    label.textContent = `${points > 0 ? '+' : ''}${points}${prize.isGolden ? ' BONUS!' : ''}`
    label.style.left = `${prize.x + prize.w / 2}px`
    label.style.top = `${prize.y}px`
    this.box.append(label)
    label.addEventListener('animationend', () => label.remove(), { once: true })

    const colors = prize.isGolden
      ? ['#ffe16b', '#fff4b5', '#ffb84d']
      : points < 0
        ? ['#ff647c', '#ffc0ca', '#d9385a']
        : ['#fff0a6', '#fffaff', '#e5c4ff']

    for (let index = 0; index < 8; index++) {
      const spark = document.createElement('i')
      spark.className = 'collection-spark'
      spark.style.left = `${prize.x + prize.w / 2}px`
      spark.style.top = `${prize.y + prize.h / 2}px`
      spark.style.setProperty('--spark-angle', `${index * 45}deg`)
      spark.style.setProperty('--spark-color', colors[index % colors.length])
      this.box.append(spark)
      spark.addEventListener('animationend', () => spark.remove(), { once: true })
    }
  }
}