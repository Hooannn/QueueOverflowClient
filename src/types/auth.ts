export interface IUser {
  role: IRole;
}

type IRole = 'User' | 'Admin' | 'SuperAdmin';
