const UserRepository = require("./modules/user/user.repository");
const UserService = require("./modules/user/user.service");

const container = () => {
  const userRepository = new UserRepository();

  const userService = new UserService({
    userRepository,
  });

  return {
    userService,
  };
};

module.exports = container;