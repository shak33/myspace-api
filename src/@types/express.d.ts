import express from 'express';

declare global {
  namespace Express {
    interface Request {
      user: {
        email: string;
        id: number;
        userId: string;
        profileId: number;
        firstName?: string;
        lastName?: string;
      };
    }
  }
}
