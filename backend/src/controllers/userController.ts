import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { hashPassword, comparePassword } from '../utils/hash';
import { generateToken } from '../utils/jwt';
import { sendOtpEmail } from '../utils/email';
import { generateOTP } from '../utils/otp';

const prisma = new PrismaClient();

import { Role } from '@prisma/client';

export const signup = async (req: Request, res: Response): Promise<Response> => {
  const { username, email, password, role } = req.body;

  const existing = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] },
  });
  if (existing) return res.status(400).json({ message: 'Username or Email already exists' });

  const hashed = await hashPassword(password);
  const otp = generateOTP();
  const expiry = new Date(Date.now() + 10 * 60 * 1000);

  const assignedRole = role === 'ADMIN' ? Role.ADMIN : Role.USER;

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
    message: 'OTP sent to email. Please verify your account.',
  });
};

export const verifyEmail = async (req: Request, res: Response): Promise<Response> => {
  const { email, otp } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(404).json({ message: 'User not found' });
  if (user.otp !== otp || !user.otpExpiry || user.otpExpiry < new Date()) {
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }

  await prisma.user.update({
    where: { email },
    data: { isVerified: true, otp: null, otpExpiry: null },
  });

  return res.status(200).json({ message: 'Email verified successfully' });
};

export const login = async (req: Request, res: Response): Promise<Response> => {
  const { username, password } = req.body;

  const user = await prisma.user.findFirst({ where: { username: username } });
  if (!user) return res.status(404).json({ message: 'User not found' });

  if (!user.isVerified) {
    const otp = generateOTP();
    await sendOtpEmail(user.email, otp);
    return res
      .status(403)
      .json({ message: 'Please verify your email first. OTP sent to your email.' });
  }
  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

  const token = generateToken(user.id.toString(), user.role);
  res.cookie('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000,
  });

  const { password: _, ...userWithoutPassword } = user;
  return res.json({
    user: userWithoutPassword,
    token,
    message: 'Login successful',
  });
};

export const requestPasswordOtp = async (req: Request, res: Response): Promise<Response> => {
  const { email } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(404).json({ message: 'Email not found' });

  const otp = generateOTP();
  const expiry = new Date(Date.now() + 10 * 60 * 1000);

  await prisma.user.update({
    where: { email },
    data: { otp, otpExpiry: expiry },
  });

  await sendOtpEmail(email, otp);
  return res.json({ message: 'OTP sent to email' });
};

export const resetPassword = async (req: Request, res: Response): Promise<Response> => {
  const { email, otp, newPassword } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.otp !== otp || !user.otpExpiry || user.otpExpiry < new Date()) {
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }

  const hashed = await hashPassword(newPassword);

  await prisma.user.update({
    where: { email },
    data: { password: hashed, otp: null, otpExpiry: null },
  });

  return res.json({ message: 'Password updated successfully' });
};

