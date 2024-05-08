import type { Actions } from './$types';
import { openai } from '$lib'
import { extract } from '@extractus/article-extractor'
import { sunoApi } from "$lib"; 

export const actions = {
	default: async ({request}) => {
        const formData = await request.formData()
        const name = formData.get("name")
        const birthdate = formData.get("birthdate")
        const quotes = formData.get("quotes")

        // const { content, title } = await extract(url)

        const chat = await openai.chat.completions.create({
            model:"gpt-3.5-turbo",
            messages:[{"role": "user", "content": `Escribe una canción de cumpleaños para "${name}" quien cumpleaños el ${birthdate} utilizando las siguientes frases ${quotes}`}]
        })

        const lyric = chat.choices[0].message.content;
        // const prompt = `Cuban son song with the following lyrics:\n ${lyric}`

        const tags = 'son cubano'
        const instrumental = false
        const wait_audio = true

        // const audios = await (await sunoApi).custom_generate( lyric, tags, title, instrumental, wait_audio )
        const res = await fetch('http://localhost:8000/generate',{
            method:"POST",
            body: JSON.stringify({
                "prompt": lyric,
                "mv": "chirp-v3-0",
                "title": name,
                "tags": tags,
                "continue_at": "None",
                "continue_clip_id": "None"                

            })
        })
        // console.log(res)

        const audios = await res.json()

        return { audios }
	},
} satisfies Actions;