import { NextResponse } from 'next/server';
import superjson from 'superjson';

import prisma from '@/prisma';

export async function GET() {
  return NextResponse.json(await getCompetitions());
}
