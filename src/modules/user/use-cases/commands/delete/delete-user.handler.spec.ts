import { IUserRepository } from 'src/modules/user/repositories/iuser.repository';
import { UserValidationService } from 'src/modules/user/services/user-validation.service';
import { UserInMemoryRepository } from 'src/modules/user/repositories/user.in-memory-repository';
import { createUserDtoMock } from 'src/domain/mocks/user';
import { DeleteUserCommand } from './delete-user.command';
import { DeleteUserHandler } from './delete-user.handler';
import { AppError } from 'src/common/errors';
import { HttpStatus } from '@nestjs/common';

describe('DeleteUserHandler', () => {
  let sut: DeleteUserHandler;
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
    jest.spyOn(userValidationService, 'doesExist');
    sut = new DeleteUserHandler(
      userRepository,
      userValidationService,
      eventBus as any,
    );
  });

  it('given an existing user, when deleting user, then it should soft delete user and publish event', async () => {
    //Arrange
    const existingUser = await userRepository.create(createUserDtoMock);
    const id = existingUser.id;
    const userCommand = new DeleteUserCommand(id);

    //Act
    await sut.execute(userCommand);
    const user = await userRepository.findById(id);

    //Assert
    expect(user).toMatchObject({
      deletedAt: expect.any(Date),
    });

    expect(userValidationService.doesExist).toHaveBeenCalledWith(id);
    expect(userValidationService.doesExist).toHaveBeenCalledTimes(1);

    expect(eventBus.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: {
          entity: 'USERS',
          action: 'delete',
          id,
          identifiers: {
            email: user?.email,
          },
        },
      }),
    );
  });

  it('given a non-existing user id, when deleting user, then it should throw not found exception and not proceed', async () => {
    //Arrange
    const existingUser = await userRepository.create(createUserDtoMock);
    const id = existingUser.id;
    const userCommand = new DeleteUserCommand(id);

    jest
      .spyOn(userValidationService, 'doesExist')
      .mockRejectedValue(
        new AppError('User not found', HttpStatus.NOT_FOUND, 'USER_NOT_FOUND'),
      );

    //Act + Assert
    await expect(sut.execute(userCommand)).rejects.toMatchObject({
      message: 'User not found',
      status: HttpStatus.NOT_FOUND,
      errorCode: 'USER_NOT_FOUND',
    });

    expect(eventBus.publish).not.toHaveBeenCalled();
  });
});
