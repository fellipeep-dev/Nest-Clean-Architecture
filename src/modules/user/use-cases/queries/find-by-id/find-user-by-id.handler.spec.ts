import { IUserRepository } from 'src/modules/user/domain/repositories/iuser.repository';
import { FindUserByIdHandler } from './find-user-by-id.handler';
import { UserInMemoryRepository } from 'src/modules/user/infrastructure/user.in-memory-repository';
import { FindUserByIdQuery } from './find-user-by-id.query';
import { createUserDtoMock } from 'src/modules/user/domain/mocks/create-user.dto.mock';

describe('FindUserByIdHandler', () => {
  let sut: FindUserByIdHandler;
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
    sut = new FindUserByIdHandler(userRepository, cache as any);
  });

  it('given a unique ID, when search a user, then it should find a user and cache it', async () => {
    //Arrange
    const { id } = await userRepository.create(createUserDtoMock);
    const userQuery = new FindUserByIdQuery(id);

    //Act
    const user = await sut.execute(userQuery);

    //Assert
    expect(user).toMatchObject(createUserDtoMock);
    expect(cache.get).toHaveBeenCalledTimes(1);
    expect(cache.set).toHaveBeenCalledTimes(1);
    expect(cache.set).toHaveBeenCalledWith(expect.any(String), user, 5000);
  });

  it('given a cached user, when search by id, then it should return cache value', async () => {
    //Arrange
    const { id } = await userRepository.create(createUserDtoMock);
    const cachedUser = await userRepository.findById(id);

    cache.get.mockResolvedValue(cachedUser);

    const userQuery = new FindUserByIdQuery(id);

    const findByIdSpy = jest.spyOn(userRepository, 'findById');

    //Act
    const user = await sut.execute(userQuery);

    //Assert
    expect(user).toEqual(cachedUser);
    expect(cache.get).toHaveBeenCalledTimes(1);
    expect(findByIdSpy).not.toHaveBeenCalled();
    expect(cache.set).not.toHaveBeenCalled();
  });

  it('given an invalid id, when search by id, then it should return null', async () => {
    //Arrange
    const userQuery = new FindUserByIdQuery('string');

    //Act
    const user = await sut.execute(userQuery);

    //Assert
    expect(user).toBe(null);
    expect(cache.get).toHaveBeenCalledTimes(1);
    expect(cache.set).toHaveBeenCalledTimes(1);
    expect(cache.set).toHaveBeenCalledWith(expect.any(String), user, 5000);
  });
});
