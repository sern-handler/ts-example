import { CommandPlugin, CommandType, Module, PluginType } from "@sern/handler";
import {
  ApplicationCommandData,
  ApplicationCommandManager,
  ApplicationCommandType,
  GuildApplicationCommandManager,
} from "discord.js";
import { Ok } from "ts-results";

export function publish(
  guildIds: Array<string> | "global" = "global"
): CommandPlugin {
  return {
    type: PluginType.Command,
    description: "auto publish",
    name: "slash-auto-publish",
    async execute(client, module, controller) {
      if (client.application) {
        if (guildIds === "global") {
          await manage(module, client.application.commands);
        } else {
          for (const guildId of guildIds) {
            const guild = client.guilds.cache.get(guildId);
            if (guild) {
              await manage(module, guild.commands);
            }
          }
        }
      }
      return Ok(void 0);
    },
  };
}

export const CommandTypeRaw = {
  [CommandType.Both]: ApplicationCommandType.ChatInput,
  [CommandType.MenuMsg]: ApplicationCommandType.Message,
  [CommandType.MenuUser]: ApplicationCommandType.User,
  [CommandType.Slash]: ApplicationCommandType.ChatInput,
};

export function convert(data: Module): ApplicationCommandData | null {
  switch (data.type) {
    case CommandType.Both:
    case CommandType.MenuMsg:
    case CommandType.MenuUser:
    case CommandType.Slash:
      return {
        name: data.name!,
        description: data.description,
        type: CommandTypeRaw[data.type],
        options: "options" in data ? data.options : [],
      };
    default:
      return null;
  }
}

export function manage(
  module: Module,
  manager: GuildApplicationCommandManager | ApplicationCommandManager
) {
  const existing = manager.cache.find((x) => x.name === module.name);

  if (existing) {
    return manager.edit(existing, convert(module)!);
  }

  return manager.create(convert(module)!);
}
