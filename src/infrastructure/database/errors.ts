export class DatabaseError extends Error {
  constructor(
    message: string,
    public readonly originalError?: unknown,
  ) {
    super(message)
    this.name = 'DatabaseError'
  }
}

export class DatabaseInitError extends DatabaseError {
  constructor(message: string = 'Failed to initialize database', originalError?: unknown) {
    super(message, originalError)
    this.name = 'DatabaseInitError'
  }
}

export class DatabaseTransactionError extends DatabaseError {
  constructor(
    public readonly operation: string,
    message?: string,
    originalError?: unknown,
  ) {
    super(message || `Failed to ${operation}`, originalError)
    this.name = 'DatabaseTransactionError'
  }
}

export class NotFoundError extends DatabaseError {
  constructor(
    public readonly resourceId: string,
    message?: string,
  ) {
    super(message || `Resource with ID '${resourceId}' not found`)
    this.name = 'NotFoundError'
  }
}
