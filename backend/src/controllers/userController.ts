import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { hashPassword, comparePassword } from "../utils/hash";
import { generateToken } from "../utils/jwt";
import { sendOtpEmail } from "../utils/email";
import { generateOTP } from "../utils/otp";

const prisma = new PrismaClient();

import { Role } from "@prisma/client"; 

export const signup = async (req: Request, res: Response): Promise<Response> => {
  const { username, email, password, role } = req.body;

  const existing = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] },
  });
  if (existing)
    return res.status(400).json({ message: "Username or Email already exists" });

  const hashed = await hashPassword(password);
  const otp = generateOTP();
  const expiry = new Date(Date.now() + 10 * 60 * 1000); 

  const assignedRole = role === "ADMIN" ? Role.ADMIN : Role.USER;

  await prisma.user.create({
    data: {
      username,
      email,
      password: hashed,
      otp,
      otpExpiry: expiry,
      role: assignedRole,
    },
  });

  await sendOtpEmail(email, otp);

  return res.status(201).json({
    message: "OTP sent to email. Please verify your account.",
  });
};


export const verifyEmail = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { email, otp } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(404).json({ message: "User not found" });
  if (user.otp !== otp || !user.otpExpiry || user.otpExpiry < new Date()) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  await prisma.user.update({
    where: { email },
    data: { isVerified: true, otp: null, otpExpiry: null },
  });

  return res.status(200).json({ message: "Email verified successfully" });
};

export const login = async (req: Request, res: Response): Promise<Response> => {
  const { username, password } = req.body;

  const user = await prisma.user.findFirst({ where: { username: username } });
  if (!user) 
    return res.status(403).json({ message: "User not found" });

  if (!user.isVerified){
    const otp=generateOTP()
    await sendOtpEmail(user.email,otp );
    return res.status(403).json({ message: "Please verify your email first. OTP sent to your email." });
  }
  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

const token = generateToken(user.id.toString(),user.role);  
  res.cookie('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', 
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000 
  });

  const { password: _, ...userWithoutPassword } = user;
  return res.json({ 
    user: userWithoutPassword, 
    token,
    message: "Login successful" 
  });
};

export const requestPasswordOtp = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { email } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(404).json({ message: "Email not found" });

  const otp = generateOTP();
  const expiry = new Date(Date.now() + 10 * 60 * 1000);

  await prisma.user.update({
    where: { email },
    data: { otp, otpExpiry: expiry },
  });

  await sendOtpEmail(email, otp);
  return res.json({ message: "OTP sent to email" });
};

export const resetPassword = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { email, otp, newPassword } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.otp !== otp || !user.otpExpiry || user.otpExpiry < new Date()) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  const hashed = await hashPassword(newPassword);

  await prisma.user.update({
    where: { email },
    data: { password: hashed, otp: null, otpExpiry: null },
  });

  return res.json({ message: "Password updated successfully" });
};

export const logout = async (
  _req: Request,
  res: Response
): Promise<Response> => {
  res.clearCookie('auth_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
  
  return res.status(200).json({ message: "Logged out successfully" });
};

import fs from 'fs';
import path from 'path';
const deleteFile = (relativeFilePath: string) => {
  if (!relativeFilePath) return;

  const cleanPath = relativeFilePath.startsWith('/') ? relativeFilePath.substring(1) : relativeFilePath;

  const absolutePath = path.resolve(__dirname, '../../', cleanPath);

  if (fs.existsSync(absolutePath)) {
    fs.unlinkSync(absolutePath);
    console.log(`Deleted file: ${absolutePath}`);
  } else {
    console.log(`File not found: ${absolutePath}`);
  }
};


export const updateProfile = async (req: Request, res: Response): Promise<Response> => {
  console.log("updateProfile controller hit");

  try {
    const userId = (req as any).user?.id as string;

    const { password, otp, otpExpiry, education, ...safeData } = req.body;

    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (files?.profilePic && files.profilePic[0]) {
      if (existingUser?.profilePic) {
        deleteFile(existingUser.profilePic);
      }

      const profilePicFile = files.profilePic[0];
      safeData.profilePic = `/uploads/${profilePicFile.filename}`;
    }

    if (files?.resume && files.resume[0]) {
      if (existingUser?.resume) {
        deleteFile(existingUser.resume);
      }

      const resumeFile = files.resume[0];
      safeData.resume = `/uploads/${resumeFile.filename}`;
    }

    const userUpdate = await prisma.user.update({
      where: { id: userId },
      data: safeData,
    });

    if (Array.isArray(education)) {
      await prisma.education.deleteMany({ where: { userId } });

      for (const edu of education) {
        await prisma.education.create({
          data: { ...edu, userId },
        });
      }
    }

    const updatedUser = await prisma.user.findUnique({
      where: { id: userId },
      include: { education: true },
    });

    return res.json({
      user: updatedUser,
      message: "Profile updated successfully",
    });

  } catch (error) {
    console.error("Update failed:", error);
    return res.status(500).json({ message: "Update failed", error });
  }
};


export const getProfile = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const userId = (req as any).user.id as string;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include:{
        education:true
      }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const cleanedUser = safeUser(user);

    return res.json({ user: cleanedUser });
  } catch (error) {
    console.error("Get profile error:", error);
    return res.status(500).json({ message: "Failed to get profile", error });
  }
};


const safeUser = (user: any) => {
  const {
    password,
    otp,
    otpExpiry,
    applications,
    roundResults,
    ...rest
  } = user;
  return rest;
};

export const getAllUsers = async (req: Request, res: Response): Promise<Response> => {
  try {
    const users = await prisma.user.findMany({
      include: {
        education: true, 
      },
    });

    const cleanedUsers = users.map(safeUser);

    return res.json({ users: cleanedUsers });
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return res.status(500).json({ message: "Failed to fetch users", error });
  }
};

export const getAdminDashboard = async (_req: Request, res: Response) => {
  try {
    const [jobsCount, applicationsCount, usersCount, qualifiedCount] = await Promise.all([
      prisma.job.count(),
      prisma.jobApplication.count(),
      prisma.user.count(),
      prisma.results.count({ where: { status: "Qualified" } }),
    ]);

    return res.json({
      dashboard: {
        totalJobs: jobsCount,
        totalApplications: applicationsCount,
        totalUsers: usersCount,
        totalQualified: qualifiedCount,
      },
    });
  } catch (error) {
    console.error("Admin dashboard failed:", error);
    return res.status(500).json({ message: "Failed to load admin dashboard", error });
  }
};
