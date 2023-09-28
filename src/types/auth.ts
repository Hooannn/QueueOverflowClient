export enum Role {
  Admin = 'admin',
  User = 'user',
}

export interface IUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  roles: Role[];
  avatar?: string;
  password?: string;
}
