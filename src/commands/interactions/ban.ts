import { ApplicationCommandOptionType } from "discord.js";
import { publish } from "../../plugins/slash-auto-publish";
import { BaseSlashCommand } from "../../tools/basecommand/slash";
import { editOrReply } from "../../tools/util";

export default BaseSlashCommand(
  [publish(["941002690211766332"])],
  {
    name: "ban",
    options: [
      {
        name: "user",
        type: ApplicationCommandOptionType.User,
        required: true,
        description: "...",
      },
    ],
  },
  async (context, arg) => {
    const user = arg.getUser("user");
    if (!user) {
      editOrReply(context.interaction, "not found");
      return;
    }
  }
);
