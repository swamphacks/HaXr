'use server';
import AWS from 'aws-sdk';
import { render as renderTemplate, Data as TemplateData } from 'template-file';

const client = new AWS.SES({
  apiVersion: '2010-12-01',
  region: process.env.AWS_REGION ?? 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
  },
});

export interface Email {
  replyTo?: string | string[];
  to: string | string[];
  subject: string;
  body: string;
  isHtml?: boolean;
}

export async function sendEmail({
  to,
  replyTo,
  subject,
  body,
  isHtml = false,
}: Email): Promise<boolean> {
  const fromAddr = process.env.EMAIL_FROM;
  if (!fromAddr) {
    console.error('No FROM email address provided');
    return false;
  }

  try {
    const params: AWS.SES.SendEmailRequest = {
      Source: fromAddr,
      ReplyToAddresses: Array.isArray(replyTo)
        ? replyTo
        : [replyTo ?? fromAddr],

      Destination: {
        ToAddresses: Array.isArray(to) ? to : [to],
      },
      Message: {
        Subject: {
          Data: subject,
        },
        Body: {
          [isHtml ? 'Html' : 'Text']: {
            Data: body,
          },
        },
      },
    };

    const resp = await client.sendEmail(params).promise();
    if (resp.$response.error) throw new Error(resp.$response.error.message);
  } catch (e) {
    console.error(`Failed to send email with parameters ${e}`);
    return false;
  }

  return true;
}

export interface TemplateEmail extends Email {
  templateData: TemplateData;
}

/**
 * @see https://github.com/gsandf/template-file
 */
export const sendTemplateEmail = async (e: TemplateEmail): Promise<boolean> =>
  sendEmail({
    ...e,
    body: renderTemplate(e.body, e.templateData),
  });
