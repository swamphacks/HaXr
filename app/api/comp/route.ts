import { NextResponse } from 'next/server';
import superjson from 'superjson';

import prisma from '@/prisma';
import { getCompetitions } from '@/actions/competition';

export async function GET() {
  return NextResponse.json(await getCompetitions());
}
