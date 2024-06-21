'use server';

import { AdminLink } from '@prisma/client';
import prisma from '@/prisma';

export const getAdminLinks = async (): Promise<AdminLink[]> =>
  prisma.adminLink.findMany({ orderBy: { name: 'asc' } });
