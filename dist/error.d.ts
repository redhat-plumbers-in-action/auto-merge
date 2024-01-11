export declare class AutoMergeError extends Error {
    readonly code?: number | undefined;
    constructor(message: string, code?: number | undefined);
}
