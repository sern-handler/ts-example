import { basecommand } from "../../tools/basecommand/text";

export default basecommand(
  [],
  {
    name: "ping",
  },
  async (context) => {
    await context.reply({ content: "pong" });
  }
);
