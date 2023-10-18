export enum Role {
  Admin = 'admin',
  User = 'user',
}

export interface IUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  roles: Role[];
  avatar?: string;
  password?: string;
}
