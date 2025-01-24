import { getCompetitionDiscordId } from '@/actions/discord';
import SocialLinkConfiguration from '@/components/configure/SocialLinkConfiguaration';

interface Props {
  params: {
    code: string;
  };
}

export default async function SocialLinkPage({ params: { code } }: Props) {
  // Fetch the current social links (just discord for now)

  const compDiscordId = await getCompetitionDiscordId(code);

  return (
    <SocialLinkConfiguration
      code={code}
      discordId={compDiscordId?.attendeeDiscordRoleId ?? null}
    />
  );
}
