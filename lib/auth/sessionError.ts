/** Axios-normalized errors attach `status` from `lib/api.ts`. */
export function getErrorStatus(err: unknown): number | undefined {
    if (err && typeof err === "object" && "status" in err) {
        const s = (err as { status: unknown }).status;
        return typeof s === "number" ? s : undefined;
    }
    return undefined;
}
