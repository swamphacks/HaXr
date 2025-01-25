import { getUserCompetitionRoles } from '@/actions/discord';
import { NextRequest, NextResponse } from 'next/server';

const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN as string;

/**
 * Gets the user's Discord profile from the Discord API. Needs to be done on server in order to not expose the token.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { snowflake: string } }
) {
  const { snowflake } = params;

  const authHeader = request.headers.get('Authorization');

  if (!authHeader || !authHeader.startsWith('Bot ')) {
    return NextResponse.json(
      { error: 'Poorly formatted token' },
      { status: 400 }
    );
  }

  const token = authHeader.replace('Bot ', '');

  if (token !== DISCORD_BOT_TOKEN)
    return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });

  const roles = await getUserCompetitionRoles(snowflake);

  if (roles.result === 'error')
    return NextResponse.json({ error: roles.error }, { status: 400 });

  return NextResponse.json({ roles: roles.roles }, { status: 200 });
}
