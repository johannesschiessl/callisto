import { z } from "zod";
import { env } from "./env";

const configSchema = z.object({
  agentDirectory: z.string().default("./callisto"),
});

export type Config = z.infer<typeof configSchema>;

const CONFIG_PATH = env.CONFIG_DIR + "/config.json";

async function loadConfig(): Promise<Config> {
  const file = Bun.file(CONFIG_PATH);

  if (await file.exists()) {
    const raw = await file.json();
    return configSchema.parse(raw);
  }

  const defaults = configSchema.parse({});
  await Bun.write(CONFIG_PATH, JSON.stringify(defaults, null, 2) + "\n");
  return defaults;
}

export const config = await loadConfig();
