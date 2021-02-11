<script context="module">
    let iframeApiReady = false

    import { setContext, onMount } from "svelte"
    var tag = document.createElement("script")
    tag.src = "https://www.youtube.com/iframe_api"
    var firstScriptTag = document.getElementsByTagName("script")[0]
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)

    window.onYouTubeIframeAPIReady = () => window.dispatchEvent(new Event("iframeApiReady"))
</script>

<script>
    import { createEventDispatcher } from "svelte"
    import { getContext } from "svelte"
    export let videoId
    let player
    let divId = "player_" + parseInt(Math.random() * 109999)
    export function play() {
        player.playVideo()
    }
    export function pause() {
        player.pauseVideo()
    }
    export function seekTo(seconds) {
        player.seekTo(seconds)
    }
    const dispatch = createEventDispatcher()
    window.addEventListener("iframeApiReady", function (e) {
        player = new YT.Player(divId, {
            videoId,
            width: "100%",
            height: "100%",
            playerVars: {
                controls: 0,
                enablejsapi: 1,
                playsinline: 1,
                start: 0,
                disablekb: 0,
            },
            events: {
                onReady: playerIsReady,
                onStateChange: playerStateChange,
            },
        })
    })
    function playerStateChange({ data }) {
        dispatch("PlayerStateChange", data)
        let strReturn = ""
        if (data == -1) {
            strReturn = "(unstarted)"
        }
        if (data == 0) {
            strReturn = "(ended)"
        }
        if (data == 1) {
            strReturn = "(playing)"
        }
        if (data == 2) {
            strReturn = "(paused)"
        }
        if (data == 3) {
            strReturn = "(buffering)"
        }
        if (data == 5) {
            strReturn = "(video cued)."
        }
        dispatch("PlayerStateChangeString", strReturn)
    }
    function playerIsReady() {
        dispatch("Ready")
        setInterval(() => {
            dispatch("currentPlayTime", player.getCurrentTime())
        }, 150)
    }
</script>

<div id={divId} />
