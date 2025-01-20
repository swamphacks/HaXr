'use server';

import prisma from '@/prisma';
import { Prisma, Redeemable } from '@prisma/client';
import { UpdateRedeemable } from '@/types/redeemable';
import { createRedeemableSchema } from '@/schemas/redeemable';


export async function getRedeemables(competitionCode: string | null) {
	if (competitionCode) {
		return await prisma.redeemable.findMany({
			where: {
				competitionCode,
			},
		});
	} else return await prisma.redeemable.findMany({});
}

export async function createRedeemable(schema: Redeemable) {
	await createRedeemableSchema.validate(schema)
	await prisma.redeemable.create({
		data: {
			...schema,
		},
	});

	return true;
}

export async function updateRedeemable(schema: UpdateRedeemable) {

	await createRedeemableSchema.validate(schema)
	await prisma.redeemable.update({
		where: {
			competitionCode_name: {
				competitionCode: schema.old.competitionCode,
				name: schema.old.name,
			}
		},
		data: {
			...schema.new,
		},
	});
}

export async function deleteRedeemable(schema: Redeemable) {
	await createRedeemableSchema.validate(schema)
	await prisma.redeemable.delete({
		where: {
			competitionCode_name: {
				competitionCode: schema.competitionCode,
				name: schema.name,
			}
		},
	});
}
