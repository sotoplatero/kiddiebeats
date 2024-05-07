import type { Actions } from './$types';
import { openai } from '$lib'
import { extract } from '@extractus/article-extractor'
import { sunoApi } from "$lib"; 

export const actions = {
	default: async ({request}) => {
        const formData = await request.formData()
        const url = formData.get("url")

        const { content, title } = await extract(url)

        const chat = await openai.chat.completions.create({
            model:"gpt-3.5-turbo",
            messages:[{"role": "user", "content": `Hazme un resumen de 1200 caracteres:\n\n ${content}`}]
        })

        const lyric = chat.choices[0].message.content;
        // const prompt = `Cuban son song with the following lyrics:\n ${lyric}`

        const tags = 'son cubano'
        const instrumental = false
        const wait_audio = true
        const audios = await (await sunoApi).custom_generate( lyric, tags, title, instrumental, wait_audio )
        // console.log(audios)

        return { audios }
	},
} satisfies Actions;