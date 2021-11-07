import { AudioResource, createAudioResource, demuxProbe } from '@discordjs/voice';
import { injectable } from 'inversify';
import createYtDlpAsProcess from '@alpacamybags118/yt-dlp-exec'
import Track from './track';
import { exec } from 'child_process'

@injectable()
export default class YoutubeDownloader {
  constructor(){}
  createAudioResource(track: Track): Promise<AudioResource<Track>> {
    return new Promise((resolve, reject) => {
			const process = createYtDlpAsProcess(
				track.url,
				{
					o: '-',
					q: '',
					f: 'bestaudio',
					preferFreeFormats: true,
					r: '100K',
				}
			);
			if (!process.stdout) {
				reject(new Error('No stdout'));
				return;
			}
			const stream = process.stdout;
			const onError = (error: Error) => {
				if (!process.killed) process.kill();
				stream.resume();
				reject(error);
			};
			process
				.once('spawn', () => {
					demuxProbe(stream)
						.then((probe) => resolve(createAudioResource(probe.stream, { metadata: track, inputType: probe.type })))
						.catch(onError);
				})
				.catch(onError);
		});
	}

	static async CleanUpAudioResource(): Promise<void> {
		return new Promise((resolve, reject) => {
			exec('ps -C yt-dlp -o pid=', (err, stdout, stderr) => {
				if (err) {
					// not too worried if we error here, but log it
					console.log(stderr)
				}

				if(stdout) {
					process.kill(stdout as unknown as number)
					resolve()
				}
			})
		})
	}
}