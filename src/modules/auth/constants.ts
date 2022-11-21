import { readFileSync } from "fs";
import { join } from "path";

const key = readFileSync(join(__dirname, "../../secrets/private.pem"), {
  encoding: "utf-8",
});
const cert = readFileSync(join(__dirname, "../../secrets/public.pem"), {
  encoding: "utf-8",
});

export const jwtConstants = {
  key,
  cert,
};
