<script lang="ts">
    import { enhance, applyAction } from '$app/forms';
	import type { PageData, ActionData } from './$types';
    import { sleep } from '$lib/utils'
    import type { AudioInfo } from '$lib/utils'
	
	export let data: PageData;
	
	export let form: ActionData;

    let loading = false;
    let recording = false;
    let audios: AudioInfo[] = []

 	const submit = () => {
        loading = true
		return async ({ result }) => {
            loading = false
            await applyAction(result);
            wait()
		};
	} 

    const wait = async () => {
        const startTime = Date.now();
        let lastResponse: AudioInfo[] = [];
        recording = true

        while (Date.now() - startTime < 100000) {
            const audioIds = form?.audios.map( a=>a.id )
            const response = await fetch(`/audio?id=${audioIds}`);

            lastResponse = await response.json()
            const allCompleted = lastResponse.every(
                audio => audio.status === 'complete'
            );

            if (allCompleted) {
                break
            };

            await sleep(3, 6);
        }
        
        recording = false
        audios = lastResponse;
    }


</script>

<form action="" method="POST" use:enhance={submit} class="mb-12 space-y-6">
    <label class="form-control w-full">
        <div class="label">Name</div>
        <input type="text" name="name" class="input input-bordered w-full" value="Diago" >
    </label>
    <label class="form-control w-full">
        <div class="label">Bio</div>
        <input type="text" name="quotes" class="input input-bordered w-full" value="travieso">
    </label>

    <button class="btn btn-primary">Record</button>
   
</form>

{#if loading} 
<div class="space-x-2">
    <div class="flex flex-col gap-4 w-52">
        <div class="flex gap-4 items-center">
          <div class="skeleton w-16 h-16 rounded-full shrink-0"></div>
          <div class="flex flex-col gap-4">
            <div class="skeleton h-4 w-20"></div>
            <div class="skeleton h-4 w-28"></div>
          </div>
        </div>
    </div>
</div>
    
{/if}
{#if form?.audios.length}
<div class="space-y-4">
    {#each form?.audios as audio}
        <audio controls src={audio.audio_url}></audio>
    {/each}

</div>
     <!-- content here -->
{/if}