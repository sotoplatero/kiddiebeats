<script lang="ts">
    import { enhance, applyAction } from '$app/forms';
    import Layout from '../+layout.svelte';
	import type { PageData, ActionData } from './$types';
	
	export let data: PageData;
	
	export let form: ActionData;

    let loading = false;

 	const submit = () => {
        loading = true
		return async ({ result }) => {
            loading = false
            await applyAction(result);
		};
	} 

    $: console.log(form )

</script>

<form action="" method="POST" use:enhance={submit}>
    <input type="url" name="url" class="border w-full p-4" value="https://havananiagara.ca/our-chef/">
    <button class="border">Canta!!</button>
</form>

{#if loading} Recording...{/if}
{#if form?.audios?.length}
    <audio controls src={`https://cdn1.suno.ai/${form.audios[0].id}.mp3`}></audio>
    <audio controls src={`https://cdn1.suno.ai/${form.audios[1].id}.mp3`}></audio>
{/if}