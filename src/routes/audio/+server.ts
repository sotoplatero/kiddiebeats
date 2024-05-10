import { error , json} from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { sunoApi } from "$lib"; 

export const GET: RequestHandler = async ({ url  }) => {
    const ids =  url.searchParams.getAll('id')

    const audios = await (await sunoApi).get( ids )

	return json(audios)
};