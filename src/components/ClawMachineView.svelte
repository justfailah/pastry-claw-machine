<!-- Machine view: cabinet and control markup used by the game controller. -->
<main class="machine-stage">
  <div class="game-hud" aria-label="Game status">
    <div class="timer-card" aria-live="polite">
      <span class="hud-label">TIME</span>
      <span class="timer-value">60</span>
    </div>
    <div class="score-card" aria-live="polite">
      <span class="hud-label">SCORE</span>
      <span class="score-value">0</span>
      <span class="combo-value" aria-live="polite"></span>
    </div>
  </div>
  <div class="collection-box pix"></div>
  <div class="claw-machine">
    <div class="box pix">
      <div class="machine-top pix">
        <div class="arm-joint pix">
          <div class="arm pix">
            <div class="claws pix"></div>
          </div>
        </div>
        <div class="rail hori pix"></div>
        <div class="rail vert pix"></div>
      </div>
      <div class="machine-bottom pix">
        <div class="collection-point pix"></div>
      </div>
    </div>
    <div class="control pix">
      <div class="cover left"></div>
      <div class="cover right"></div>
      <div class="cover bottom"></div>
      <div class="cover top">
        <div class="collection-arrow pix"></div>
      </div>
      <div class="collection-point pix"></div>
      <div class="dpad">
        <button class="dir-btn up-btn pix" aria-label="Up"></button>
        <button class="dir-btn left-btn pix" aria-label="Left"></button>
        <button class="dir-btn right-btn pix" aria-label="Right"></button>
        <button class="dir-btn down-btn pix" aria-label="Down"></button>
      </div>
      <button class="drop-btn pix" aria-label="Drop claw"></button>
    </div>
  </div>
</main>
