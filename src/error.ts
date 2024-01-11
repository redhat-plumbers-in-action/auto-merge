export class AutoMergeError extends Error {
  constructor(
    message: string,
    readonly code?: number
  ) {
    super(message);
  }
}
