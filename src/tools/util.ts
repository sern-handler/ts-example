import { Context } from "@sern/handler";
import { Message, MessageEditOptions, MessageOptions } from "discord.js";

export const responses = new Map<string, Message>();
export const defaultResponseOptions: MessageOptions & MessageEditOptions = {
  attachments: [],
  components: [],
  content: "",
  embeds: [],
};

export async function editOrReply(
  context: Message | Context,
  item: string | (MessageOptions & MessageEditOptions)
) {
  if (context instanceof Context) {
    context = context.message;
  }

  if (typeof item === "string") {
    item = { content: item };
  }

  item = Object.assign({ allowedMentions: {} }, item);

  let reply;

  if (responses.has(context.id)) {
    item = Object.assign(defaultResponseOptions, item);

    const old = responses.get(context.id)!;
    reply = await old.edit(item);
  } else {
    reply = await context.reply(item);
  }

  responses.set(context.id, reply);

  return reply;
}
