import { SeedService } from './seed.service';

async function runSeed() {
  const seedService = new SeedService();
  await seedService.seedAll();
}

runSeed()
  .then(() => {
    console.log('✅ Seeding finished.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  });
