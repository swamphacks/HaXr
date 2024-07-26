'use client';

import { useState, useEffect } from 'react';
import {
  TextInput,
  Textarea,
  Select,
  Checkbox,
  Anchor,
  Divider,
  Button,
  Text,
} from '@mantine/core';
import { useForm, isEmail, isNotEmpty } from '@mantine/form';
import {
  ageChoices,
  schools,
  levelOfStudies,
  countries,
  questionType,
} from '@/types/questionTypes';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import { PhoneNumberUtil } from 'google-libphonenumber';
import { getResponse, saveResponse, submitResponse } from '@/app/actions/Forms';
import {
  Question,
  Agreement,
  FormSection,
  Application,
  ApplicationResponse,
} from '@/types/forms';
import { application, mantineForm, MantineForm } from '@/forms/application';

function loadInitialValues(formId: string, userId: string) {
  return getResponse(formId, userId);
}

export default function ViewForm() {
  const phoneUtil = PhoneNumberUtil.getInstance();
  const [isValid, setIsValid] = useState(false);
  const [phone, setPhone] = useState('');
  const userId = 'test-user';
  const formId = 'swamphacks-x-application';

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: mantineForm,
  });

  useEffect(() => {
    loadInitialValues(formId, userId).then((resp: ApplicationResponse) => {
      const values: Record<string, any> = {};
      for (const response of resp.general) {
        values[response.key] = response.value;
        console.log(response.key, response.value);
      }
      for (const response of resp.agreements) {
        values[response.key] = response.value;
        console.log(response.key, response.value);
      }
      Object.entries(resp.sections).forEach(([key, section]) => {
        for (const response of section) {
          values[response.key] = response.value;
        }
      });
      console.log(values);
      form.setValues(values);
      form.resetDirty();
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const isPhoneValid = (phone: string) => {
    try {
      return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone));
    } catch (error) {
      console.log(phone);
      console.log('not valid phone number');
      return false;
    }
  };

  const handlePhoneChange = (value: string) => {
    setPhone(value);
    form.setFieldValue('phoneNumber', value);
  };

  const handleSubmit = (values: any) => {};

  return (
    <form onSubmit={handleSubmit}>
      <div className='flex flex-col items-center'>
        <div className='m-[5rem] grid w-[30rem] grid-cols-1 gap-4'>
          <h1 className='mb-4 text-3xl font-bold text-white'>
            Application Form
          </h1>
          <div>
            <h1 className='text-2xl font-bold text-white'>General</h1>
            <Divider className='mt-1' />
            <h2 className='text-md mt-2 text-gray-400'>
              Disclaimer: The following responses will not have any impact on
              your application.
            </h2>
          </div>
          {application.general.questions.map((question: Question) => {
            switch (question.type) {
              case questionType.shortResponse:
              case questionType.email:
                return (
                  <TextInput
                    label={question.title}
                    key={form.key(question.key)}
                    required={question.required}
                    {...form.getInputProps(question.key)}
                  />
                );
              case questionType.paragraph:
                return (
                  <Textarea
                    label={question.title}
                    key={form.key(question.key)}
                    required={question.required}
                    {...form.getInputProps(question.key)}
                  />
                );
              case questionType.dropdown:
                return (
                  <Select
                    label={question.title}
                    key={form.key(question.key)}
                    data={question.choices}
                    placeholder='Select an option'
                    required={question.required}
                    {...form.getInputProps(question.key)}
                  />
                );
              case questionType.phone:
                return (
                  <div key={question.key}>
                    <Text size='sm'>
                      {question.title}{' '}
                      <span className='text-[var(--mantine-color-red-8)]'>
                        {' '}
                        *
                      </span>
                    </Text>
                    <PhoneInput
                      defaultCountry='us'
                      placeholder='Enter your phone number'
                      value={phone}
                      onChange={handlePhoneChange}
                    />
                  </div>
                );
            }
          })}
          {Object.entries(application.sections).map(([key, section]) => {
            return (
              <div key={key}>
                <h1 className='text-2xl font-bold text-white'>
                  {section.title}
                </h1>
                <Divider className='mt-1' />
                {section.questions.map((question: Question) => {
                  switch (question.type) {
                    case questionType.shortResponse:
                    case questionType.email:
                      return (
                        <TextInput
                          label={question.title}
                          key={form.key(question.key)}
                          required={question.required}
                          {...form.getInputProps(question.key)}
                        />
                      );
                    case questionType.paragraph:
                      return (
                        <Textarea
                          label={question.title}
                          key={form.key(question.key)}
                          required={question.required}
                          {...form.getInputProps(question.key)}
                          resize='vertical'
                        />
                      );
                    case questionType.dropdown:
                      return (
                        <Select
                          label={question.title}
                          key={form.key(question.key)}
                          data={question.choices}
                          placeholder='Select an option'
                          required={question.required}
                          {...form.getInputProps(question.key)}
                        />
                      );
                    case questionType.phone:
                      return (
                        <div key={question.key}>
                          <Text size='sm'>
                            {question.title}{' '}
                            <span className='text-[var(--mantine-color-red-8)]'>
                              {' '}
                              *
                            </span>
                          </Text>
                          <PhoneInput
                            defaultCountry='us'
                            placeholder='Enter your phone number'
                            value={phone}
                            onChange={handlePhoneChange}
                          />
                        </div>
                      );
                  }
                })}
              </div>
            );
          })}
          <div className='my-6 flex flex-col gap-4'>
            {application.agreements.map((agreement: Agreement) => {
              return (
                <Checkbox
                  label={agreement.label}
                  key={form.key(agreement.key)}
                  {...form.getInputProps(agreement.key, { type: 'checkbox' })}
                  required={agreement.required}
                />
              );
            })}
          </div>

          <Button variant='filled' color='green' type='submit'>
            Submit
          </Button>
        </div>
      </div>
    </form>
  );
}
