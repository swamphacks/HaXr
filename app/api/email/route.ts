import { NextResponse } from 'next/server';
import { sendTemplateEmail } from '@/actions/email';
import { Status } from '@prisma/client';
import { getApplicants } from '@/actions/applications';
import { HackerApplicationFormValues } from '@/app/hacker/application/[code]/page';
import assert from 'assert';

interface HTMLEmailTemplate {
  subject: string;
  body: string;
  isHtml: true;
}

const StatusEmail: Record<Status, HTMLEmailTemplate | null> = {
  [Status.STARTED]: null,
  [Status.APPLIED]: null,

  [Status.ACCEPTED]: {
    subject: '[ACTION REQUIRED] Update on SwampHacks X Application',
    body: `Hello {{firstName}} {{lastName}},<br>
<br>
Thank you for taking the time to apply to SwampHacks X as a Hacker!<br>
<br>
Since 2016, SwampHacks has been organizing hackathons at the University of Florida for students to develop their technical and professional skills in a community that fosters innovation and creativity.<br>
<br>
Congratulations on your acceptance to SwampHacks X! 🎉 The event will take place over 24 hours from January 25th to January 26th, 2025. This year's venue will be Newell Hall and the 3rd floor of Marston Science Library.<br>
<br>
To confirm your attendance, please complete the following steps by <b style="color: red;">January 10th, 2025</b>:<br>

<ol>
    <li>Confirm your attendance on your <a href="https://app.swamphacks.com/hacker">Hacker dashboard</a>.<br><i>You will need your "Application ID" that is available after confirming your attendance for the participation form.</i></li>
    <li>Sign up for the <a href="https://swamphacksx.devpost.com/">Devpost</a>.</li>
</ol>
You will also need to fill out the <a href="https://forms.office.com/r/qvMdjQsuzx">SH-X Participation Confirmation Form</a> anytime before check-in on January 25th, 2025.<br>
<br>
Additionally, please follow our <a href="https://www.instagram.com/ufswamphacks/">Instagram</a> and join our <a href="https://discord.com/invite/NfRPv9JtAG">Discord</a> server. These platforms will be our main channels of communication throughout the event.  Please continue to monitor your email for specific information regarding team formation, arrival times, scheduled activities, meals, and more.<br>
<br>
Please direct any questions to <a href="mailto:contact@swamphacks.com">contact@swamphacks.com</a>.<br>
<br>
We look forward to seeing you at SwampHacks X!<br>
<br>
<b>SwampHacks X Directors</b><br>`,
    isHtml: true,
  },
  [Status.REJECTED]: {
    subject: 'Update on SwampHacks X Application',
    body: `Hello {{firstName}} {{lastName}},<br>
<br>
We would like to thank you for taking the time to apply for SwampHacks X as a participant, this year we received a record number of applications and are truly grateful for your interest in our event.<br>
<br>
Unfortunately, we are unable to extend you an invitation to participate in SwampHacks X at this time.
<br>
We sincerely appreciate your interest, and encourage you to apply for our next event. Please direct all questions to <a href="mailto:contact@swamphacks.com">contact@swamphacks.com</a>.<br>
<br>
<b>SwampHacks X Directors</b><br>`,
    isHtml: true,
  },
  [Status.WAITLISTED]: {
    subject: 'HackSC Application Decision',
    body: `Hello {{firstName}} {{lastName}},<br>
<br>
We would like to thank you for taking the time to apply for SwampHacks X as a participant, this year we received a record number of applications and are truly grateful for your interest in our event.<br>
<br>
Unfortunately, we are unable to extend you an invitation to participate in SwampHacks X at this time. However, we will be organizing an on-site waiting list on the day of the event from which you may be admitted. If this interests you, please monitor our <a href="https://www.instagram.com/ufswamphacks/">Instagram</a> and <a href="https://discord.com/invite/NfRPv9JtAG">Discord</a> prior to the event which is where we will be posting updates.<br>
<br>
We sincerely appreciate your interest, and encourage you to apply for our next event.<br>
<br>
Please direct all questions to <a href="mailto:contact@swamphacks.com">contact@swamphacks.com</a>.<br>
<br>
<b>SwampHacks X Directors</b><br>`,
    isHtml: true,
  },

  [Status.ATTENDING]: null,
  [Status.NOT_ATTENDING]: null,
};

export async function GET() {
  // //   console.log(
  // //     await getApplicants('x').then((apps) =>
  // //       apps
  // //         .filter(({ user: { firstName } }) => firstName == 'Robert')
  // //         .map(({ user: { firstName, lastName } }) => `${firstName} ${lastName}`)
  // //     )
  // //   );
  // assert(false);
  const applications = (await getApplicants('x'))
    .filter(
      ({ status, user: { firstName, lastName } }) =>
        status === Status.ACCEPTED &&
        firstName === 'Amanda' &&
        lastName === 'Brannon'
    )
    .map(({ content, status }) => ({
      status,
      form: content as unknown as HackerApplicationFormValues,
    }));
  console.log(applications);
  // console.log(applications);
  // assert(applications.length === 1, 'Expected one application');

  let failures: string[] = [];
  for (const {
    status,
    form: { email: to, firstName, lastName },
  } of applications) {
    const template = StatusEmail[Status.ACCEPTED];
    if (!template) {
      failures.push(`${firstName} ${lastName} has status ${status}`);
      console.error(failures[failures.length - 1]);
      continue;
    }

    const result = sendTemplateEmail({
      to,
      replyTo: 'contact@swamphacks.com',
      ...template,
      templateData: {
        firstName,
        lastName,
      },
    });
    if (!(await result)) {
      failures.push(`${firstName} ${lastName} (${to}) failed to send email`);
      console.error(failures[failures.length - 1]);
      continue;
    }

    console.log(`Sent email to ${firstName} ${lastName} (${to})`);
  }
  console.log(`Failures: ${failures.length}`);

  return NextResponse.json({
    success: failures.length === 0,
    failures,
  });
}
