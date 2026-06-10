export interface FigmaHttpErrorOptions {
  status: number;
  url: string;
  body?: string;
}

export class FigmaAuthError extends Error {
  status: 401 | 403;
  url: string;
  body?: string;

  constructor(message: string, options: FigmaHttpErrorOptions & { status: 401 | 403 }) {
    super(message);
    this.name = this.constructor.name;
    this.status = options.status;
    this.url = options.url;
    this.body = options.body;
  }
}

export class FigmaNotFoundError extends Error {
  status: 404;
  url: string;
  body?: string;

  constructor(message: string, options: FigmaHttpErrorOptions & { status: 404 }) {
    super(message);
    this.name = this.constructor.name;
    this.status = options.status;
    this.url = options.url;
    this.body = options.body;
  }
}

export class FigmaRateLimitError extends Error {
  status: 429;
  url: string;
  body?: string;
  retryAfter?: number;

  constructor(
    message: string,
    options: FigmaHttpErrorOptions & { status: 429; retryAfter?: number },
  ) {
    super(message);
    this.name = this.constructor.name;
    this.status = options.status;
    this.url = options.url;
    this.body = options.body;
    this.retryAfter = options.retryAfter;
  }
}
