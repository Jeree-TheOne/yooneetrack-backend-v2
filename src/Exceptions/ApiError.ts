class ApiError extends Error {
  status: number;
  errors: any[];

  constructor(status: number, message: string, errors = []) {
    super(message)
    this.status = status
    this.errors = errors

    Object.setPrototypeOf(this, ApiError.prototype)
  }

  static Unauthorized() {
    return new ApiError(401, 'UNAUTHORIZED')
  }

  static ExpiredToken() {
    return new ApiError(401, 'EXPIRED_TOKEN')
  }

  static Forbidden(errors = []) {
    return new ApiError(403, 'FORBIDDEN', errors)
  }

  static BadRequest(message = 'Непредвиденная ошибка', errors = []) {
    return new ApiError(400, message, errors)
  }
}

export default ApiError