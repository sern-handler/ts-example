import {
  CommandPlugin,
  CommandType,
  Context,
  EventPlugin,
  sernModule,
  SlashOptions,
} from "@sern/handler";

import type { ModuleNoPlugins } from "@sern/handler/dist/handler/plugins/plugin";
export interface BaseCommandOptions
  extends Partial<Omit<ModuleNoPlugins[CommandType.Slash], "execute">> {
  name: ModuleNoPlugins[CommandType.Slash]["name"];
  options: ModuleNoPlugins[CommandType.Slash]["options"];
}
export function BaseSlashCommand(
  plugins: Array<
    CommandPlugin<CommandType.Slash> | EventPlugin<CommandType.Slash>
  >,
  options: BaseCommandOptions,
  exec: (context: Context, args: SlashOptions) => Promise<void>
) {
  const filledOptions: Required<BaseCommandOptions> = Object.assign(
    {},
    { description: "...", type: CommandType.Slash, name: "", options: [] },
    options
  );

  return sernModule<CommandType.Slash>(plugins, {
    ...filledOptions,
    execute(context, arg) {
      const [type, args] = arg;

      switch (type) {
        case "slash":
          exec(context, args as SlashOptions);
          return;
        case "text":
          break;
      }
    },
  });
}
