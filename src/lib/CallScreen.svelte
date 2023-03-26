<svelte:options tag="sound-call-screen"></svelte:options>
<script lang="ts">
    import {createEventDispatcher, onMount, tick} from "svelte";
    import {get_current_component} from "svelte/internal";
    import {fade} from "svelte/transition";
    import DefaultFace from '../assets/smiled.svg';
    import ReceiveImg from '../assets/call-calling.svg'
    import DisconnectImg from '../assets/call-decline.svg';

    export let show: boolean = false;
    export let name: string = "番号非通知";
    export let face: string = DefaultFace;
    export let callsound: string;
    export let talksound: string;
    export let endsound: string;
    export let callwaitmillisecond: number = -1;
    let callTime: string = "00:00";

    let inTalk: boolean = false;
    let callAudio: HTMLAudioElement;
    let talkAudio: HTMLAudioElement;
    let endAudio: HTMLAudioElement;
    let receiveElement: HTMLImageElement | null;
    let disconnectElement: HTMLImageElement;

    let callingPromise: Promise<void>;

    const component = get_current_component();
    const originalDispatch = createEventDispatcher();

    const dispatch = (name, detail) => {
        originalDispatch(name, detail);
        component?.$$.root.dispatchEvent(new CustomEvent(name, {detail, composed: true}));
    }

    function rippleAnimate(element: HTMLElement) {
        if(!element) {
            return Promise.resolve();
        }
        return new Promise(resolve => {
            element.classList.add("ripple");
            element.addEventListener('transitionend', () => {
                element.classList.remove("ripple");
                tick().then(resolve);
            }, {once: true});
            setTimeout(resolve, 1000);
        });
    }

    async function playSound(audio: HTMLAudioElement): Promise<unknown> {
        if (!show || !audio || !audio.src) {
            return;
        }
        audio.pause();
        const promise = audio.play();
        if (promise) {
            try {
                await promise;
            } catch (e) {
                return Promise.reject({name: e.name, message: audio.src + " - " + e.message});
            }
        }
        return new Promise(resolve => {
            audio.addEventListener("ended", function () {
                resolve();
            }, {once: true});
        })
    }

    function createCallingPromise(playPromise: Promise<unknown>) {
        return new Promise((resolve, reject) => {
            const timeout = Number(callwaitmillisecond);
            playPromise.catch(reject);
            callAudio.addEventListener("stalled", reject, {once: true});
            if (timeout <= 0) {
                playPromise.then(resolve);
                return;
            }
            callAudio.addEventListener("play", function () {
                setTimeout(() => {
                    callAudio.pause();
                    resolve();
                }, timeout);
            }, {once: true});
        });
    }

    async function sequence() {
        inTalk = false;
        callTime = "00:00";
        if(!callAudio) {
            return tick().then(sequence);
        }
        callAudio.addEventListener("play", function () {
            dispatch("callStart", callsound);
        }, {once: true});
        const playPromise = playSound(callAudio);
        callingPromise = createCallingPromise(playPromise).then(() => rippleAnimate(receiveElement!));
        try {
            await callingPromise;
        } catch (e) {
            console.error(e);
            dispatch("callError", e);
            return;
        }
        inTalk = true;
        dispatch("talkStart", talksound);
        await playSound(talkAudio);
        dispatch("talkEnd", talksound);
        await Promise.all([playSound(endAudio), rippleAnimate(disconnectElement)]);
        show = false;
    }

    $: if(show) {
        sequence();
    }

    function onTimeUpdate(ev: Event) {
        const time = (ev.target as HTMLAudioElement).currentTime;
        callTime = ("0" + Math.floor(time / 60)).slice(-2) + ":" + ("0" + Math.ceil(time % 60)).slice(-2);
    }

