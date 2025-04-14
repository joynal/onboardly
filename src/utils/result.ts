export type Result<T, E = undefined> = { ok: true; value: T } | { ok: false; error: E };

export function ok<T>(data: T): Result<T, never>;
export function ok(): Result<undefined, never>;
export function ok<T>(data?: T) {
    return { ok: true, value: data } as Result<T, never>;
}

export function err<E>(error: E): Result<never, E> {
    return { ok: false, error };
}
