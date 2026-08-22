import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prisma.js';
import { AppError } from '../shared/error-handler.js';

const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET || 'globetrotter_default_secret_key_2026';
  return jwt.sign({ userId }, secret, { expiresIn: '7d' });
};

export const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      throw new AppError('Name is required.', 400, 'VALIDATION_ERROR');
    }

    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      throw new AppError('A valid email address is required.', 400, 'VALIDATION_ERROR');
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      throw new AppError('Password must be at least 6 characters long.', 400, 'VALIDATION_ERROR');
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    });

    if (existingUser) {
      throw new AppError('An account with this email already exists.', 409, 'EMAIL_EXISTS');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        password_hash: passwordHash,
        role: 'user',
        language: 'en'
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        photo_url: true,
        language: true,
        last_active: true,
        created_at: true
      }
    });

    const token = generateToken(newUser.id);

    res.status(201).json({
      success: true,
      data: {
        user: newUser,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError('Email and password are required.', 400, 'VALIDATION_ERROR');
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    });

    if (!user) {
      throw new AppError('Invalid email or password.', 401, 'INVALID_CREDENTIALS');
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      throw new AppError('Invalid email or password.', 401, 'INVALID_CREDENTIALS');
    }

    // Update last_active
    await prisma.user.update({
      where: { id: user.id },
      data: { last_active: new Date() }
    });

    const token = generateToken(user.id);

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role || 'user',
      photo_url: user.photo_url,
      language: user.language,
      last_active: user.last_active,
      created_at: user.created_at
    };

    res.status(200).json({
      success: true,
      data: {
        user: safeUser,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      throw new AppError('Please provide a valid email address.', 400, 'VALIDATION_ERROR');
    }

    res.status(200).json({
      success: true,
      data: {
        message: 'Password reset link has been dispatched to your email (Mock Hackathon Stub).'
      }
    });
  } catch (error) {
    next(error);
  }
};
