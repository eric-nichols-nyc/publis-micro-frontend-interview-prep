import "./load-env.js";
import { createApp } from "./app.js";
import { env } from "./config/env.js";

const app = createApp();
const { PORT } = env();

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
