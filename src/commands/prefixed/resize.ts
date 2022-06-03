import { APIs } from "pariah";
import { BaseCommand } from "../../tools/basecommand/text";
import { Parameters } from "../../tools/parameters";
import { editOrReply } from "../../tools/util";

export default BaseCommand(
  [],
  {
    name: "resize",
  },
  async (context, [_url, _amount]) => {
    const [url, amount] = [
      await Parameters.image("png")(_url, context),
      _amount,
    ];
    if (!url) {
      editOrReply(context.message, "invalid url");
      return;
    }

    if (!amount) {
      editOrReply(context.message, "invalid amount");
      return;
    }

    const instance = new APIs.Jonathan.API("sern:sern");
    const { payload } = await instance.imageResize(url.toString(), amount);

    editOrReply(context.message, {
      files: [payload],
    });
  }
);
