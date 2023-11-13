import AuthController from '../controllers/auth-controller.js';
import AuthRepository from '../repositories/auth-repository.js';

const authRepository = new AuthRepository();

// Mock da implementação do repositório
jest.mock('../repositories/auth-repository.js');

describe('AuthController login', () => {
  it('deve retornar sucesso ao fornecer informações de login corretas', async () => {
    const authController = new AuthController(authRepository);

    const body = { email: 'user@example.com', password: 'password' };
    const expectedResult = {
      message: {
        success: 'Login realizado com sucesso!',
        id: 'mockedUserId',
        email: 'user@example.com',
        name: 'Mocked User',
        token: 'mockedToken',
      },
      status: 200,
    };

    authRepository.getCompanyByEmail.mockResolvedValue({
      id: 'mockedUserId',
      email: 'user@example.com',
      name: 'Mocked User',
      password: 'mockedPasswordHash',
    });

    bcrypt.compare.mockResolvedValue(true);

    authRepository.getCompanySession.mockResolvedValue(null);

    jwt.sign.mockReturnValue('mockedToken');

    const result = await authController.login(body);
    expect(result).toEqual(expectedResult);
  });

  it('deve retornar erro ao fornecer informações de login incorretas', async () => {
    const authController = new AuthController(authRepository);

    const body = { email: 'user@example.com', password: 'wrongPassword' };
    const expectedResult = {
      message: 'Email ou senha incorretos.',
      status: 400,
    };

    authRepository.getCompanyByEmail.mockResolvedValue(null);

    const result = await authController.login(body);
    expect(result).toEqual(expectedResult);
  });

});
