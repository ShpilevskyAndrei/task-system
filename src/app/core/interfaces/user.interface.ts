export interface IUser {
  id: '';
  email: '';
  password?: '';
  avatar: '';
  displayName: '';
}

export interface IUserWithoutPass extends Omit<IUser, 'password'> {}
