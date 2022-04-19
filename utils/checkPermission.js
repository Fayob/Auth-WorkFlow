const CustomError = require("../error-handlers");

const checkPermissions = (requestUser, resourceUserId) => {
  // console.log(requestUser);
  // console.log(resourceUserId);
  // console.log(typeof resourceUserId);

  if (requestUser.role === "admin") return;

  if (requestUser.userId === resourceUserId.toString()) return;
  throw new CustomError.UnauthorizedError(
    "Not Authorized to Access this Route"
  );
};

module.exports = checkPermissions;
