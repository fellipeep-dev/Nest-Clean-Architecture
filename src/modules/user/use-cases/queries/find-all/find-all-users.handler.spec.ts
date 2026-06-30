import { IUserRepository } from 'src/modules/user/domain/repositories/iuser.repository';
import { FindAllUsersHandler } from './find-all-users.handler';
import { UserInMemoryRepository } from 'src/modules/user/infrastructure/user.in-memory-repository';
import { FindAllUsersQuery } from './find-all-users.query';
import { createUserDtoMock } from 'src/modules/user/domain/mocks/create-user.dto.mock';

describe('FindAllUsersHandler', () => {
  let sut: FindAllUsersHandler;
  let userRepository: IUserRepository;

  const cache = {
    get: jest.fn(),
    set: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    cache.get.mockResolvedValue(undefined);
    cache.set.mockResolvedValue(true);

    userRepository = new UserInMemoryRepository();
    sut = new FindAllUsersHandler(userRepository, cache as any);
  });

  it('given existing users and no cached result, when search all users, then it should find and cache them', async () => {
    //Arrange
    const user1 = await userRepository.create(createUserDtoMock);
    const user2 = await userRepository.create(createUserDtoMock);
    const userQuery = new FindAllUsersQuery({});

    //Act
    const users = await sut.execute(userQuery);

    //Assert
    expect(users).toMatchObject([user1, user2]);
    expect(users).toHaveLength(2);
    expect(cache.get).toHaveBeenCalledTimes(2);
    expect(cache.set).toHaveBeenCalledTimes(1);
    expect(cache.set).toHaveBeenCalledWith(expect.any(String), users, 5000);
  });

  it('given cached users, when search all users, then it should return cached users', async () => {
    //Arrange
    await userRepository.create(createUserDtoMock);
    await userRepository.create(createUserDtoMock);
    const cachedUsers = await userRepository.findAll({});

    cache.get.mockResolvedValue(cachedUsers);

    const userQuery = new FindAllUsersQuery({});

    const findAllUsersSpy = jest.spyOn(userRepository, 'findAll');

    //Act
    const users = await sut.execute(userQuery);

    //Assert
    expect(users).toEqual(cachedUsers);
    expect(cache.get).toHaveBeenCalledTimes(2);
    expect(findAllUsersSpy).not.toHaveBeenCalled();
    expect(cache.set).not.toHaveBeenCalled();
  });

  it('given no users, when search all users, then it should return an empty list and cache it', async () => {
    //Arrange
    const userQuery = new FindAllUsersQuery({});

    //Act
    const users = await sut.execute(userQuery);

    //Assert
    expect(users).toMatchObject([]);
    expect(cache.get).toHaveBeenCalledTimes(2);
    expect(cache.set).toHaveBeenCalledTimes(1);
    expect(cache.set).toHaveBeenCalledWith(expect.any(String), users, 5000);
  });
});
