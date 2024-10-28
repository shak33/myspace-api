import request from 'supertest';
import { Server } from 'http';
import loginUserData from '@/tests/fixtures/user/loginUser.json';

export async function loginAndGetTokenUtil(server: Server) {
  try {
    const res = await request(server).post('/api/v1/auth/login').send({
      email: loginUserData.email,
      password: loginUserData.password,
    });

    if (res.status !== 200) {
      throw new Error(`Login failed with status: ${res.status}`);
    }

    return res.body.data.token;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
}
