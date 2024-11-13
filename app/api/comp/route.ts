import { NextResponse } from 'next/server';
import { getCompetitions } from '@/actions/competition';

export async function GET() {
  return NextResponse.json(await getCompetitions());
}
