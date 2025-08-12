import jwt from "jsonwebtoken";
import config from "../config/config";

type UserId = {
  user_id: string;
};

export const generateToken = (user_id: UserId) => {
  const token = jwt.sign(user_id, config.jwtSecret, {
    expiresIn: "1d",
  });

  return token;
};
