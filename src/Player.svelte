<script lang="ts">
    import { getContext } from "svelte"
    import Youtube from "./Youtube.svelte"
    import type { Timestamps, SectionType } from "./timestamps"
    import HelpPopup from "./HelpPopup.svelte"

    export let subtitles: Array<[number, number, string]>
    export let timestamps: Timestamps
    export let debug: boolean = false

    const { open } = getContext("simple-modal")

    function showHelp() {
        open(HelpPopup, { message: "How do I use this?" })
    }

    function play() {
        if (playerState == "(playing)") {
            player.pause()
        } else {
            player.play()
        }
    }

    function playSentence() {
        section = Math.floor(section / 2) * 2
        player.seekTo(sentenceTimeForSection())
        player.play()
    }

    function previous() {
        if (section >= 1) {
            section--
            player.seekTo(timestamps.time(section).start)
            player.play()
        }
    }

    function next() {
        advanceSection()
        player.play()
    }

    function jumpToSection(idx: number) {
        section = idx
        player.seekTo(timestamps.time(section).start)
        player.play()
    }

    function advanceSection() {
        if (section + 1 >= timestamps.times().length) return
        section++
        if (watchOnly) {
            while (timestamps.time(section).mode == "review") section++
        }
        player.seekTo(timestamps.time(section).start)

        let elem = document.getElementById("subtitle-" + section)
        if (elem) {
            elem.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
            })
        }
    }

    function setCurrentTime(time: number) {
        currentTime = time
        if (playerState == "(playing)" && time >= timestamps.time(section).end) {
            if (autoPause) {
                player.pause()
            } else {
                advanceSection()
            }
        }
        currentSectionType = timestamps.time(section).mode
    }

    function playerStateChange({ detail }: { detail: any }) {
        playerState = detail
        if (playerState == "(playing)" && currentTime >= timestamps.time(section).end) {
            advanceSection()
        }
    }

    function ready() {
        player.seekTo(timestamps.time(section).start)
        player.play()
    }

    function sentenceTimeForSection() {
        let effectiveSection = Math.floor(section / 2) * 2

        let result = subtitles.find(
            ([from, _to, _sentence]) =>
                from >= timestamps.time(effectiveSection).start && from <= timestamps.time(effectiveSection).end
        )

        if (result) return result[0]
        else return null
    }

    $: {
        let sentenceTime = sentenceTimeForSection()
        playSentenceDisabled =
            (playerState != "(paused)" && playerState != "(playing)" && playerState != "(unstarted)") ||
            (playerState == "(playing)" && sentenceTime == null)
    }

    function calcPlayerLabel(playerState: PlayerState) {
        if (playerState == "(playing)") {
            return "Pause"
        } else if (playerState == "(paused)" || playerState == "(unstarted)") {
            return "Play"
        } else {
            return "Buffering..."
        }
    }

    $: playLabel = calcPlayerLabel(playerState)
    let sentenceLabel = "Play/Replay sentence"
    let playSentenceDisabled = true
    let autoPause = true
    let watchOnly = false
    let player: Youtube
    let currentTime = 0
    let section = 0
    type PlayerState = "(paused)" | "(playing)" | "(unstarted)" | "(buffering)"
    let playerState: PlayerState = "(unstarted)"
    let currentSectionType: SectionType = "watch"
</script>

<style>
    header {
        text-align: center;
        padding: 1em;
        background-color: #101010;
    }

    header > h1 {
        color: #ff3e00;
        text-transform: uppercase;
        font-size: 4em;
        font-weight: 100;
        margin: 0;
    }

    header > p {
        font-size: 1.3em;
        color: #bb3e00;
    }

    section {
        width: 100%;
        flex: 1;
        display: flex;
        flex-direction: row;
        overflow: hidden;
    }

    section > main {
        flex: 1;
        background-color: black;
        color: white;
        display: flex;
        flex-direction: column;
    }

    section > aside {
        max-width: 20em;
        min-width: 15em;
        background-color: #202020;
        color: whitesmoke;
        padding-left: 1em;
    }

    section > aside ul {
        list-style: none;
        margin: 0;
        padding: 0;
        overflow: scroll;
        height: 100%;
    }

    section > aside ul li {
        cursor: pointer;
        user-select: none;
    }

    .selected {
        background-color: #ff3e00;
    }

    .container {
        height: 100%;
        min-height: 100%;
        display: flex;
        flex-direction: column;
    }

    .controls {
        display: flex;
    }

    .player-controls {
        background-color: black;
        padding: 5px;
        flex: 1;
    }

    .review-controls {
        margin-right: 2em;
    }

    #playButton {
        width: 9em;
    }

    .help {
        float: right;
        color: white;
    }

    @media (min-width: 640px) {
        main {
            max-width: none;
        }
    }
</style>

<div class="container">
    <header>
        <h1>Japanese Practice</h1>
        <div class="help"><button on:click={showHelp}>Instructions</button></div>
        <p>
            Let's
            {currentSectionType}!
            {#if debug}
                Section:
                {section}
                Time:
                {currentTime.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                State:
                {playerState}
            {/if}
        </p>
    </header>

    <section>
        <main>
            <Youtube
                videoId="zbjakTmdBhM"
                bind:this={player}
                on:Ready={ready}
                on:PlayerStateChangeString={playerStateChange}
                on:currentPlayTime={(e) => setCurrentTime(e.detail)} />

            <div class="controls">
                <div class="player-controls">
                    <button id="playButton" class="green button" on:click={play}>{playLabel}</button>
                    <button
                        class="button"
                        disabled={playSentenceDisabled}
                        on:click={playSentence}>{sentenceLabel}</button>
                    <ul class="button-group">
                        <li><button class="blue button" on:click={previous}>Previous</button></li>
                        <li><button class="blue button" on:click={next}>Next</button></li>
                    </ul>
                </div>
                <div class="review-controls">
                    <label> <input type="checkbox" bind:checked={watchOnly} /> Skip explanations </label>
                    <label> <input type="checkbox" bind:checked={autoPause} /> Auto pause </label>
                </div>
            </div>
        </main>
        <aside>
            <ul>
                {#each timestamps.timesForMode('watch') as time, idx}
                    <li
                        id="subtitle-{idx * 2}"
                        class:selected={idx == Math.floor(section / 2)}
                        on:click={() => jumpToSection(idx * 2)}>
                        {idx + 1}:
                        {time.japanese}
                    </li>
                {/each}
            </ul>
        </aside>
    </section>
</div>
