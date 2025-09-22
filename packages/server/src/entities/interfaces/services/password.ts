export interface IPasswordService {
  createPassword(password: string): Promise<CreatePasswordResponse>;
  verifyPassword(
    password: string,
    hashedPassword: string,
    salt: string
  ): Promise<boolean>;
}

export interface CreatePasswordResponse {
  hashedPassword: string;
  salt: string;
}
