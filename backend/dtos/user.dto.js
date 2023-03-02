class UserDto {
  _id;
  phone;
  activated;
  avatar;
  name;
  createdAt;
  constructor(user, masked = false) {
    try {
      if (!user) return;
      this._id = user._id;
      this.phone = masked ? ("*******" + user.phone % 1000) : user.phone;
      this.activated = user.activated;
      this.avatar = user.avatar ? `${process.env.BASE_URL}:${process.env.PORT}${user.avatar}` : null;
      this.name = user.name;
      this.createdAt = user.createdAt;
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = UserDto;