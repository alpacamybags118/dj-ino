
import { anything, instance, mock, verify, reset, when, resetCalls } from 'ts-mockito';
import {CacheType, ClientUser, CommandInteraction, TextBasedChannel, TextBasedChannels } from "discord.js";
import Track from "../../../src/media/track";

let mockInteraction: CommandInteraction<CacheType>= mock<CommandInteraction<CacheType>>();
let mockChannel: TextBasedChannels = mock(TextBasedChannel)
let mockUser: ClientUser = mock(ClientUser);

// hate these stupid mocks

// TODO: see if we can make data to function validations working
when(mockChannel.send(anything())).thenResolve();
when(mockInteraction.channel).thenReturn(mockChannel)
describe('Track', () => {

  beforeEach(() => {
    resetCalls(mockInteraction);
    resetCalls(mockChannel);
    resetCalls(mockUser);
  })

  it('OnStart should call expected functions', async () => {
    const user = instance(mockUser);
    const interaction = instance(mockInteraction);
    const metadata = { 
      title: 'test', 
      description: 'test', 
      thumbnails: {
        default: {
          url: "test"
        },
        standard: {
          url: "test"
        },
      },
    }
    const track = new Track('someurl', metadata, interaction , user);

    track.OnStart();

    verify(mockInteraction.channel).once();
    verify(mockUser.setPresence(anything())).once();
  });

  it('OnEnd should call expected functions', async () => {
    const interaction = instance(mockInteraction);
    const user = instance(mockUser);

    const track = new Track('someurl', { title: 'test', description: 'test', thumbnails: {} }, interaction, user);

    await track.OnEnd();

    verify(mockInteraction.channel).once();
    verify(mockUser.setPresence(anything())).once();
  });
})