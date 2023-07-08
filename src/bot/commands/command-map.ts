import * as COMMANDS from './index';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ALL_COMMANDS: Record<string, any> = {
  search: COMMANDS.Search,
  play: COMMANDS.Play,
  pause: COMMANDS.Pause,
  resume: COMMANDS.Resume,
  skip: COMMANDS.Skip,
  stop: COMMANDS.Stop,
  queue: COMMANDS.ListQueue,
  help: COMMANDS.CommandHelp,
  shuffle: COMMANDS.Shuffle,
};
