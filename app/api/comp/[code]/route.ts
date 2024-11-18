import { NextRequest, NextResponse } from 'next/server';
import { getCompetition, getCompetitions } from '@/actions/competition';

export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  const code = params.code;
  return NextResponse.json(await getCompetition(code));
}
