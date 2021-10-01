const ApiError = require('./ApiError');

function apiCustom404Handler (req, res, next) {

    next(ApiError.notFound(`404 - Not Found`));

  };

module.exports = apiCustom404Handler;