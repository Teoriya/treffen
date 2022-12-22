const UserModel = require("../models/user.model");

class UserService {
  async getUserByPhoneNumber(phone) {
    try {
      const user = await UserModel.findOne({
        phone: phone,
      });
      return user;
    } catch (error) {
      console.log(error); //better error handling can be implemented later
      return null;
    }
  }

  async createUser(data) {
    try {
      const user = await UserModel.create(data);
      return user;
    } catch (error) {
      console.log(error); //better error handling can be implemented later
      return null;
    }
  }

  async getUserById(id) {
    try {
      const user = await UserModel.findById(id);
      return user;
    } catch (error) {
      console.log(error); //better error handling can be implemented later
      return null;
    }
  }
}
module.exports = new UserService();
