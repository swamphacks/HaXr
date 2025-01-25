/*
 * This page is the link flow for those seeking to link the discord account to their hacker account.
 * This route should be initiated from the discord bot.
 */

import DiscordLinkMain from '@/components/discordLink/DiscordLinkMain';
import { Suspense } from 'react';

export default function DiscordLinkPage() {
  return (
    <Suspense>
      <DiscordLinkMain />
    </Suspense>
  );
}
