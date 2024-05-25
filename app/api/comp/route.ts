import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { Pool } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';

export async function GET(req: NextRequest) {
  const neon = new Pool({ connectionString: process.env.POSTGRES_PRISMA_URL });
  const adapter = new PrismaNeon(neon);
  const prisma = new PrismaClient({ adapter });

  const competitions = await prisma.competition.findMany({
    orderBy: {
      start_date: 'desc', // Most recent first
    },
  });

  return NextResponse.json(competitions);
}
