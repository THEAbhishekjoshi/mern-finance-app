import {newUsers} from "../models/user.js";


const emailExistMiddleware = async (req, res, next) => {
  const email = req.body.email;
  const emailExist = await newUsers.findOne({ email });

  if (!emailExist) {
    return res.status(400).send("User with this email doesn't exist");
  }

  next();
};

export default emailExistMiddleware;
