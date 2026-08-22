import prisma from '../prisma.js';
import { AppError } from '../shared/error-handler.js';

export const getMe = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        photo_url: true,
        language: true,
        created_at: true
      }
    });

    if (!user) {
      throw new AppError('User not found.', 404, 'USER_NOT_FOUND');
    }

    res.status(200).json({
      success: true,
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

export const updateMe = async (req, res, next) => {
  try {
    const { name, photo_url, language } = req.body;
    const updateData = {};

    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim().length === 0) {
        throw new AppError('Name cannot be empty.', 400, 'VALIDATION_ERROR');
      }
      updateData.name = name.trim();
    }

    if (photo_url !== undefined) {
      updateData.photo_url = photo_url;
    }

    if (language !== undefined) {
      updateData.language = language;
    }

    if (Object.keys(updateData).length === 0) {
      throw new AppError('No valid fields provided to update.', 400, 'VALIDATION_ERROR');
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        photo_url: true,
        language: true,
        created_at: true
      }
    });

    res.status(200).json({
      success: true,
      data: { user: updatedUser }
    });
  } catch (error) {
    next(error);
  }
};
