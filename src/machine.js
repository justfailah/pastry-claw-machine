/** Lifecycle adapter that creates and disposes the OOP game controller. */
import { ClawMachineGame } from './game/Game.js'

/** Mounts the game controller and returns its teardown callback. */
export function startMachine(root) {
  const game = new ClawMachineGame(root)
  return () => game.destroy()
}