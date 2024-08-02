import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { Pool } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';

/*
@params: id - string (required) - The user ID to search for (part of dynamic route)
@return: 
    - user - object - The user object (Status 200)
    - message - string - The error message (Status 404)
    - status - number - The status code of the request (All responses)

This route is used to find a user by their ID.

@example:
const response = await fetch('http://localhost:3000/api/user/shhewubuvduh32');
*/

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const id = params.id;

  const neon = new Pool({ connectionString: process.env.POSTGRES_PRISMA_URL });
  const adapter = new PrismaNeon(neon);
  const prisma = new PrismaClient({ adapter });

  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) {
    return NextResponse.json({
      message: 'User not found',
      status: 404,
    });
  } else {
    return NextResponse.json({
      user,
      status: 200,
    });
  }
};
