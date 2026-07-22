import { IAuthRepository } from 'src/modules/auth/domain/repositories/iauth.repository';
import { SingInAuthHandler } from './sing-in.auth.handler';
import { IUserRepository } from 'src/modules/user/domain/repositories/iuser.repository';
import { UserInMemoryRepository } from 'src/modules/user/infrastructure/user.in-memory-repository';
import { AuthInMemoryRepository } from 'src/modules/auth/infrastructure/auth.in-memory-repository';
import { SingInAuthCommand } from './sing-in.auth.command';
import { singInAuthDtoMock } from 'src/modules/auth/domain/mocks/sing-in.auth.dto.mock';
import { createAuthDtoMock } from 'src/modules/auth/domain/mocks/create-auth.dto.mock';
import { createUserDtoMock } from 'src/modules/user/domain/mocks/create-user.dto.mock';
import { compare } from 'src/shared/utils';
import { UnauthorizedException } from '@nestjs/common';

jest.mock('src/shared/utils', () => ({
  compare: jest.fn().mockResolvedValue(true),
}));

describe('SingInAuthHandler', () => {
  let sut: SingInAuthHandler;
  let userRepository: IUserRepository;
  let authRepository: IAuthRepository;

  const jwtService = {
    signAsync: jest.fn(),
  };

  const eventBus = {
    publish: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jwtService.signAsync.mockResolvedValue('token');
    eventBus.publish.mockResolvedValue(true);

    ((userRepository = new UserInMemoryRepository()),
      (authRepository = new AuthInMemoryRepository()));
    sut = new SingInAuthHandler(
      userRepository,
      authRepository,
      jwtService as any,
      eventBus as any,
    );
  });

  it('given a valid credentials, when create an auth, then it should persist auth, generate and return a token and publish correct event', async () => {
    //Arrange
    const user = await userRepository.create(createUserDtoMock);

    const authCommand = new SingInAuthCommand(singInAuthDtoMock);

    const findByEmailSpy = jest.spyOn(userRepository, 'findByEmail');

    //Act
    const { access_token } = await sut.execute(authCommand);

    const auth = await authRepository.findAll({ where: { userId: user.id } });

    //Assert
    expect(auth[0]).toMatchObject({ userId: createAuthDtoMock.userId });

    expect(findByEmailSpy).toHaveBeenCalled();

    expect(compare).toHaveBeenCalledWith(
      singInAuthDtoMock.password,
      user.password,
    );

    expect(eventBus.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: {
          entity: 'AUTH',
          action: 'create',
        },
      }),
    );

    expect(access_token).toBe('token');
  });

  it('given a non valid email, when create an auth, then it should throw unauthorized exception and not publish event', async () => {
    //Arrange
    const email = 'awsd@gmail.com';
    await userRepository.create(createUserDtoMock);

    const authCommand = new SingInAuthCommand({
      login: email,
      password: singInAuthDtoMock.password,
    });

    const findByEmailSpy = jest.spyOn(userRepository, 'findByEmail');

    //Act + Assert
    await expect(sut.execute(authCommand)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );

    expect(findByEmailSpy).toHaveBeenCalledWith(email);

    expect(await authRepository.findAll({})).toHaveLength(0);

    expect(eventBus.publish).not.toHaveBeenCalled();
    expect(jwtService.signAsync).not.toHaveBeenCalled();
  });

  it('given a non valid password, when create an auth, then it should throw unauthorized exception and not publish event', async () => {
    //Arrange
    (compare as jest.Mock).mockResolvedValueOnce(false);

    const password = 'ola';
    await userRepository.create(createUserDtoMock);

    const authCommand = new SingInAuthCommand({
      login: singInAuthDtoMock.login,
      password: password,
    });

    const findByEmailSpy = jest.spyOn(userRepository, 'findByEmail');

    //Act + Assert
    await expect(sut.execute(authCommand)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );

    expect(findByEmailSpy).toHaveBeenCalled();

    expect(compare).toHaveBeenCalled();

    expect(await authRepository.findAll({})).toHaveLength(0);

    expect(eventBus.publish).not.toHaveBeenCalled();
    expect(jwtService.signAsync).not.toHaveBeenCalled();
  });
});
