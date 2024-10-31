import express from 'express';

declare global {
  namespace Express {
    interface Request {
      user: {
        email: string;
        id: number;
        userId: string;
        profile: {
          id: number;
          firstName?: string;
          lastName?: string;
        };
      };
    }
  }
}
