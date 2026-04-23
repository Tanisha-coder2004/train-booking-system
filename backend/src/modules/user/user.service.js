const bcrypt = require("bcrypt");
const { generateToken } = require("../../shared/utils/jwt");

class UserService {
  constructor({ userRepository }) {
    this.userRepository = userRepository;
  }

  async register(data) {
    const { name, email, password, age, gender } = data;

    // Minimal validation
    if (!name || !email || !password || !age || !gender) {
      throw { status: 400, message: "All fields are required" };
    }

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw { status: 409, message: "Email already registered" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      age,
      gender,
    });

    const token = generateToken(user);

    return { user, token };
  }

  async login({ email, password }) {
    if (!email || !password) {
      throw { status: 400, message: "Email and password required" };
    }

    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw { status: 401, message: "Invalid email or password" };
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw { status: 401, message: "Invalid email or password" };
    }

    const token = generateToken(user);

    return { user, token };
  }

  async getMe(userId) {
    const user = await this.userRepository.findById(userId);
    return user;
  }
}

module.exports = UserService;