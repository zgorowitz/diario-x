'use server';

import { database } from '@repo/database';
import { auth } from '@repo/auth/server';
import { revalidatePath } from 'next/cache';

// Calculate connection strength based on relationship types and years known
function calculateStrength(relationshipTypes, whenMetYear) {
  let baseStrength = 5;

  // Family relationships have highest strength
  if (relationshipTypes.some((type) => type.toLowerCase().includes('family'))) {
    baseStrength = 10;
  } else if (
    relationshipTypes.some(
      (type) =>
        type.toLowerCase().includes('spouse') ||
        type.toLowerCase().includes('parent') ||
        type.toLowerCase().includes('child') ||
        type.toLowerCase().includes('sibling')
    )
  ) {
    baseStrength = 10;
  } else if (
    relationshipTypes.some((type) => type.toLowerCase().includes('friend'))
  ) {
    baseStrength = 7;
  } else if (
    relationshipTypes.some((type) => type.toLowerCase().includes('best'))
  ) {
    baseStrength = 9;
  } else if (
    relationshipTypes.some(
      (type) =>
        type.toLowerCase().includes('colleague') ||
        type.toLowerCase().includes('boss') ||
        type.toLowerCase().includes('mentor')
    )
  ) {
    baseStrength = 5;
  }

  // Add time multiplier if we know when they met
  if (whenMetYear) {
    const currentYear = new Date().getFullYear();
    const yearsKnown = currentYear - whenMetYear;
    const timeMultiplier = Math.min(yearsKnown * 0.1, 2); // Cap at 2x
    return baseStrength * (1 + timeMultiplier);
  }

  return baseStrength;
}

// Create connection between two people
export async function createConnection(fromPersonId, toPersonId, data) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('Not authenticated');
  }

  // Check if connection already exists (in either direction)
  const existing = await database.connection.findFirst({
    where: {
      OR: [
        { fromPersonId, toPersonId },
        { fromPersonId: toPersonId, toPersonId: fromPersonId },
      ],
    },
  });

  if (existing) {
    throw new Error('Connection already exists');
  }

  // Calculate strength
  const strength = calculateStrength(
    data.relationshipTypes || [],
    data.whenMetYear
  );

  const connection = await database.connection.create({
    data: {
      fromPersonId,
      toPersonId,
      relationshipTypes: data.relationshipTypes || [],
      howMet: data.howMet,
      whenMetYear: data.whenMetYear,
      strengthScore: strength,
      createdBy: userId,
    },
  });

  revalidatePath('/');
  revalidatePath(`/person/${fromPersonId}`);
  revalidatePath(`/person/${toPersonId}`);

  return connection;
}

// Update connection
export async function updateConnection(id, data) {
  // Recalculate strength if relationship types or whenMetYear changed
  let strength;
  if (data.relationshipTypes || data.whenMetYear) {
    const existing = await database.connection.findUnique({
      where: { id },
    });

    strength = calculateStrength(
      data.relationshipTypes || existing.relationshipTypes,
      data.whenMetYear !== undefined
        ? data.whenMetYear
        : existing.whenMetYear
    );
  }

  const connection = await database.connection.update({
    where: { id },
    data: {
      ...data,
      ...(strength !== undefined && { strengthScore: strength }),
    },
  });

  revalidatePath('/');
  return connection;
}

// Delete connection
export async function deleteConnection(id) {
  await database.connection.delete({
    where: { id },
  });

  revalidatePath('/');
}

// Get all relationship types
export async function getRelationshipTypes() {
  const types = await database.relationshipType.findMany({
    orderBy: [{ category: 'asc' }, { name: 'asc' }],
  });

  return types;
}

// Get relationship types grouped by category
export async function getRelationshipTypesByCategory() {
  const types = await getRelationshipTypes();

  const grouped = types.reduce((acc, type) => {
    const category = type.category || 'other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(type);
    return acc;
  }, {});

  return grouped;
}
