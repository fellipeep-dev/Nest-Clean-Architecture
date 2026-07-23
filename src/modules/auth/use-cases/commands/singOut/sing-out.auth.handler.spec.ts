import { IAuthRepository } from 'src/modules/auth/domain/repositories/iauth.repository';
import { SingOutAuthHandler } from './sing-out.auth.handler';
import { AuthInMemoryRepository } from 'src/modules/auth/infrastructure/auth.in-memory-repository';
import { SingOutAuthCommand } from './sing-out.auth.command';
import { createAuthDtoMock } from 'src/modules/auth/domain/mocks/create-auth.dto.mock';
import { IAuthValidationService } from '../../services/iauth-validation.service';
import { AuthValidationService } from '../../services/auth-validation.service';
import { HttpStatus } from '@nestjs/common';

describe('SingOutAuthHandler', () => {
  let sut: SingOutAuthHandler;
  let authRepository: IAuthRepository;
  let authValidationService: IAuthValidationService;

  const eventBus = {
    publish: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    eventBus.publish.mockResolvedValue(true);

    authRepository = new AuthInMemoryRepository();
    authValidationService = new AuthValidationService(authRepository);
    jest.spyOn(authValidationService, 'doesExist');
    sut = new SingOutAuthHandler(
      authRepository,
      authValidationService,
      eventBus as any,
    );
  });

  it('given a valid id, when update an auth, then it should update expiresAt and publish event', async () => {
    //Arrange
    const existingAuth = await authRepository.create(createAuthDtoMock);
    const authQuery = new SingOutAuthCommand(existingAuth.id);

    //Act
    await sut.execute(authQuery);
    const auth = await authRepository.findById(existingAuth.id);

    //Assert
    expect(auth?.expiresAt.getTime()).toBeLessThanOrEqual(
      existingAuth.expiresAt.getTime(),
    );

    expect(authValidationService.doesExist).toHaveBeenCalledWith(
      existingAuth.id,
    );
    expect(authValidationService.doesExist).toHaveBeenCalledTimes(1);

    expect(eventBus.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: {
          entity: 'AUTH',
          action: 'update',
          id: existingAuth.id,
        },
      }),
    );
  });

  it('given a non valid id, when update an auth, then it should throw not found exception', async () => {
    //Arrange
    await authRepository.create(createAuthDtoMock);
    const authQuery = new SingOutAuthCommand('fake_id');

    //Act + Assert
    await expect(sut.execute(authQuery)).rejects.toMatchObject({
      message: 'Auth not found',
      status: HttpStatus.NOT_FOUND,
      errorCode: 'AUTH_NOT_FOUND',
    });

    expect(eventBus.publish).not.toHaveBeenCalled();
  });
});
