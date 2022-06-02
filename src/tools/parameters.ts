import type { ImageExtension } from "@discordjs/rest/dist/lib/utils/constants";
import { Context } from "@sern/handler";
import { User } from "discord.js";

export namespace Parameters {
  export async function user(
    value: string | undefined,
    context: Context
  ): Promise<User | null> {
    if (!value) {
      return context.user;
    }

    const user = context.client.users.cache.find(
      (u) =>
        u.tag.toLowerCase().startsWith(value.toLowerCase()) ||
        u.tag.toLowerCase().includes(value.toLowerCase()) ||
        u.id === value.replace(/\D/g, "")
    );

    if (!user) {
      return null;
    }

    return user;
  }

  export function image(as?: ImageExtension) {
    return async (value: string | undefined, context: Context) => {
      if (!value) {
        return null;
      }

      const user = await Parameters.user(value, context);
      if (user) {
        return new URL(user.displayAvatarURL({ extension: as }));
      }

      try {
        return new URL(value);
      } catch {
        return null;
      }
    };
  }
}
