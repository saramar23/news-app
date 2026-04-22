const MIN_INTERVAL_MS = 1100;

let queue: Promise<void> = Promise.resolve();

export function runGNewsThrottled<T>(operation: () => Promise<T>): Promise<T> {
    const run = queue.then(() => operation());
    queue = run.then(
        () => new Promise<void>((resolve) => setTimeout(resolve, MIN_INTERVAL_MS)),
        () => new Promise<void>((resolve) => setTimeout(resolve, MIN_INTERVAL_MS))
    );
    return run;
}
