'use server';
import prisma from '@/prisma';
import { EventWithInfo } from '@/types/events';
import { Event } from '@prisma/client';
import { getAttendeeByBadgeId } from './applications';

export async function getEvents(competitionCode: string): Promise<Event[]> {
  return await prisma.event.findMany({
    where: {
      competitionCode,
    },
  });
}

export async function getEventsWithInfo(
  competitionCode: string
): Promise<EventWithInfo[]> {
  const events = await getEvents(competitionCode);
  const numAttendees = await prisma.eventAttendee.groupBy({
    by: 'eventId',
    _count: {
      _all: true,
    },
  });

  return events.map((event) => ({
    ...event,
    numAttendees:
      numAttendees.find((num) => num.eventId === event.id)?._count._all || 0,
  }));
}

export async function createEvent(
  competitionCode: string,
  name: string
): Promise<void> {
  await prisma.event.create({
    data: {
      competitionCode,
      name,
    },
  });
}

export async function updateEvent(id: string, name: string): Promise<void> {
  console.log(id, name);
  await prisma.event.update({
    where: {
      id,
    },
    data: {
      name,
    },
  });
}

export async function markAttendance(
  eventId: string,
  badgeId: string
): Promise<boolean> {
  const applicationId = await getAttendeeByBadgeId(badgeId).then(
    (att) => att?.applicationId ?? null
  );

  if (!applicationId) return false;

  await prisma.eventAttendee.upsert({
    where: {
      eventId_applicationId: {
        eventId,
        applicationId,
      },
    },
    update: {},
    create: {
      eventId,
      applicationId,
    },
  });

  return true;
}
