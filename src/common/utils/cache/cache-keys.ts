export const CacheKeys = {
  USERS: {
    FIND_ALL: 'users:findAll',
    FIND_ALL_VERSION: `users:findAll:version`,

    FIND_BY_ID: (id: string) => `users:findById:${id}`,
    FIND_BY_EMAIL: (email: string) => `users:findByEmail:${email}`,
  },
};
