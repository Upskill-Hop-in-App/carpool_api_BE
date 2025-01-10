import User from "../models/userModel.js";
class UserInputDTO {
  constructor(data) {
    const { email, password, username, name, contact } = data;

    if (!email || !password || !username || !name || !contact) {
      throw new Error("MissingRequiredFields");
    }
    this.email = email;
    this.name = name;
    this.username = username;
    this.contact = contact;
  }

  async toUser() {
    return new User({
      email: this.email,
      name: this.name,
      username: this.username,
      contact: this.contact,
    });
  }
}

export default UserInputDTO;
