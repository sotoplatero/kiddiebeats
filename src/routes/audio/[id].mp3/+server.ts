import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { FFmpeg } from '@ffmpeg/ffmpeg';

export const GET: RequestHandler = async ({ params }) => {
    try {
        // Fetch the original audio
        const res = await fetch(`https://suno.com/${params.item_id}`);
        const originalAudioBuffer = await res.arrayBuffer();
        // Initialize FFmpeg
        const ffmpeg = new FFmpeg();
        await ffmpeg.load();
        // Write the audio file to FFmpeg's virtual file system
        await ffmpeg.writeFile('input.mp3', new Uint8Array(originalAudioBuffer));

        // Run FFmpeg command to trim the audio to 60 seconds
        await ffmpeg.exec(['-i', 'input.mp3', '-t', '60', '-acodec', 'copy', 'output.mp3']);

        // Read the result
        const data = ffmpeg.FS('readFile', 'output.mp3');

        // Prepare headers
        const headers = new Headers({
            'Content-Type': 'audio/mpeg',
            'Content-Disposition': 'inline; filename="music_minute.mp3"'
        });

        // Return the trimmed audio
        return new Response(data, { headers });
    } catch (err) {
        console.error(err);
        throw error(500, 'Error processing audio');
    }
};