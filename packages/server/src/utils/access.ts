import { v4 as uuidv4 } from "uuid";

export const generateAccessToken = () => {
  const uuid = uuidv4().replace("-", "");
  return `meridiandb_${uuid}`;
};
