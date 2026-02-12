'use server';

import { database } from '@repo/database';
import { auth } from '@repo/auth/server';
import { revalidatePath } from 'next/cache';

// Get all people with optional search
export async function getPeople(searchQuery = '') {
  const where = searchQuery
    ? {
        OR: [
          { firstName: { contains: searchQuery, mode: 'insensitive' } },
          { lastName: { contains: searchQuery, mode: 'insensitive' } },
          { occupation: { contains: searchQuery, mode: 'insensitive' } },
          { city: { contains: searchQuery, mode: 'insensitive' } },
        ],
      }
    : {};

  const people = await database.person.findMany({
    where,
    orderBy: { firstName: 'asc' },
    include: {
      connectionsFrom: {
        include: { toPerson: true },
      },
      connectionsTo: {
        include: { fromPerson: true },
      },
    },
  });

  return people;
}

// Get single person with connections
export async function getPerson(id) {
  const person = await database.person.findUnique({
    where: { id },
    include: {
      connectionsFrom: {
        include: { toPerson: true },
      },
      connectionsTo: {
        include: { fromPerson: true },
      },
    },
  });

  return person;
}

// Get person by userId (Clerk ID)
export async function getPersonByUserId(userId) {
  const person = await database.person.findFirst({
    where: { userId },
  });

  return person;
}

// Create person
export async function createPerson(data) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('Not authenticated');
  }

  const person = await database.person.create({
    data: {
      ...data,
      addedBy: userId,
    },
  });

  revalidatePath('/');
  return person;
}

// Update person
export async function updatePerson(id, data) {
  const person = await database.person.update({
    where: { id },
    data,
  });

  revalidatePath('/');
  revalidatePath(`/person/${id}`);
  return person;
}

// Delete person
export async function deletePerson(id) {
  await database.person.delete({
    where: { id },
  });

  revalidatePath('/');
}

// Get network stats
export async function getStats() {
  const { userId } = await auth();

  const totalPeople = await database.person.count();
  const totalConnections = await database.connection.count();

  // Get connections for current user's person
  const userPerson = await database.person.findFirst({
    where: { userId },
    include: {
      connectionsFrom: true,
      connectionsTo: true,
    },
  });

  const yourConnections =
    userPerson
      ? userPerson.connectionsFrom.length + userPerson.connectionsTo.length
      : 0;

  // People added in last 7 days
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const newThisWeek = await database.person.count({
    where: {
      createdAt: { gte: weekAgo },
    },
  });

  return {
    totalPeople,
    totalConnections,
    yourConnections,
    newThisWeek,
  };
}

// Get all connections for a person (combines from and to)
export async function getPersonConnections(personId) {
  const person = await database.person.findUnique({
    where: { id: personId },
    include: {
      connectionsFrom: {
        include: { toPerson: true },
      },
      connectionsTo: {
        include: { fromPerson: true },
      },
    },
  });

  if (!person) return [];

  // Combine and format connections
  const connections = [
    ...person.connectionsFrom.map((conn) => ({
      ...conn,
      person: conn.toPerson,
    })),
    ...person.connectionsTo.map((conn) => ({
      ...conn,
      person: conn.fromPerson,
    })),
  ];

  return connections;
}
