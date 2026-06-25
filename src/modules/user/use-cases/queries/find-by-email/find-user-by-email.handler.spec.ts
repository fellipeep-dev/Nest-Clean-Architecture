import { IUserRepository } from 'src/modules/user/domain/repositories/iuser.repository';
import { UserInMemoryRepository } from 'src/modules/user/infrastructure/user.in-memory-repository';
import { createUserDtoMock } from 'src/modules/user/domain/mocks/create-user.dto.mock';
import { FindUserByEmailHandler } from './find-user-by-email.handler';
import { FindUserByEmailQuery } from './find-user-by-email.query';

describe('FindUserByEmailHandler', () => {
  let sut: FindUserByEmailHandler;
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
    sut = new FindUserByEmailHandler(userRepository, cache as any);
  });

  it('given a unique email, when search a user, then it should find a user and cache it', async () => {
    //Arrange
    const { email } = await userRepository.create(createUserDtoMock);
    const userQuery = new FindUserByEmailQuery(email);

    //Act
    const user = await sut.execute(userQuery);

    //Assert
    expect(user).toMatchObject(createUserDtoMock);
    expect(cache.get).toHaveBeenCalledTimes(1);
    expect(cache.set).toHaveBeenCalledTimes(1);
    expect(cache.set).toHaveBeenCalledWith(expect.any(String), user, 5000);
  });

  it('given a cached user, when search by email, then it should return cache value', async () => {
    //Arrange
    const { email } = await userRepository.create(createUserDtoMock);
    const cachedUser = await userRepository.findByEmail(email);

    cache.get.mockResolvedValue(cachedUser);

    const userQuery = new FindUserByEmailQuery(email);

    const findByEmailSpy = jest.spyOn(userRepository, 'findByEmail');

    //Act
    const user = await sut.execute(userQuery);

    //Assert
    expect(user).toEqual(cachedUser);
    expect(cache.get).toHaveBeenCalledTimes(1);
    expect(findByEmailSpy).not.toHaveBeenCalled();
    expect(cache.set).not.toHaveBeenCalled();
  });

  it('given an invalid email, when search by email, then it should return null', async () => {
    //Arrange
    const userQuery = new FindUserByEmailQuery('string');

    //Act
    const user = await sut.execute(userQuery);

    //Assert
    expect(user).toBe(null);
    expect(cache.get).toHaveBeenCalledTimes(1);
    expect(cache.set).toHaveBeenCalledTimes(1);
    expect(cache.set).toHaveBeenCalledWith(expect.any(String), user, 5000);
  });
});
