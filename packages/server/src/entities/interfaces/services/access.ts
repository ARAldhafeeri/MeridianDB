import { JWTPayload } from "@meridiandb/shared/src/entities/auth";

export interface IAccessService {
  /**
   *
   * @param payload
   * @param expiresIn
   * used to generate both access and refresh tokens
   */
  generateToken(payload: any, expiresIn: string): string;

  // verify tokens
  verifyToken(token: string): JWTPayload | string;
}
