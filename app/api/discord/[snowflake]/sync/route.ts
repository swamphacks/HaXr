import { getUserCompetitionRoles } from '@/actions/discord';
import { NextRequest, NextResponse } from 'next/server';

const SECRET_ACCESS_KEY = process.env.SECRET_ACCESS_KEY as string;

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

  if (token !== SECRET_ACCESS_KEY)
    return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });

  const roles = await getUserCompetitionRoles(snowflake);

  if (roles.result === 'error')
    return NextResponse.json({ error: roles.error }, { status: 400 });

  return NextResponse.json({ roles: roles.roles }, { status: 200 });
}
