import { getJWTSecret } from "@/config/context";
import { IAccessService } from "@/entities/interfaces/services/access";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

export class AccessService implements IAccessService {
  generateToken(payload: any, expiresIn: string): string {
    // jsonwebtoken StringValue issue, default is 30d;
    const exp = (expiresIn as any) || "30d";
    // return signed token
    return jwt.sign(
      {
        ...payload,
        originalExpiresIn: expiresIn,
        jti: uuidv4(),
      },
      getJWTSecret(),
      { expiresIn: exp }
    );
  }

  verifyToken(token: string): any {
    const decoded = jwt.verify(token, getJWTSecret());
    if (typeof decoded === "string") {
      return decoded;
    } else {
      return decoded;
    }
  }

  extractTokenFromAuthorizationHeader(authorizationHeader: string) {
    return authorizationHeader.split(" ")[1];
  }
}

export const getAccessService = () => new AccessService();
