export class ThuunError extends Error {}

export class UnauthorizedError extends ThuunError {}

export class NotFoundError extends ThuunError {}

export class ConflictError extends ThuunError {}

export class BadRequestError extends ThuunError {}
