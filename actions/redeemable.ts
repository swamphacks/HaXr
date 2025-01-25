'use server';

import prisma from '@/prisma';
import { ValidationError } from 'yup';
import { Prisma } from '@prisma/client';
import {
  CreateRedeemableBody,
  UpdateRedeemableBody,
  CreateRedeemableResponse,
  UpdateRedeemableResponse,
  DeleteRedeemableResponse,
  CreateTransactionResponse,
  GetRedeemableResponse,
  InsufficientFundsError,
  GetRedeemableOptions,
  TransactionInfo,
  TransactionWithUserAndRedeemable,
} from '@/types/redeemable';
import {
  createRedeemableSchema,
  getRedeemableSchema,
  updateRedeemableSchema,
  createTransactionSchema,
} from '@/schemas/redeemable';

export async function getRedeemable(
  code: string,
  name: string
): Promise<GetRedeemableResponse> {
  const resp = await prisma.redeemable.findUnique({
    where: {
      competitionCode_name: {
        competitionCode: code,
        name: name,
      },
    },
  });

  if (!resp) return { status: 404, data: null };

  return { status: 200, data: resp };
}

export async function getRedeemables(options: GetRedeemableOptions) {
  const validatedOptions = await getRedeemableSchema.validate(options);
  console.log(validatedOptions);

  const canSkip =
    validatedOptions.cursor !== undefined &&
    validatedOptions.cursor.name !== undefined &&
    validatedOptions.cursor.competitionCode !== undefined;

  return await prisma.redeemable.findMany({
    take: validatedOptions.limit,
    skip: canSkip ? 1 : 0,
    cursor: canSkip
      ? {
          competitionCode_name: {
            // only way i could get ts to not complain - canSkip is true if both cursor values are defined
            competitionCode: validatedOptions!.cursor!.competitionCode ?? '',
            name: validatedOptions!.cursor!.name ?? '',
          },
        }
      : undefined,
    orderBy: {
      name: validatedOptions.sort as Prisma.SortOrder,
    },
    where: {
      competitionCode: validatedOptions.competitionCode,
      name: validatedOptions.name,
    },
  });
}

export async function createRedeemable(
  schema: CreateRedeemableBody
): Promise<CreateRedeemableResponse> {
  try {
    await createRedeemableSchema.validate(schema);
    const resp = await prisma.redeemable.create({
      data: {
        ...schema,
      },
    });
    return { status: 201, data: resp };
  } catch (e) {
    if (e instanceof ValidationError)
      return { status: 400, statusText: e.message, data: null };
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      switch (e.code) {
        case 'P2002':
          return {
            status: 409,
            statusText: 'Redeemable already exists',
            data: null,
          };
        case 'P2003':
          return {
            status: 404,
            statusText: 'Competition does not exist',
            data: null,
          };
      }
    }
    throw e;
  }
}

export async function updateRedeemable(
  prevCode: string,
  prevName: string,
  schema: UpdateRedeemableBody
): Promise<UpdateRedeemableResponse> {
  try {
    const vSchema = await updateRedeemableSchema.validate(schema);
    const resp = await prisma.redeemable.update({
      where: {
        competitionCode_name: {
          competitionCode: prevCode,
          name: prevName,
        },
      },
      data: {
        ...vSchema,
      },
    });
    return { status: 204, data: resp };
  } catch (e) {
    if (e instanceof ValidationError)
      return { status: 400, statusText: e.message, data: null };
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      switch (e.code) {
        case 'P2002':
          return {
            status: 409,
            statusText: 'Redeemable already exists',
            data: null,
          };
        case 'P2003':
          return {
            status: 404,
            statusText: 'Competition does not exist',
            data: null,
          };
        case 'P2025':
          return {
            status: 404,
            statusText: 'Redeemable does not exist',
            data: null,
          };
      }
    }
    throw e;
  }
}

export async function deleteRedeemable(
  competitionCode: string,
  name: string
): Promise<DeleteRedeemableResponse> {
  try {
    await prisma.redeemable.delete({
      where: {
        competitionCode_name: {
          competitionCode: competitionCode,
          name: name,
        },
      },
    });
    return { status: 204 };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025')
      return { status: 404, statusText: 'Redeemable does not exist' };
    throw e;
  }
}

export async function createTransaction(
  info: TransactionInfo
): Promise<CreateTransactionResponse> {
  try {
    const vInfo = await createTransactionSchema.validate(info);

    if (info.quantity > 0) {
      await prisma.transaction.create({
        data: {
          ...vInfo,
        },
      });
    } else {
      await prisma.$transaction(async (tx) => {
        // Get default quantity
        const redeemable = await tx.redeemable.findUniqueOrThrow({
          where: {
            competitionCode_name: {
              competitionCode: vInfo.competitionCode,
              name: vInfo.redeemableName,
            },
          },
        });

        // Calculate total quantity redeembed from transactions
        const aggregate = await tx.transaction.aggregate({
          where: {
            competitionCode: vInfo.competitionCode,
            redeemableName: vInfo.redeemableName,
          },
          _sum: {
            quantity: true,
          },
        });

        if (
          redeemable.quantity +
            (aggregate._sum?.quantity ?? 0) +
            vInfo.quantity <
          0
        ) {
          throw new InsufficientFundsError(
            'Insufficient quantity, unable to redeem.'
          );
        }

        // Record transaction
        await tx.transaction.create({
          data: {
            ...vInfo,
          },
        });
      });
    }

    return { status: 201 };
  } catch (e) {
    if (e instanceof ValidationError)
      return { status: 400, statusText: e.message };
    if (e instanceof InsufficientFundsError)
      return { status: 403, statusText: e.message };
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      switch (e.code) {
        case 'P2003':
          return {
            status: 404,
            statusText: 'competitionCode, userId, or redeemableName not found',
          };
        case 'P2025':
          return {
            status: 404,
            statusText: 'Redeemable does not exist',
          };
      }
    }

    throw e;
  }
}

export async function getTransactions(
  competitionCode: string
): Promise<TransactionWithUserAndRedeemable[] | undefined> {
  return await prisma.transaction.findMany({
    where: {
      competitionCode,
    },
    include: {
      attendee: {
        include: {
          user: true,
        },
      },
      redeemable: true,
    },
    orderBy: {
      transactedAt: 'desc',
    },
  });
}

export async function deleteTransaction(id: string) {
  try {
    await prisma.transaction.delete({
      where: {
        id,
      },
    });

    return { status: 204 };
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === 'P2025'
    ) {
      return {
        status: 404,
        statusText: 'Transaction does not exist',
      };
    }

    throw e;
  }
}
