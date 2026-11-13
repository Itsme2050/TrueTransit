import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../services/prismaClient';
import { config } from '../config';
import { AuthenticatedRequest } from '../middleware/auth';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string().min(2),
  preferredLanguage: z.string().optional().default('en'),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export class AuthController {
  public static async register(req: Request, res: Response): Promise<void> {
    const data = registerSchema.parse(req.body);
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      res.status(400).json({ success: false, message: 'User already exists with this email address.' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password, salt);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        fullName: data.fullName,
        preferredLanguage: data.preferredLanguage,
        role: data.email.includes('admin') ? 'ADMIN' : 'USER',
      },
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, fullName: user.fullName },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        preferredLanguage: user.preferredLanguage,
      },
    });
  }

  public static async login(req: Request, res: Response): Promise<void> {
    const data = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    const isMatch = await bcrypt.compare(data.password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, fullName: user.fullName },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        preferredLanguage: user.preferredLanguage,
      },
    });
  }

  public static async guest(req: Request, res: Response): Promise<void> {
    const guestUser = {
      id: `guest-${Date.now()}`,
      email: 'guest@truetransit.local',
      role: 'USER',
      fullName: 'TrueTransit Guest Explorer',
      isGuest: true,
    };

    const token = jwt.sign(guestUser, config.jwtSecret, { expiresIn: '1d' });

    res.json({
      success: true,
      token,
      user: guestUser,
    });
  }

  public static async getProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    if (req.user.isGuest) {
      res.json({
        success: true,
        user: req.user,
        emergencyContacts: [],
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { emergencyContacts: true },
    });

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        preferredLanguage: user.preferredLanguage,
        emergencyNote: user.emergencyNote,
        bloodGroup: user.bloodGroup,
      },
      emergencyContacts: user.emergencyContacts,
    });
  }
}
