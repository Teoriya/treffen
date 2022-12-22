class UserDto {
    _id;
    phone;
    activated;
    avatar;
    name;
    createdAt;
  constructor(user) {
    this._id = user._id;
    this.phone = user.phone;
    this.activated = user.activated;
    this.avatar = user.avatar? `${process.env.BASE_URL}:${process.env.PORT}${user.avatar}` : null;
    this.name = user.name;
    this.createdAt = user.createdAt;
  }
}

module.exports = UserDto;