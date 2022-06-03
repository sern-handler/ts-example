import { CommandType, EventPlugin, PluginType } from "@sern/handler";

export function serendipityOnly<
  T extends CommandType.Text | CommandType.Slash | CommandType.Both
>(userId: string): EventPlugin<T> {
  return {
    type: PluginType.Event,
    description: "lock",
    execute([ctx], controller) {
      if (ctx.user.id !== userId) {
        return controller.stop();
      }
      return controller.next();
    },
  };
}
