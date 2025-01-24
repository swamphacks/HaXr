import { NextRequest, NextResponse } from 'next/server';

const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN as string;

export interface DiscordLinkInfo {
  username: string;
  avatar: string | null;
}

interface DiscordProfile {
  id: string;
  username: string;
  avatar: string;
  discriminator: string;
  public_flags: number;
  flags: number;
  banner: string | null;
  accent_color: string | null;
  global_name: string | null;
  avatar_decoration_data: string | null;
  banner_color: string | null;
  clan: string | null;
  primary_guild: string | null;
}

/**
 * Gets the user's Discord profile from the Discord API. Needs to be done on server in order to not expose the token.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { snowflake: string } }
) {
  const { snowflake } = params;

  if (!DISCORD_BOT_TOKEN) {
    return NextResponse.json(
      { error: 'Discord bot token not set' },
      { status: 500 }
    );
  }

  try {
    const discordProfile = await fetch(
      `https://discord.com/api/users/${snowflake}`,
      {
        headers: {
          Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
        },
      }
    );

    if (discordProfile.status === 404) {
      return NextResponse.json(
        { error: 'Discord profile not found' },
        { status: 404 }
      );
    }

    if (discordProfile.status === 400) {
      console.log('Invalid Discord snowflake', await discordProfile.json());

      return NextResponse.json(
        { error: 'Invalid Discord snowflake' },
        { status: 400 }
      );
    }

    if (discordProfile.status === 401) {
      return NextResponse.json(
        { error: 'Unauthorized to fetch Discord profile' },
        { status: 401 }
      );
    }

    if (!discordProfile.ok) {
      return NextResponse.json(
        { error: 'Error fetching Discord profile' },
        { status: 500 }
      );
    }

    const discordProfileJson: DiscordProfile = await discordProfile.json();

    const avatarHash = discordProfileJson.avatar;

    return NextResponse.json(
      {
        username: discordProfileJson.username,
        avatar: `https://cdn.discordapp.com/avatars/${snowflake}/${avatarHash}.png`,
      } as DiscordLinkInfo,
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Error fetching Discord profile' },
      { status: 500 }
    );
  }
}
