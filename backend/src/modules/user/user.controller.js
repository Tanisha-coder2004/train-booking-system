class UserController {
  constructor(userService) {
    this.userService = userService;
  }

  register = async (req, res, next) => {
    try {
      const { user, token } = await this.userService.register(req.body);

      res.status(200).json({
        token,
        user: this.sanitize(user),
      });
    } catch (err) {
      next(err);
    }
  };

  login = async (req, res, next) => {
    try {
      const { user, token } = await this.userService.login(req.body);

      res.status(200).json({
        token,
        user: this.sanitize(user),
      });
    } catch (err) {
      next(err);
    }
  };

  me = async (req, res, next) => {
    try {
      const user = await this.userService.getMe(req.user.id);

      res.status(200).json({
        user: this.sanitize(user),
      });
    } catch (err) {
      next(err);
    }
  };

  sanitize(user) {
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      age: user.age,
      gender: user.gender,
    };
  }
}

module.exports = UserController;