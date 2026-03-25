import { IUserRepository } from 'src/modules/user/repositories/iuser.repository';
import { UpdateUserHandler } from './update-user.handler';
import { UserValidationService } from 'src/modules/user/services/user-validation.service';
import { UserInMemoryRepository } from 'src/modules/user/repositories/user.in-memory-repository';
import { UpdateUserCommand } from './update-user.command';
import { updateUserDtoMock } from 'src/domain/mocks/user/update-user.dto.mock';
import { createUserDtoMock } from 'src/domain/mocks/user';
import { AppError } from 'src/common/errors';
import { HttpStatus } from '@nestjs/common';

describe('UpdateUserHandler', () => {
  let sut: UpdateUserHandler;
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
    jest.spyOn(userValidationService, 'isEmailUnique');
    sut = new UpdateUserHandler(
      userRepository,
      userValidationService,
      eventBus as any,
    );
  });

  it('given an existing user and a new unique email, when updating user, then it should update user and publish event', async () => {
    //Arrange
    const existingUser = await userRepository.create(createUserDtoMock);
    const id = existingUser.id;
    const userCommand = new UpdateUserCommand(id, {
      ...updateUserDtoMock,
      email: 'unique',
    });

    //Act
    await sut.execute(userCommand);
    const user = await userRepository.findById(id);

    //Assert
    expect(user).toMatchObject({
      email: 'unique',
    });

    expect(userValidationService.doesExist).toHaveBeenCalledWith(id);
    expect(userValidationService.doesExist).toHaveBeenCalledTimes(1);

    expect(userValidationService.isEmailUnique).toHaveBeenCalledWith('unique');
    expect(userValidationService.isEmailUnique).toHaveBeenCalledTimes(1);

    expect(eventBus.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: {
          entity: 'USERS',
          action: 'update',
          id,
          identifiers: {
            email: user?.email,
          },
        },
      }),
    );
  });

  it('given an existing user without email update, when updating user, then it should update user without validating email and publish event', async () => {
    //Arrange
    const existingUser = await userRepository.create(createUserDtoMock);
    const id = existingUser.id;
    const userCommand = new UpdateUserCommand(id, {
      ...updateUserDtoMock,
    });

    //Act
    await sut.execute(userCommand);
    const user = await userRepository.findById(id);

    //Assert
    expect(user).toMatchObject({
      name: updateUserDtoMock.name,
      profilePictureUrl: updateUserDtoMock.profilePictureUrl,
    });

    expect(userValidationService.doesExist).toHaveBeenCalledWith(id);
    expect(userValidationService.doesExist).toHaveBeenCalledTimes(1);

    expect(userValidationService.isEmailUnique).not.toHaveBeenCalled();

    expect(eventBus.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: {
          entity: 'USERS',
          action: 'update',
          id,
          identifiers: {
            email: user?.email,
          },
        },
      }),
    );
  });

  it('given a duplicated email, when updating user, then it should throw conflict exception and not publish event', async () => {
    //Arrange
    const existingUser = await userRepository.create(createUserDtoMock);
    const id = existingUser.id;
    const userCommand = new UpdateUserCommand(id, {
      ...updateUserDtoMock,
      email: 'string',
    });

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

    expect(userValidationService.isEmailUnique).toHaveBeenCalledWith('string');

    expect(eventBus.publish).not.toHaveBeenCalled();
  });

  it('given a non-existing user id, when updating user, then it should throw not found exception and not proceed', async () => {
    //Arrange
    const existingUser = await userRepository.create(createUserDtoMock);
    const id = existingUser.id;
    const userCommand = new UpdateUserCommand(id, {
      ...updateUserDtoMock,
      email: 'string',
    });

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
