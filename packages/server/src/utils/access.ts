import { randomBytes } from "node:crypto";

/**
 * Randomly generate access token with a prefix starting with meridiandb_
 * @returns string of randomly generated access token starting with meridiandb_ prefix
 */
export const generateAccessToken = () => {
  const randomHex = randomBytes(64).toString("hex");
  return `meridiandb_${randomHex}`;
};
