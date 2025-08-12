import jwt from "jsonwebtoken";

import dotenv from "dotenv";
dotenv.config();

type UserId = {
  user_id: string;
};

export const generateToken = (user_id: UserId) => {
  const token = jwt.sign(user_id, process.env.JWT_SECRET as string, {
    expiresIn: "1d",
  });
  // console.log(token)

  return token;
};
