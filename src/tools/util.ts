import {
  Interaction,
  InteractionReplyOptions,
  Message,
  MessageEditOptions,
  MessageOptions,
} from "discord.js";

export const responses = new Map<string, Message>();
export const defaultResponseOptions: MessageOptions & MessageEditOptions = {
  attachments: [],
  components: [],
  content: "",
  embeds: [],
  allowedMentions: {},
};

export type EditOrReply = string | (MessageOptions & MessageEditOptions);
export type EditOrRespond =
  | string
  | (InteractionReplyOptions & MessageEditOptions);

export function editOrReply(
  context: Message,
  options: EditOrReply | string
): Promise<Message>;
export function editOrReply(
  context: Interaction,
  options: EditOrRespond | string
): Promise<null>;
export function editOrReply(
  context: Message | Interaction,
  options: EditOrReply | EditOrRespond | string
): Promise<Message | null>;
export async function editOrReply(
  context: Message | Interaction,
  options: EditOrReply | EditOrRespond | string = {}
): Promise<Message | null> {
  if (typeof options === "string") {
    options = { content: options };
  }

  let reply: Message | null = null;

  if (responses.has(context.id)) {
    options = Object.assign(defaultResponseOptions, options);

    const old = responses.get(context.id)!;
    reply = await old.edit(options);
  } else {
    if (context instanceof Message) {
      reply = await context.reply(options as EditOrReply);
    } else {
      if (context.isRepliable()) {
        reply = (await context.reply(
          Object.assign(options as EditOrRespond, { fetchReply: true })
        )) as unknown as Message; // this is stupid
      }
    }
  }

  if (reply) {
    if (reply instanceof Message) {
      responses.set(context.id, reply);
    }
  }

  return reply;
}
