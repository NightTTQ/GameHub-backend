import { readFileSync } from "fs";
import { join } from "path";

const key = readFileSync(join(__dirname, "../../src/secrets/private.pem"));
const cert = readFileSync(join(__dirname, "../../src/secrets/public.pem"));

export const jwtConstants = {
  key,
  cert,
};