export const logout = async (_req: Request, res: Response): Promise<Response> => {
  res.clearCookie('auth_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  return res.status(200).json({ message: 'Logged out successfully' });
};

import fs from 'fs';
import path from 'path';
const deleteFile = (relativeFilePath: string) => {
  if (!relativeFilePath) return;

  const cleanPath = relativeFilePath.startsWith('/')
    ? relativeFilePath.substring(1)
    : relativeFilePath;

  const absolutePath = path.resolve(__dirname, '../../', cleanPath);

  if (fs.existsSync(absolutePath)) {
    fs.unlinkSync(absolutePath);
    console.log(`Deleted file: ${absolutePath}`);
  } else {
    console.log(`File not found: ${absolutePath}`);
  }
};

export const updateProfile = async (req: Request, res: Response): Promise<Response> => {
  console.log('updateProfile controller hit');

  try {
    const userId = (req as any).user?.id as string;

    const {
      password,
      otp,
      otpExpiry,
      education: rawEducation,
      dateOfBirth,
      passedOutYear,
      noOfActiveBacklogs,
      percentage,
      ...rest
    } = req.body;

    const safeData: any = {
      ...rest,
    };

    // ✅ Parse required types from strings
    if (percentage) safeData.percentage = parseFloat(percentage);
    if (noOfActiveBacklogs) safeData.noOfActiveBacklogs = parseInt(noOfActiveBacklogs);
    if (passedOutYear) safeData.passedOutYear = parseInt(passedOutYear);
    if (dateOfBirth) safeData.dateOfBirth = new Date(dateOfBirth);

    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    const existingUser = await prisma.user.findUnique({ where: { id: userId } });

    // ✅ Handle Profile Picture
    if (files?.profilePic?.[0]) {
      if (existingUser?.profilePic) deleteFile(existingUser.profilePic);
      safeData.profilePic = `/uploads/${files.profilePic[0].filename}`;
    }

    // ✅ Handle Resume Upload
    if (files?.resume?.[0]) {
      if (existingUser?.resume) deleteFile(existingUser.resume);
      safeData.resume = `/uploads/${files.resume[0].filename}`;
    }

    // ✅ Update user data
    await prisma.user.update({
      where: { id: userId },
      data: safeData,
    });

    // ✅ Handle Education (all strings, parse properly)
    if (rawEducation && Array.isArray(rawEducation)) {
      const parsedEducation = rawEducation.map((edu: any) => ({
        educationalLevel: edu.educationalLevel,
        institution: edu.institution,
        specialization: edu.specialization || null,
        boardOrUniversity: edu.boardOrUniversity || null,
        location: edu.location || null,
        percentage: parseFloat(edu.percentage),
        passedOutYear: parseInt(edu.passedOutYear),
        noOfActiveBacklogs: edu.noOfActiveBacklogs ? parseInt(edu.noOfActiveBacklogs) : 0,
        userId,
      }));

      // Replace old education
      await prisma.education.deleteMany({ where: { userId } });
      await prisma.education.createMany({ data: parsedEducation });
    }

    const updatedUser = await prisma.user.findUnique({
      where: { id: userId },
      include: { education: true },
    });

    return res.json({
      user: updatedUser,
      message: 'Profile updated successfully',
    });
  } catch (error) {
    console.error('Update failed:', error);
    return res.status(500).json({ message: 'Update failed', error });
  }
};

export const getProfile = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = (req as any).user.id as string;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        education: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const cleanedUser = safeUser(user);

    return res.json({ user: cleanedUser });
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({ message: 'Failed to get profile', error });
  }
};

const safeUser = (user: any) => {
  const { password, otp, otpExpiry, applications, roundResults, ...rest } = user;
  return rest;
};

