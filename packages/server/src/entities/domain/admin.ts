import { BaseEntity } from "./base";

// simple admin entity
export interface Admin extends BaseEntity {
  firstName?: string;
  lastName?: string;
  email: string;
  // one-way password hash
  salt: string;
  hash: string;
}
