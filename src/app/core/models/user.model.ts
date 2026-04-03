export interface User {
  id?: number;
  name: string;
  email: string;
}

export interface UserRegister {
  id?: number;
  name: string;
  email: string;
  password: string;
}

export interface UserAuth {
  email: string;
  password: string;
}
