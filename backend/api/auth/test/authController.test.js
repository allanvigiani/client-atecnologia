import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

import AuthController from './AuthController';

const authRepositoryMock = {
  getCompanyByEmail: jest.fn(),
  getCompanySession: jest.fn(),
  deleteCompanySession: jest.fn(),
  createCompanySession: jest.fn(),
  deleteCompanySessionByUserId: jest.fn(),
};

const authController = new AuthController(authRepositoryMock);

describe('AuthController', () => {
  describe('login', () => {
    it('should return an error if email or password is missing', async () => {
      const result = await authController.login({});
      expect(result.status).toBe(400);
    });

    it('should return an error if user does not exist', async () => {
      authRepositoryMock.getCompanyByEmail.mockResolvedValue(null);
      const result = await authController.login({
        email: 'nonexistent@example.com',
        password: 'password123',
      });
      expect(result.status).toBe(400);
    });


    it('should return a success message and token on successful login', async () => {
      const result = await authController.login({
        email: 'user@example.com',
        password: 'validpassword',
      });
      expect(result.status).toBe(200);
      expect(result.message.success).toBe('Login realizado com sucesso!');
      expect(result.message.token).toBeDefined();
    });
  });

  describe('logout', () => {
    it('should return a success message on successful logout', async () => {
      const result = await authController.logout({
        payload: { id: 'user_id', name: 'user_name', email: 'user@example.com' },
      });
      expect(result.status).toBe(200);
      expect(result.message.success).toBe('Logout realizado!');
    });

  });
});
