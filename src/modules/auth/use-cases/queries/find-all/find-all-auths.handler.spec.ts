import { IAuthRepository } from 'src/modules/auth/domain/repositories/iauth.repository';
import { FindAllAuthsHandler } from './find-all-auths.handler';
import { AuthInMemoryRepository } from 'src/modules/auth/infrastructure/auth.in-memory-repository';
import { FindAllAuthsQuery } from './find-all-auths.query';
import { createAuthDtoMock } from 'src/modules/auth/domain/mocks/create-auth.dto.mock';

describe('FindAllAuthsHandler', () => {
  let sut: FindAllAuthsHandler;
  let authRepository: IAuthRepository;

  const cache = {
    get: jest.fn(),
    set: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    cache.get.mockResolvedValue(undefined);
    cache.set.mockResolvedValue(true);

    authRepository = new AuthInMemoryRepository();
    sut = new FindAllAuthsHandler(authRepository, cache as any);
  });

  it('given existing auths and no cached result, when search all auths, then it should find and cache them', async () => {
    //Arrange
    const auth1 = await authRepository.create(createAuthDtoMock);
    const auth2 = await authRepository.create(createAuthDtoMock);
    const authQuery = new FindAllAuthsQuery({});

    //Act
    const auths = await sut.execute(authQuery);

    //Assert
    expect(auths).toMatchObject([auth1, auth2]);
    expect(auths).toHaveLength(2);
    expect(cache.get).toHaveBeenCalledTimes(2);
    expect(cache.set).toHaveBeenCalledTimes(1);
    expect(cache.set).toHaveBeenCalledWith(expect.any(String), auths, 5000);
  });

  it('given cached auths, when search all auths, then it should return cached auths', async () => {
    //Arrange
    await authRepository.create(createAuthDtoMock);
    await authRepository.create(createAuthDtoMock);
    const cachedAuths = await authRepository.findAll({});

    cache.get.mockResolvedValue(cachedAuths);

    const authQuery = new FindAllAuthsQuery({});

    const findAllAuthsSpy = jest.spyOn(authRepository, 'findAll');

    //Act
    const auths = await sut.execute(authQuery);

    //Assert
    expect(auths).toEqual(cachedAuths);
    expect(cache.get).toHaveBeenCalledTimes(2);
    expect(findAllAuthsSpy).not.toHaveBeenCalled();
    expect(cache.set).not.toHaveBeenCalled();
  });

  it('given no auths, when search all auths, then it should return an empty list and cache it', async () => {
    //Arrange
    const authQuery = new FindAllAuthsQuery({});

    //Act
    const auths = await sut.execute(authQuery);

    //Assert
    expect(auths).toMatchObject([]);
    expect(cache.get).toHaveBeenCalledTimes(2);
    expect(cache.set).toHaveBeenCalledTimes(1);
    expect(cache.set).toHaveBeenCalledWith(expect.any(String), auths, 5000);
  });
});
