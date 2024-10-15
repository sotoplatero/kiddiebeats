import type { Actions } from './$types';
import { sunoApi } from "$lib"; 

export const actions = {
	default: async ({request}) => {
        
                const formData = await request.formData()
                const name = formData.get("name")
                const quotes = formData.get("text")

                const prompt = `Cancion de cumpleanos dedicada a ${name}`

                const audios = await (await sunoApi).generate(prompt)    

                return { audios }
	},
} satisfies Actions;