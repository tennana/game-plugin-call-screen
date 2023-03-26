<script>
	import CallScreen from "$lib/CallScreen.svelte";

	let show = false;
</script>


<h1>Welcome to CallScreen Test Page</h1>
<button on:click={() => show = !show} style="position:absolute;z-index: 100000000000">Toggle</button>
<CallScreen show={show} on:callEnd={show = false} on:callError={show = false} callsound="./Cell_Phone-Ringtone02-1.mp3" talksound="./Horagai01-6.mp3" endsound="./Telephone-Hardware01-1(Button).mp3"/>