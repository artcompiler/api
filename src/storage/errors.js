class StorageError extends Error { }
class NotFoundError extends StorageError { }

exports.StorageError = StorageError;
exports.NotFoundError = NotFoundError;
