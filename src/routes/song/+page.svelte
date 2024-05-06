<script lang="ts">
    import { enhance } from '$app/forms';
    import Layout from '../+layout.svelte';
	import type { PageData, ActionData } from './$types';
	
	export let data: PageData;
	
	export let form: ActionData;

    let loading = false;
    let songs = [];

	const submit = () => {
        loading = true
		return async ({ result, update }) => {

		};
	} 

</script>

<form action="" method="POST" use:enhance={submit}>
    <input type="url" name="url" class="border w-full p-4" value="https://nodejs.org/en/about">
    <button class="border">Canta!!</button>
</form>

{#if loading} loading...{/if}
{#if songs}
    <audio controls src={form.songs[0].audio_url}></audio>
    <audio controls src={form.songs[1].audio_url}></audio>
{/if}