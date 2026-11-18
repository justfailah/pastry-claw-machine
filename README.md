# Pastry Claw Machine

A mini browser game built with Svelte and Vite for my partner. Move the claw to collect pastries, build combos, avoid chillis and unlock tiered rewards before the 60-second round ends.

## Features

- Start each round from a blurred intro screen where the timer begins when the player starts.
- Move the claw horizontally and vertically then drop it to collect an item.
- Collect regular pastries for points, build streak combos and grab golden pastries for bonus points.
- Avoid chilli which subtracts a point and breaks the current combo.
- Unlock the first prize at 6 points and the second at 15.
- Save round scores to a leaderboard stored in the current browser.
- Play on desktop, tablet or mobile with a responsive layout.

## Technology stack

- Frontend — Svelte 5, Vite 8, JavaScript, CSS
- Game architecture — ES modules and object-oriented game classes
- Local storage — browser `localStorage` for leaderboard entries

## Project layout

```text
Assets/
  beignet.png
  chilli_after.png
  chilli_before.png
  egg_tart.png
  lemon_tart.png
  pretzel.png
  tiramisu.png
index.html              Vite HTML entry point
package.json            Scripts and project dependencies
package-lock.json       Locked npm dependency versions
svelte.config.js         Svelte compiler configuration
vite.config.js           Vite and Svelte plugin configuration
src/
  main.js                Application entry point and global stylesheets
  App.svelte             App shell and game lifecycle
  machine.js             Game-controller lifecycle adapter
  components/
    ClawMachineView.svelte
    GameOver.svelte
    LeaderboardPanel.svelte
    PrizePopup.svelte
    RewardPanel.svelte
    StartScreen.svelte
  game/
    Game.js               Round controller and game flow
    WorldObject.js        Shared movement and positioning behavior
    Prize.js              Base class for collectible items
    Pastry.js             Regular pastry prize
    GoldenPastry.js       Bonus pastry variant
    Chilli.js             Negative prize variant
    Button.js             Press-and-hold machine controls
    ScoreManager.js       Points and combo rules
    Leaderboard.js        Local score storage and display
    PrizeUnbox.js         Reward thresholds and prize popups
    GameEffects.js        Score labels and collection particles
    geometry.js           Grid placement and collision helpers
    *.css                 Machine, panel, and overlay styles
```

## Run locally

Node.js and npm are required.

From the project root:

```bash
npm install
npm run dev
```

Open the local URL shown in the terminal, usually `http://localhost:5173`.

## Production build

From the project root:

```bash
npm run build
npm run preview
```

Leaderboard entries are stored only in the current browser and are not shared across devices.
