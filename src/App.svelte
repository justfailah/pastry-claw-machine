<script>
  import { onMount } from 'svelte'
  import { startMachine } from './machine.js'
  import LeaderboardPanel from './components/LeaderboardPanel.svelte'
  import ClawMachineView from './components/ClawMachineView.svelte'
  import RewardPanel from './components/RewardPanel.svelte'
  import StartScreen from './components/StartScreen.svelte'
  import PrizePopup from './components/PrizePopup.svelte'
  import GameOver from './components/GameOver.svelte'

  let machineRoot

  onMount(() => startMachine(machineRoot))
</script>

<svelte:head>
  <title>Pastry Claw Machine</title>
</svelte:head>

<div class="wrapper" bind:this={machineRoot}>
  <div class="game-layout">
    <LeaderboardPanel />
    <ClawMachineView />
    <RewardPanel />
  </div>
  <StartScreen />
  <PrizePopup />
  <GameOver />
</div>
