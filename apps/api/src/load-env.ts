import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "dotenv";

const root = dirname(fileURLToPath(import.meta.url));

config({ path: resolve(root, "../.env") });
config({ path: resolve(root, "../../../packages/database/.env") });
