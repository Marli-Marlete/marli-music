import { Player } from 'player/player';

export class YtPlayer implements Player {
	queue: any;

	play(): Promise<void> {
		return;
	}
	pause(): Promise<void> {
		return;
	}
	resume(): Promise<void> {
		return;
	}
	stop(): Promise<void> {
		return;
	}
}
