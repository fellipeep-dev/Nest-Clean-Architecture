import { IUserRepository } from 'src/modules/user/repositories/iuser.repository';
import { CreateUserHandler } from './create-user.handler';
import { UserInMemoryRepository } from 'src/modules/user/repositories/user.in-memory-repository';
import { UserValidationService } from 'src/modules/user/services/user-validation.service';
import { createUserDtoMock } from 'src/domain/mocks/user';
import { CreateUserCommand } from './create-user.command';
import { AppError } from 'src/common/errors';
import { HttpStatus } from '@nestjs/common';
import { hash } from 'src/common/utils';

jest.mock('src/common/utils', () => ({
  hash: jest.fn().mockResolvedValue('hashed_password'),
}));

describe('CreateUserHandler', () => {
  let sut: CreateUserHandler;
  let userRepository: IUserRepository;
  let userValidationService: UserValidationService;

  const eventBus = {
    publish: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    eventBus.publish.mockResolvedValue(true);

    userRepository = new UserInMemoryRepository();
    userValidationService = new UserValidationService(userRepository);
    sut = new CreateUserHandler(
      userRepository,
      eventBus as any,
      userValidationService,
    );
  });

  it('given a unique email, when creating a user, then it should persist user, hash password and publish correct event', async () => {
    //Arrange
    const userCommand = new CreateUserCommand(createUserDtoMock);

    //Act
    const { actionId } = await sut.execute(userCommand);
    const user = await userRepository.findById(actionId);

    //Assert
    expect(user).toMatchObject({
      email: createUserDtoMock.email,
      password: 'hashed_password',
    });

    expect(hash).toHaveBeenCalledWith(createUserDtoMock.password);

    expect(eventBus.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: {
          entity: 'USERS',
          action: 'create',
        },
      }),
    );

    expect(actionId).toBeDefined();
  });

  it('given a non-unique email, when creating a user, then it should throw conflict exception and not publish event', async () => {
    //Arrange
    const userCommand = new CreateUserCommand(createUserDtoMock);

    jest
      .spyOn(userValidationService, 'isEmailUnique')
      .mockRejectedValue(
        new AppError(
          'Email already in use',
          HttpStatus.CONFLICT,
          'EMAIL_ALREADY_IN_USE',
        ),
      );

    //Act + Assert
    await expect(sut.execute(userCommand)).rejects.toMatchObject({
      message: 'Email already in use',
      status: HttpStatus.CONFLICT,
      errorCode: 'EMAIL_ALREADY_IN_USE',
    });

    expect(await userRepository.findAll({})).toHaveLength(0);

    expect(eventBus.publish).not.toHaveBeenCalled();
  });
});
