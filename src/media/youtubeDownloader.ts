import { AudioResource, createAudioResource, demuxProbe } from '@discordjs/voice';
import {raw} from 'youtube-dl-exec';

export default class YoutubeDownloader {
  constructor(){}
  // this is copy + paste code from the library examples. need to understand it fully so i can make it better/ easier to read
  createAudioResource(uri: string): Promise<AudioResource> {
    return new Promise((resolve, reject) => {
			const process = raw(
				uri,
				{
					o: '-',
					q: '',
					f: 'bestaudio[ext=webm+acodec=opus+asr=48000]/bestaudio',
					r: '100K',
				},
				{ stdio: ['ignore', 'pipe', 'ignore'] },
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
						.then((probe) => resolve(createAudioResource(probe.stream, { metadata: this, inputType: probe.type })))
						.catch(onError);
				})
				.catch(onError);
		});
	}
}