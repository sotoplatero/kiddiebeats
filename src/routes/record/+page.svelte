<script lang="ts">
    import { enhance, applyAction } from '$app/forms';
	import type { PageData, ActionData } from './$types';
    import { sleep } from '$lib/utils'
    import type { AudioInfo } from '$lib/utils'
	
	export let data: PageData;
	
	export let form: ActionData;

    let loading = false;
    let audios: AudioInfo[] = []

 	const submit = () => {
        loading = true
		return async ({ result }) => {
            loading = false
            await applyAction(result);
		};
	} 

    $: console.log(form )

    const wait = async () => {
        const startTime = Date.now();
        let lastResponse: AudioInfo[] = [];

        while (Date.now() - startTime < 100000) {
            const audioIds = audios.map( a=>a.id )
            const response = await fetch(`/audio?id=${audioIds}`);

            lastResponse = await response.json()
            const allCompleted = lastResponse.every(
                audio => audio.status === 'streaming' && audio.status === 'complete'
            );

            if (allCompleted) break;
            await sleep(3, 6);
        }
        audios = lastResponse;
    }

</script>

<form action="" method="POST" use:enhance={submit}>
    <label class="form-control w-full">
        <div class="label">Name</div>
        <input type="text" name="name" class="input input-bordered w-full" value="Diago" >
    </label>
    <label class="form-control w-full">
        <div class="label">Birthdate</div>
        <input type="text" name="birthdate" class="input input-bordered w-full" value="16 de mayo de 2018">
    </label>
    <label class="form-control w-full">
        <div class="label">Bio</div>
        <input type="text" name="quotes" class="input input-bordered w-full" value="travieso">
    </label>

    <button class="btn btn-primary mt-2">Record</button>
   
</form>

{#if loading} 
<div class="space-x-2">
    <span class="loading loading-dots loading-xs"></span>
    <span>Recording...</span>

</div>
    
{/if}
{#if form?.audios?.length}
<audio controls src={form.audios[0].audio_url}></audio>
<audio controls src={`/audio/${form.audios[0].id}.mp3`}></audio>

{/if}