const { PrismaClient } = require('./generated/client');

const prisma = new PrismaClient();

const relationshipTypes = [
  // Family (strength 10)
  { name: 'Family', category: 'family', strength: 10, color: '#FF6B6B' },
  { name: 'Parent', category: 'family', strength: 10, color: '#FF6B6B' },
  { name: 'Sibling', category: 'family', strength: 10, color: '#FF6B6B' },
  { name: 'Child', category: 'family', strength: 10, color: '#FF6B6B' },
  { name: 'Spouse', category: 'family', strength: 10, color: '#FF6B6B' },

  // Friends (strength 7-9)
  { name: 'Friend', category: 'friend', strength: 7, color: '#4ECDC4' },
  { name: 'Best Friend', category: 'friend', strength: 9, color: '#4ECDC4' },
  { name: 'Childhood Friend', category: 'friend', strength: 8, color: '#4ECDC4' },
  { name: 'Acquaintance', category: 'friend', strength: 4, color: '#4ECDC4' },

  // Professional (strength 5-7)
  { name: 'Colleague', category: 'professional', strength: 5, color: '#95E1D3' },
  { name: 'Boss', category: 'professional', strength: 6, color: '#95E1D3' },
  { name: 'Mentor', category: 'professional', strength: 7, color: '#95E1D3' },
  { name: 'Client', category: 'professional', strength: 4, color: '#95E1D3' },

  // Community (strength 4)
  { name: 'Neighbor', category: 'community', strength: 4, color: '#F38181' },

  // Education (strength 5-6)
  { name: 'Classmate', category: 'education', strength: 5, color: '#AA96DA' },
  { name: 'Roommate', category: 'education', strength: 6, color: '#AA96DA' },
];

async function main() {
  console.log('Starting seed...');

  // Clear existing relationship types
  await prisma.relationshipType.deleteMany({});
  console.log('Cleared existing relationship types');

  // Create relationship types
  for (const type of relationshipTypes) {
    await prisma.relationshipType.create({
      data: type,
    });
  }

  console.log(`Created ${relationshipTypes.length} relationship types`);
  console.log('Seed completed!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
