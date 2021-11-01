
import { mock } from 'ts-mockito';
import { CacheType, ClientUser, CommandInteraction } from "discord.js";
import Track from "../../../src/media/track";
import TrackQueue from "../../../src/media/trackQueue"

let mockInteraction: CommandInteraction<CacheType>= mock(CommandInteraction);
let mockUser: ClientUser = mock(ClientUser);

describe('TrackQueue', () => {
  let trackQueue: TrackQueue;
  let trackList: Track[] = [new Track('someurl', { title: 'test', description: 'test', thumbnails: {} }, mockInteraction, mockUser), new Track('someurl2', { title: 'test', description: 'test', thumbnails: {} }, mockInteraction, mockUser)]
  beforeEach(() => {
    trackQueue = new TrackQueue();
    trackQueue.Enqueue(trackList[0]);
    trackQueue.Enqueue(trackList[1]);
  });

  it('should return the correct length of the queue', () => {
    expect(trackQueue.Length()).toEqual(2);
  });

  it('should return the expected queue', () => {
    const queue = trackQueue.GetCurrentQueue();

    expect(queue).toEqual(trackList);
  });

  it('should add a new item to the queue', () => {
    const track = new Track('someurl3', { title: 'test', description: 'test', thumbnails: {} }, mockInteraction, mockUser)
    trackQueue.Enqueue(track);

    expect(trackQueue.Length()).toEqual(3);
    expect(trackQueue.GetCurrentQueue()[2]).toEqual(track);
  });

  it('should clear the queue', () => {
    trackQueue.Clear();

    expect(trackQueue.Length()).toEqual(0);
  });

  it('should dequeue by removing the top item from the queue', () => {
    const track = trackQueue.Dequeue();

    expect(trackQueue.Length()).toEqual(1);
    expect(track).toEqual(trackList[0])
    expect(trackQueue.GetCurrentQueue()[0]).toEqual(trackList[1]);

  });

  it('should not error when dequeue is called on an empty queue', () => {
    trackQueue.Clear();
    const track = trackQueue.Dequeue();

    expect(trackQueue.Length()).toEqual(0);
    expect(track).toEqual(undefined);

  });
})