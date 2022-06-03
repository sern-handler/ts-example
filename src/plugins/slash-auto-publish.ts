import {
  CommandPlugin,
  CommandType,
  PluginType,
  SernOptionsData,
} from "@sern/handler";
import { ApplicationCommandType } from "discord.js";

export function publish(
  guildIds: Array<string> | "global" = "global"
): CommandPlugin<CommandType.Slash> {
  return {
    type: PluginType.Command,
    description: "auto publish",
    name: "slash-auto-publish",
    async execute(client, module, controller) {
      function c(e: unknown) {
        console.error("publish command didnt work for", module.name!);
        console.error(e);
      }
      try {
        const commandData = {
          name: module.name!,
          type: CommandTypeRaw[module.type],
          description: module.description,
          options: optionsTransformer(module.options ?? []),
        };

        if (guildIds === "global") {
          await client.application!.commands.create(commandData).catch(c);
          return controller.next();
        }

        for (const id of guildIds) {
          const guild = await client.guilds.fetch(id).catch(c);
          if (!guild) continue;
          await guild.commands.create(commandData).catch(c);
        }
        return controller.next();
      } catch (e) {
        console.log("publish command did not work for " + module.name!);
        console.log(e);
        return controller.stop();
      }
    },
  };
}

export function optionsTransformer(ops: Array<SernOptionsData>) {
  return ops.map((el) =>
    el.autocomplete ? (({ command, ...el }) => el)(el) : el
  );
}

export const CommandTypeRaw = {
  [CommandType.Both]: ApplicationCommandType.ChatInput,
  [CommandType.MenuMsg]: ApplicationCommandType.Message,
  [CommandType.MenuUser]: ApplicationCommandType.User,
  [CommandType.Slash]: ApplicationCommandType.ChatInput,
} as const;
