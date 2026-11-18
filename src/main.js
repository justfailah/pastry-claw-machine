/** Svelte application entry point and global stylesheet registration. */
import { mount } from 'svelte'
import App from './App.svelte'
import './game/machine.css'
import './game/leaderboard.css'
import './game/reward-progress.css'
import './game/start-screen.css'
import './game/prize-unbox.css'

mount(App, {
  target: document.getElementById('app'),
})