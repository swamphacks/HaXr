import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { Pool } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';

/*
@params: 
    - code - string (required) - The competition code to checkin
    - id - string (required) - The user ID to search for (part of dynamic route)
@return: 
    - application - object - The user object (Status 200)
    - message - string - The error message (Status 404)
    - status - number - The status code of the request (All responses)

This route is used to find a user by their ID.

@example:
const response = await fetch('http://localhost:3000/api/user/shhewubuvduh32');
*/

export const GET = async (
  req: NextRequest,
  { params }: { params: { code: string; id: string } }
) => {
  const id = params.id;
  const code = params.code;

  const neon = new Pool({ connectionString: process.env.POSTGRES_PRISMA_URL });
  const adapter = new PrismaNeon(neon);
  const prisma = new PrismaClient({ adapter });

  const application = await prisma.application.findUnique({
    where: {
      competition_code_user_id: {
        competition_code: code,
        user_id: id,
      },
    },
    include: {
      user: true,
    },
  });

  if (application) return NextResponse.json({ app: application, status: 200 });
  else { 
    return NextResponse.json({
      message: 'Could not find application',
      status: 404,
    });
  }
};
