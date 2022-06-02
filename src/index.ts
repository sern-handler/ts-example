import { Sern } from "@sern/handler";
import { Client, GatewayIntentBits } from "discord.js";

// load env
import dotenv from "dotenv";
dotenv.config();

const ALL_INTENTS = Object.values(GatewayIntentBits).reduce(
  (a, b) => a | (typeof b === "string" ? 0 : b),
  0
);

const client = new Client({
  intents: ALL_INTENTS,
  ws: {
    properties: {
      $browser: "Discord iOS",
    },
  },
});

Sern.init({ client, commands: "dist/commands/prefixed", defaultPrefix: "^" });

client.on("messageUpdate", (old, _new) => {
  if (old.content === _new.content) return;
  // @ts-ignore
  old.client.emit("messageCreate", _new);
});

client.login(process.env.TOKEN);
