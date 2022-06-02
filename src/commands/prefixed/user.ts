import { basecommand } from "../../tools/basecommand/text";
import { Parameters } from "../../tools/parameters";
import { editOrReply } from "../../tools/util";

export default basecommand(
  [],
  {
    name: "user",
  },
  async (context, [_user]) => {
    const user = await Parameters.user(_user, context);
    if (!user) {
      editOrReply(context, "not found");
      return;
    }
    editOrReply(context, user.tag || "w");
  }
);
