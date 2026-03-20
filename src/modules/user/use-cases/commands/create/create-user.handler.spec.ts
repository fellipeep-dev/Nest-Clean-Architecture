import { IUserRepository } from 'src/modules/user/repositories/iuser.repository';
import { CreateUserHandler } from './create-user.handler';
import { UserInMemoryRepository } from 'src/modules/user/repositories/user.in-memory-repository';
import { UserValidationService } from 'src/modules/user/services/user-validation.service';
import { CreateUserDtoMock } from 'src/domain/mocks/user';
import { CreateUserCommand } from './create-user.command';

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

  it('given a unique email, when creating a user, then it should persist this user and publish an event', async () => {
    //Arrange
    const userCommand = new CreateUserCommand(CreateUserDtoMock);

    //Act
    const { actionId } = await sut.execute(userCommand);
    const user = await userRepository.findById(actionId);

    //Assert
    expect(user).toMatchObject({
      ...user,
      password: 'hashed_password',
    });

    expect(eventBus.publish).toHaveBeenCalled();
  });
});
