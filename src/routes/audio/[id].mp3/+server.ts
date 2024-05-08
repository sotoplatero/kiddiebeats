import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {

    // https://audiopipe.suno.ai/?item_id=383996ce-705d-4713-8bd3-457021f02957
    const res = await fetch(`https://suno.com/${params.id}`)
    const audioBlob = await res.blob()

    console.log(audioBlob)
    let headers = new Headers({
        "Content-Disposition": 'attachment; filename="music.mp3"'
    });

	return new Response(audioBlob, { headers });
};