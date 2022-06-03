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
};

export type EditOrReply = string | (MessageOptions & MessageEditOptions);
export type EditOrRespond =
  | string
  | (InteractionReplyOptions & MessageEditOptions);

export async function editOrReplyMessage(context: Message, item: EditOrReply) {
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

export async function editOrRespond(context: Interaction, item: EditOrRespond) {
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
    if (context.isRepliable()) {
      reply = await context.reply(
        Object.assign<{}, typeof item, { fetchReply: true }>({}, item, {
          fetchReply: true,
        })
      );
    }
  }

  if (reply) {
    if (reply instanceof Message) {
      responses.set(context.id, reply);
    }
  }

  return reply as Message;
}

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
export function editOrReply(
  context: Message | Interaction,
  options: EditOrReply | EditOrRespond | string = {}
): Promise<Message | null> {
  if (typeof options === "string") {
    options = { content: options };
  }
  if (context instanceof Interaction) {
    return editOrRespond(context, {
      ...(options as Exclude<EditOrRespond, string>),
      allowedMentions: { parse: [], ...options.allowedMentions },
    }) as Promise<Message | null>;
  }
  return editOrReplyMessage(context, {
    ...(options as Exclude<EditOrReply, string>),
    allowedMentions: {
      parse: [],
      repliedUser: false,
      ...options.allowedMentions,
    },
  });
}
