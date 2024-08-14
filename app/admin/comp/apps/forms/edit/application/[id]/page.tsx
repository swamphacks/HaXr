'use client'

import { CreateApplication } from '@/components/formCreator/FormCreator';

export default function Creator({ params }: { params: { id: string } }) {
	return <CreateApplication params={params} />;
}
