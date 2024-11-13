import { sendEmail } from '@/actions/email';

export default async function Email() {
  const ret = await sendEmail({
    replyTo: 'contact@swamphacks.com',
    to: 'rconde2003@gmail.com',
    subject: '🦄 Beware, things again!',
    body: 'Royal, you are the best!',
  });

  return ret ? <div>Success</div> : <div>Failed</div>;
}
