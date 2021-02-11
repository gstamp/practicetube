<script>
    export let message;
</script>

<style>
    h2 {
        font-size: 2rem;
        text-align: center;
    }
</style>

<h2>🎮 {message} 🎮</h2>

<p>
    This player breaks down the Game Gengo videos into sections and lets you
    easily listen to the source audio or the explanations in the order you
    prefer.
</p>
<p>
    Press play to begin playing the video. By default it pauses at the end of
    each section of audio. Uncheck the "auto pause" checkbox if you just want to
    listen without pausing. If you'd like to skip the explanations you can
    simply check the "skip explanations" checkbox.
</p>
<p>
    Skiping to a section of interest is easy. You can click on the transcript on
    the right side or click the Next and Previous buttons. To jump immediately
    to the audio press the "Play/Replay Sentence" button.
</p>
<p>
    [ℹ] One annoyance I was not able to remove is the recommended videos popup
    that shows when the video is paused. There is a workaround however. If you
    have uBlock Origin installed. Click the uBlock Origin icon, click the gears
    to open the dashboard then navigate to the my filters section and add the
    following lines:
</p>
<pre
    style="margin-left: 1em;"><code>
youtube.com##.ytp-scroll-min.ytp-pause-overlay
youtube.com##.ytp-watermark
</code></pre>
<p>Click apply changes and hopefully your overlay should disappear.</p>
