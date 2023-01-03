import * as crypto from "crypto";

export const hash = (str: string): string => {
  return crypto.createHash("sha1").update(str).digest("hex");
};
