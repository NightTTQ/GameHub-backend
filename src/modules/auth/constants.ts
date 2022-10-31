import { readFileSync } from "fs";
import { join } from "path";

const key = readFileSync(join(__dirname, "../../../src/secrets/private.pem"), {
  encoding: "utf-8",
});
const cert = readFileSync(join(__dirname, "../../../src/secrets/public.pem"), {
  encoding: "utf-8",
});

export const jwtConstants = {
  key,
  cert,
};
