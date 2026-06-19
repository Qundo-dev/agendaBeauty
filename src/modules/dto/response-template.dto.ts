export class ResponseTemplate<T = unknown> {
  constructor(
    public readonly statusCode: number,
    public readonly message: string,
    public readonly data: T,
  ) {}
}