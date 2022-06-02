import { basecommand } from "./basecommand";

export default basecommand(
  [],
  {
    name: "ping",
  },
  async (context) => {
    await context.reply({ content: "pong" });
  }
);
