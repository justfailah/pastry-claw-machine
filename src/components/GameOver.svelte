<!-- Game-over view: final score, save form, and restart control. -->
<div class="game-over" hidden role="status" aria-live="assertive">
  <div class="game-over-card">
    <p class="hud-label">TIME'S UP!</p>
    <p>Your score: <strong class="final-score">0</strong></p>
    <form class="leaderboard-form">
      <label for="player-name">SAVE TO LEADERBOARD</label>
      <input class="player-name" id="player-name" name="playerName" maxlength="14" placeholder="Your name" required autocomplete="nickname" />
      <button class="leaderboard-save-btn" type="submit">Save score</button>
    </form>
    <p class="leaderboard-feedback" aria-live="polite"></p>
    <button class="restart-btn" type="button">Play again</button>
  </div>
</div>
