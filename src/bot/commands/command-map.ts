import { CommandHelp } from './command-help';
import { ListQueue } from './command-list-queue';
import { Pause } from './command-pause';
import { Play } from './command-play';
import { Resume } from './command-resume';
import { Search } from './command-search';
import { Skip } from './command-skip';
import { Stop } from './command-stop';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ALL_COMMANDS: Record<string, any> = {
  search: Search,
  play: Play,
  pause: Pause,
  resume: Resume,
  skip: Skip,
  stop: Stop,
  queue: ListQueue,
  help: CommandHelp,
};
