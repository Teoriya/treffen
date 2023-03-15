const UserService = require("../services/user.service");
const jimp = require("jimp");
const path = require("path");
const userService = require("../services/user.service");
const UserDto = require("../dtos/user.dto");

class ActivateController {
  async activate(req, res) {
    const {name, avatar} = req.body;
    if (!name ) {
      return res.status(400).json({message: "Name not found"});
    }
    
    //Image Base64 to Image
    try {
      const user = await userService.getUserById(req.user._id);
      user.name = name;
      if(avatar){const buffer = Buffer.from(avatar.replace(   /^data:image\/\w+;base64,/,""), "base64");
      const image = await jimp.read(buffer);
      const fileName = `${Date.now()}-${Math.random()*1e9}.jpg`; //random file name
      const filePath = path.join(__dirname, `../public/profileImages/${fileName}`);
      image.resize(200, jimp.AUTO).write(filePath);     
      user.avatar = `/public/profileImages/${fileName}`;}
      user.activated = true;
      await user.save();
      res.json({user: new UserDto(user),auth: true})
    } catch (error) {
        res.status(500).json({message: "Could not activate user"});   
    }
    
    }
}

module.exports = new ActivateController();