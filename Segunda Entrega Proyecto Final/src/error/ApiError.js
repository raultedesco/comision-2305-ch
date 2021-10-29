class ApiError {
    constructor(code, message) {
      this.code = code;
      this.message = {error:-1,descripcion:message};
    }
  
    static badRequest(msg) {
      return new ApiError(400, msg);
    }
    static notFound(msg) {
      return new ApiError(404, msg);
    }
  
    static internal(msg) {
      return new ApiError(500, msg);
    }
    static not_authorize(msg) {
      return new ApiError(401, msg);
    }
  }
  
  module.exports = ApiError;