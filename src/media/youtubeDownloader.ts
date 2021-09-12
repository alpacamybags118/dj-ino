import { AudioResource, createAudioResource, demuxProbe } from '@discordjs/voice';
import { injectable } from 'inversify';
import {raw} from 'youtube-dl-exec';
import Track from './track';

@injectable()
export default class YoutubeDownloader {
  constructor(){}
  // this is copy + paste code from the library examples. need to understand it fully so i can make it better/ easier to read
  createAudioResource(track: Track): Promise<AudioResource<Track>> {
    return new Promise((resolve, reject) => {
			const process = raw(
				track.url,
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
						.then((probe) => resolve(createAudioResource(probe.stream, { metadata: track, inputType: probe.type })))
						.catch(onError);
				})
				.catch(onError);
		});
	}
}