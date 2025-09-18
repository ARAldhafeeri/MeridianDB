export interface PasswordService {
  createPassword(password: string): Promise<CreatePasswordResponse>;
  createHashedPassword(password: string, salt: string): Promise<string>;
  verifyPassword(
    password: string,
    hashedPassword: string,
    salt: string
  ): Promise<string>;
}

export interface CreatePasswordResponse {
  hashedPassword: string;
  salt: string;
}
