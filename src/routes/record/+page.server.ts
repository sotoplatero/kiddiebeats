import type { Actions } from './$types';
import { sunoApi } from "$lib"; 

export const actions = {
	default: async ({request}) => {
        
        const formData = await request.formData()
        const name = formData.get("name")
        const quotes = formData.get("quotes")

        const prompt = `Cancion dedicada a una niña/niño ${name} que contenga: ${quotes}`

        const instrumental = false
        const wait_audio = true

        const audios = await (await sunoApi).generate( prompt, instrumental, wait_audio )

        return { audios }
	},
} satisfies Actions;