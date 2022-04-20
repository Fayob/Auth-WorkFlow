const CustomAPIError = require("./custom-error");
const { StatusCodes } = require("http-status-codes");
class NotFoundError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.NOT_FOUND;
  }
}
/*
const NotFound = (req, res) => {
  res
    .status(StatusCodes.NOT_FOUND)
    .send("Path does not exist, check the link and try again");
}; */

module.exports = NotFoundError;
