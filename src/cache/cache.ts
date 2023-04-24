export class FakeCache {
	get: () => [{ key: string; value: string }];
	set: () => void;
}
