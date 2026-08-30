import jwt from "jsonwebtoken";

const accessSecret = process.env.JWT_ACCESS_SECRET!;
const refreshSecret = process.env.JWT_REFRESH_SECRET!;

export const generateAccessToken = (userId: string, role: string) => {
   return jwt.sign(
      {
         userId,
         role,
      },
      accessSecret,
      {
         expiresIn: "15m",
      }
   );
};

export const generateRefreshToken = (userId: string) => {
   return jwt.sign(
      {
         userId,
      },
      refreshSecret,
      {
         expiresIn: "7d",
      }
   );
};

export const verifyAccessToken = (token: string) => {
   return jwt.verify(token, accessSecret) as {
      userId: string;
      role: string;
   };
};

export const verifyRefreshToken = (token: string) => {
   return jwt.verify(token, refreshSecret) as {
      userId: string;
   };
};