import { z, ZodSchema } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const requestValidationMiddleware =
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
            fields: error.errors.reduce(
              (acc, err) => {
                const path = err.path.join('.');
                acc[path] = err.message;
                return acc;
              },
              {} as Record<string, string>
            ),
          },
        });
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  };
