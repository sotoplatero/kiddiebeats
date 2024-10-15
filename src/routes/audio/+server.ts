import { error , json} from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { sunoApi } from "$lib"; 

export const GET: RequestHandler = async ({ url  }) => {
    const ids =  url.searchParams.getAll('id')

    // Filter out empty strings and trim whitespace
    const validIds = ids.filter(id => id.trim().length > 0).map(id => id.trim());

    if (validIds.length === 0) {
        return json([])
    }

    const audios = await (await sunoApi).get( ids )
    // audios.forEach(a => a.audio_url = a.audio_url?.replace("https://audiopipe.suno.ai/", "/audio/"))

	return json(audios)
};