import { NextResponse } from 'next/server';
import superjson from 'superjson';

import prisma from '@/prisma';

export async function GET() {
  const competitions = await prisma.competition.findMany({
    orderBy: {
      start_date: 'desc', // Most recent first
    },
  });

  return NextResponse.json(superjson.stringify(competitions));
}
