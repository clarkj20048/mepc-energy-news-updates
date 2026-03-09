function notFoundHandler(req, res, next) {
  const err = new Error("Page not found");
  err.status = 404;
  next(err);
}

function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  if (res.headersSent) {
    return next(err);
  }

  const isApiRequest = req.path.startsWith("/api");
  if (isApiRequest) {
    return res.status(status).json({
      ok: false,
      error: status === 500 ? "Internal server error" : err.message
    });
  }

  return res.status(status).type("text/plain").send(status === 404 ? "Page not found" : "Internal server error");
}

module.exports = {
  notFoundHandler,
  errorHandler
};
