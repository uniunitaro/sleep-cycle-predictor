jest.mock('src/auth/auth.service', () => ({
  AuthService: jest.fn().mockImplementation(() => ({
    getAuthUser: jest.fn(),
    verifyIdToken: jest.fn(),
  })),
}))
