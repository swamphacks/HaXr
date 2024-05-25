import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { Pool } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';

export async function GET(req: NextRequest, { code }: { code: string }) {
  const neon = new Pool({ connectionString: process.env.POSTGRES_PRISMA_URL });
  const adapter = new PrismaNeon(neon);
  const prisma = new PrismaClient({ adapter });

  const competitions = await prisma.form.findMany({
    where: {
      competition_code: code,
    },
    orderBy: {
      update_at: 'desc', // Most recent first
    },
  });

  return NextResponse.json(competitions);
}
