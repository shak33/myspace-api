import { z, ZodSchema } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const requestValidation =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: {
            fields: error.errors.map((err) => ({
              [`${err.path}`]: err.message,
            })),
          },
        });
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  };
