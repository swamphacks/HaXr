const { PrismaClient } = require('@prisma/client'); // Because not inside module? idk just keep this here

const prisma = new PrismaClient();

const competition = {
  code: 'x',
  name: 'Swamphacks X',
  description: 'The 10th anniversary of Swamphacks',
  frontpage_url: 'https://swamphacks.com',
  start_date: new Date(),
  end_date: new Date(),
  location: 'Malachowsky Hall',
  location_url:
    'https://www.google.com/maps/place/Malachowsky+Hall+for+Data+Science+%26+Information+Technology/@29.6440363,-82.3503432,17z/data=!3m1!4b1!4m6!3m5!1s0x88e8a38b6146599d:0x707b02b623a23c84!8m2!3d29.6440317!4d-82.3477683!16s%2Fg%2F11rhq_1l7j?entry=ttu',
  preview: new Date(),
  apply_open: new Date(),
  apply_close: new Date(),
  decision_release: new Date(),
  confirm_by: new Date(),
};

async function seed() {
  try {
    // Create the competition
    await prisma.competition.create({
      data: competition,
    });
    console.log('Competition seeded successfully');
  } catch (error) {
    console.error('Error seeding competition:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
