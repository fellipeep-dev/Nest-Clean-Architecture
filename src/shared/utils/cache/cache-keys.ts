export const CacheKeys = {
  USERS: {
    FIND_ALL: 'users:findAll',
    FIND_ALL_VERSION: 'users:findAll:version',

    FIND_BY_ID: (id: string) => `users:findById:${id}`,
    FIND_BY_IDENTIFIER: (key: string, value: string) =>
      `users:findBy${key}:${value}`,
  },
  AUTH: {
    FIND_ALL: 'auths:findAll',
    FIND_ALL_VERSION: 'auths:findAll:version',

    FIND_BY_ID: (id: string) => `auths:findById:${id}`,
    FIND_BY_IDENTIFIER: (key: string, value: string) =>
      `auths:findBy${key}:${value}`,
  },
};
