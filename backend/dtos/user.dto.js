class UserDto {
    _id;
    phone;
    activated;
    createdAt;
  constructor(user) {
    this._id = user._id;
    this.email = user.email;
    this.activated = user.activated;
    this.role = user.role;
  }
}

module.exports = UserDto;