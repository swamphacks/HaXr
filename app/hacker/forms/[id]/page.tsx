"use client";

import { useEffect, useState } from 'react';
import { Form } from '@prisma/client';
import { Prisma, Form, FormSettings } from '@prisma/client';
import Question from '@/components/admin/Question';

export default function ViewForm({ params }: { params: { id: string } }) {
	const [form, setForm] = useState<Form | null>(null);
	const [loadingStatus, setLoadingStatus] = useState('loading');

	useEffect(() => {
		fetch(`/api/form/${params.id}`).then((res) => {
			if (res.ok) {
				res.json().then((data) => {
					setForm(data);
					setLoadingStatus('loaded');
				});
			} else if (res.status === 404) {
				setLoadingStatus('not found');
			} else {
				setLoadingStatus('error');
			}
		});
	}, [params.id]);

	if (loadingStatus === 'loading') {
		return <div>Loading...</div>;
	} else if (loadingStatus === 'not found') {
		return <div>Form not found</div>;
	} else {
		return (
			<div>
				<h1>{form?.title}</h1>
				{(form?.questions as Prisma.JsonArray).map((question) => (
					<Question key={question.id} question={question} />
				))}
			</div>
		);
	}
}