</script>
{#if show}
    <div class="callScreen-background">
        <audio bind:this={callAudio} src={callsound} autoplay preload="auto"></audio>
        <audio bind:this={talkAudio} src={talksound} preload="auto" on:timeupdate={onTimeUpdate}></audio>
        <audio bind:this={endAudio} src={endsound} preload="auto"></audio>
        <div transition:fade class="callScreen-root" class:talking={inTalk}
             on:outroend={() => dispatch("callEnd", talksound)}>
            <div class="callScreen-face">
                {#if face}
                    <img src={face} alt={`${name}のアイコン`}>
                {:else}
                    <img src={DefaultFace} alt={`${name}のアイコン`}>
                {/if}
            </div>
            <div class="callScreen-name">{name}</div>
            <div class="callScreen-actions">
                {#if inTalk === false}
                    <img src={ReceiveImg} alt="受電ボタン" bind:this={receiveElement}>
                {/if}
                <img src={DisconnectImg} bind:this={disconnectElement} alt="終話ボタン">
                {#if false}
                    <img class:ripple={true} alt="work around"/>
                {/if}
            </div>
            {#if inTalk}
                <div class="callScreen-callTime">
                    {callTime}
                </div>
            {/if}
            {#await callingPromise catch error}
                {#if error.name === "NotAllowedError"}
                    <div class="error">
                        <p>この場面では音声が再生されます。</p>
                        <button type="button" on:click={sequence(callAudio)}>
                            音声を再生
                        </button>
                    </div>
                {:else}
                    <div class="error">
                        <p>再生エラー: {error.message}</p>
                        <button type="button" on:click={sequence(callAudio)}>
                            再試行
                        </button>
                    </div>
                {/if}
            {/await}
        </div>
    </div>
{/if}

<style>
    .callScreen-root {
        position: relative;
        margin: 12.5vh auto;
        background-color: #e6e6e6;
        border-radius: 5%;
        width: 85%;
        height: 75%;
        font-size: initial;
        color: black;
    }

    .talking {
        background-color: #133441;
    }

    .callScreen-root > .callScreen-face {
        margin: 0 auto;
        padding: 5rem 0 1rem 0;
        width: 350px;
    }
    .callScreen-root.talking > .callScreen-face {
        width: 270px;
    }
    @supports (width: min(10vmin, 5vh)) {
        .callScreen-root > .callScreen-face {
            max-width: 35vh;
            max-height: 40vh;
            padding-top: 6vh;
        }
        .callScreen-root.talking > .callScreen-face {
            max-width: 25vh;
        }
        .callScreen-root > .callScreen-face {
            padding: min(8rem, 8vh) 0 min(1rem, 1vh) 0;
        }
    }

    .callScreen-face > img {
        width: 100%;
        object-fit: contain;
    }

    .callScreen-name {
        position: absolute;
        bottom: 32%;
        width: 100%;
        text-align: center;
        font-size: xx-large;
    }

    .talking > .callScreen-name {
        position: static;
        bottom: initial;
        font-size: x-large;
        color: white;
    }

    .callScreen-callTime {
        position: absolute;
        bottom: 32%;
        width: 100%;
        text-align: center;
        font-size: xx-large;
    }

    .talking > .callScreen-callTime {
        color: white;
    }

    .callScreen-actions {
        position: absolute;
        bottom: 12%;
        left: 50%;
        right: 50%;
        height: 6rem;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }

    .callScreen-actions > img {
        height: 100%;
        cursor: not-allowed;
        margin: 0 12.5%;
    }

    .callScreen-actions > img.ripple {
        filter: brightness(1.3);
        transition: filter 0.6s;
    }

    .callScreen-background {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 999999;
        background: rgba(0, 0, 0, 0.3);
    }

    .error {
        position: relative;
        top: 10%;
        margin: 2em;
        padding: 2em;
        background: lightgray;
        color: black;
        text-align: center;
    }

    .error > button {
        font-size: xx-large;
    }

    @media screen and (min-width: 600px) {
        .callScreen-root {
            width: 500px;
        }

        .callScreen-root > .callScreen-actions > img {
            margin: 0 8vh;
        }
    }

    @media screen and (max-width: 400px) {
        .callScreen-root > .callScreen-face {
            width: 65%;
        }

        .callScreen-root > .callScreen-actions {
            height: 12vh;
        }
        .callScreen-root > .callScreen-actions > img {
            margin: 0 6vw;
        }

        .callScreen-root.talking > .callScreen-face {
            width: 50%;
        }
    }
</style>