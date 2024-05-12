import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { Pool } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';

/*
@params: uid - string (required) - The user ID to search for
@return: 
    - user - object - The user object (Status 200)
    - message - string - The error message (Status 404)
    - status - number - The status code of the request (All Statuses)

This route is used to find a user by their ID.

@example:
const response = await fetch('http://localhost:3000/api/user/find?uid=ksrwobgb3bdfh');
*/

export const GET = async (req: NextRequest) => {
  const neon = new Pool({ connectionString: process.env.POSTGRES_PRISMA_URL });
  const adapter = new PrismaNeon(neon);
  const prisma = new PrismaClient({ adapter });

  const user_id = req.nextUrl.searchParams.get('uid');

  if (user_id) {
    const user = await prisma.user.findUnique({
      where: {
        id: user_id,
      },
    });

    if (user) {
      return NextResponse.json({ user: user, status: 200 });
    } else {
      return NextResponse.json({ message: 'User not found!', status: 404 });
    }
  } else {
    return NextResponse.json({ message: 'Invalid request!', status: 404 });
  }
};
