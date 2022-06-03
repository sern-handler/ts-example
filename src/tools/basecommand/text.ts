import {
  CommandPlugin,
  CommandType,
  Context,
  EventPlugin,
  sernModule,
} from "@sern/handler";

import type { ModuleNoPlugins } from "@sern/handler/dist/handler/plugins/plugin";
export interface BaseCommandOptions
  extends Partial<Omit<ModuleNoPlugins[CommandType.Text], "execute">> {
  name: string;
}
export function BaseCommand(
  plugins: Array<
    CommandPlugin<CommandType.Text> | EventPlugin<CommandType.Text>
  >,
  options: BaseCommandOptions,
  exec: (context: Context, args: Array<string>) => Promise<void>
) {
  const filledOptions: Required<BaseCommandOptions> = Object.assign(
    {},
    { description: "...", type: CommandType.Text, alias: [] },
    options
  );

  return sernModule<CommandType.Text>(plugins, {
    ...filledOptions,
    execute(context, arg) {
      const [type, args] = arg;

      switch (type) {
        case "text":
          exec(context, args as Array<string>);
          return;
        case "slash":
          break;
      }
    },
  });
}
