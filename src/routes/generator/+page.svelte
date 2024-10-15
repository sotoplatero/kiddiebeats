<script lang="ts">
    import { enhance, applyAction } from '$app/forms';
	import type { PageData, ActionData } from './$types';
    import { sleep } from '$lib/utils'
    import type { AudioInfo } from '$lib/utils'
    import { onMount } from 'svelte';
	
	export let data: PageData;
	
	export let form: ActionData;

    let loading = false;
    let recording = false;
    let audios: AudioInfo[] = []

 	const submit = () => {
        
		return async ({ result }) => {
            await applyAction(result);
            wait()
		};
	} 

    onMount(async () => {
        
        wait()
    })
    
    $: validAudios = audios?.every( a => a.status === 'streaming' || a.status === 'complete' )
    $: if(validAudios) {
        loading = false
    }
    
    const wait = async () => {
        loading = true
        const startTime = Date.now();
        audios = form?.audios ?? [];
        // let lastResponse: AudioInfo[] = [];
        
        while (Date.now() - startTime < 100000) {
            const audioIds = form?.audios?.map(a => a.id) ?? [];
            console.log(audioIds)
            const response = await fetch(`/audio?id=${audioIds}`);
            
            audios = await response.json()
            const allCompleted = audios.every(
                audio => audio.status === 'complete'
            );

            if (allCompleted) {
                break
            };

            await sleep(3, 6);
        }

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

{#if loading } 
    <div class="space-y-4">
        
        <div class="flex flex-col gap-4 w-52">
            <div class="flex gap-4 items-center">
            <div class="skeleton w-16 h-16 rounded-full shrink-0"></div>
            <div class="flex flex-col gap-4">
                <div class="skeleton h-4 w-20"></div>
                <div class="skeleton h-4 w-28"></div>
            </div>
            </div>
        </div>

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

{#if validAudios}
    <div class="space-y-4">
        {#each audios as audio}
            <audio controls src={audio.audio_url}></audio>
            
        {/each}

    </div>
{/if}