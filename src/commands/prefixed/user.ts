import { BaseCommand } from "../../tools/basecommand/text";
import { Parameters } from "../../tools/parameters";
import { editOrReply } from "../../tools/util";

export default BaseCommand(
  [],
  {
    name: "user",
  },
  async (context, [_user]) => {
    const user = await Parameters.user(_user, context);
    if (!user) {
      editOrReply(context.message, "not found");
      return;
    }
    editOrReply(context.message, user.tag || "w");
  }
);