export const getFilteredUsers = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Get pagination info from query parameters
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    // Destructure filters from request body
    const {
      gender,
      search: username,
      educationalLevels = [],
      passedOutYears = [],
      minActiveBacklogs,
      maxActiveBacklogs,
    } = req.body;
    // Build the user-level filtering
    const userWhere: any = {
      role: 'USER',
    };
    if (gender) {
      userWhere.gender = gender;
    }
    if (username) {
      userWhere.OR = [
        { username: { contains: username, mode: 'insensitive' } },
        { firstName: { contains: username, mode: 'insensitive' } },
        { lastName: { contains: username, mode: 'insensitive' } },
        { email: { contains: username, mode: 'insensitive' } },
      ];
    }

    // Build an array of education filters based on the provided educationalLevels
    const educationFilters = (Array.isArray(educationalLevels) ? educationalLevels : []).map(
      (edu: any) => {
        const filter: any = { educationalLevel: edu.level };

        if (edu.percentageRange?.length === 2) {
          filter.percentage = {
            gte: edu.percentageRange[0],
            lte: edu.percentageRange[1],
          };
        }

        if (edu.specialization && edu.specialization.length > 0) {
          filter.specialization = {
            in: edu.specialization,
            mode: 'insensitive',
          };
        }

        // Handle active backlog filters (if provided globally)
        if (minActiveBacklogs !== undefined || maxActiveBacklogs !== undefined) {
          filter.noOfActiveBacklogs = {};
          if (minActiveBacklogs !== undefined) {
            filter.noOfActiveBacklogs.gte = minActiveBacklogs;
          }
          if (maxActiveBacklogs !== undefined) {
            filter.noOfActiveBacklogs.lte = maxActiveBacklogs;
          }
        }

        // Apply passed out years filter if provided
        if (Array.isArray(passedOutYears) && passedOutYears.length > 0) {
          filter.passedOutYear = {
            in: passedOutYears,
          };
        }

        return filter;
      }
    );

    // Build the main where clause. Only add education filtering if any education filters exist.
    const whereClause: any = {
      AND: [...Object.entries(userWhere).map(([key, value]) => ({ [key]: value }))],
    };

    if (educationFilters.length > 0) {
      whereClause.AND.push(
        ...educationFilters.map(eduFilter => ({
          education: {
            some: eduFilter,
          },
        }))
      );
    }

    // Query users with pagination and include education
    const users = await prisma.user.findMany({
      where: whereClause,
      skip,
      take: limit,
      include: { education: true },
    });

    const totalUsers = await prisma.user.count({
      where: whereClause,
    });

    const cleanedUsers = users.map(safeUser);
    return res.json({
      users: cleanedUsers,
      page,
      limit,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
    });
  } catch (error) {
    console.error('Failed to fetch users with filters:', error);
    return res.status(500).json({ message: 'Failed to fetch users', error });
  }
};

export const getAdminDashboard = async (req: Request, res: Response) => {
  try {
    const adminId = (req as any).user?.id;

    const [
      totalJobsPostedByAdmin,
      jobsWithDetails,
      totalApplications,
      totalUsers,
      totalQualified,
      userRoles,
      btechSpecializations,
    ] = await Promise.all([
      prisma.job.count({
        where: { createdById: adminId },
      }),

      prisma.job.findMany({
        where: { createdById: adminId },
        select: {
          id: true,
          jobRole: true,
          applications: {
            select: { id: true },
          },
          rounds: {
            select: {
              roundNumber: true,
              roundName: true,
              results: {
                where: { status: 'Qualified' },
                select: { id: true },
              },
            },
          },
        },
      }),

      prisma.jobApplication.count(),
      prisma.user.count(),
      prisma.results.count({ where: { status: 'Qualified' } }),

      prisma.user.groupBy({
        by: ['role'],
        _count: { _all: true },
      }),

      prisma.education.groupBy({
        by: ['specialization'],
        where: {
          educationalLevel: 'B.Tech',
          specialization: {
            not: null,
          },
        },
        _count: {
          specialization: true,
        },
      }),
    ]);

    const jobSummaries = jobsWithDetails.map((job) => {
      const totalApplications = job.applications.length;
      const totalRounds = job.rounds.length;

      const roundSummaries = job.rounds.map((round) => ({
        roundNumber: round.roundNumber,
        roundName: round.roundName,
        qualifiedUsers: round.results.length,
      }));

      const totalQualifiedUsersAcrossRounds = job.rounds.reduce(
        (acc, round) => acc + round.results.length,
        0
      );

      const qualificationRatio =
        totalApplications > 0
          ? ((totalQualifiedUsersAcrossRounds / totalApplications) * 100).toFixed(2)
          : '0.00';

      return {
        jobId: job.id,
        jobRole: job.jobRole,
        totalApplications,
        totalRounds,
        totalQualifiedUsersAcrossRounds,
        qualificationRatio: `${qualificationRatio}%`,
        roundSummaries,
      };
    });

    return res.json({
      dashboard: {
        totalJobsPostedByAdmin,
        totalApplications,
        totalUsers,
        totalQualified,
        userRoles,
        btechSpecializations,
        jobSummaries,
      },
    });
  } catch (error) {
    console.error('Admin dashboard failed:', error);
    return res.status(500).json({ message: 'Failed to load admin dashboard', error });
  }
};

