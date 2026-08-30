import bcrypt from "bcrypt";
import prisma from "../config/prisma.js";
import {
   generateAccessToken,
   generateRefreshToken,
} from "../utils/jwt.js";

export const registerUser = async (
   name: string,
   email: string,
   password: string
) => {
   const existingUser = await prisma.user.findUnique({
      where: { email },
   });

   if (existingUser) {
      throw new Error("User already exists");
   }

   const hashedPassword = await bcrypt.hash(password, 12);

   const user = await prisma.user.create({
      data: {
         name,
         email,
         password: hashedPassword,
      },
   });

   const accessToken = generateAccessToken(user.id, user.role);
   const refreshToken = generateRefreshToken(user.id);

   await prisma.user.update({
      where: {
         id: user.id,
      },
      data: {
         refreshToken,
      },
   });

   return {
      user: {
         id: user.id,
         name: user.name,
         email: user.email,
         role: user.role,
         avatar: user.avatar,
      },
      accessToken,
      refreshToken,
   };
};

export const loginUser = async (
   email: string,
   password: string
) => {
   const user = await prisma.user.findUnique({
      where: { email },
   });

   if (!user) {
      throw new Error("Invalid email or password");
   }

   const isPasswordValid = await bcrypt.compare(
      password,
      user.password
   );

   if (!isPasswordValid) {
      throw new Error("Invalid email or password");
   }

   const accessToken = generateAccessToken(user.id, user.role);
   const refreshToken = generateRefreshToken(user.id);

   await prisma.user.update({
      where: {
         id: user.id,
      },
      data: {
         refreshToken,
      },
   });

   return {
      user: {
         id: user.id,
         name: user.name,
         email: user.email,
         role: user.role,
         avatar: user.avatar,
      },
      accessToken,
      refreshToken,
   };
};