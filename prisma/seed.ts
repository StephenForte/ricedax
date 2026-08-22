import { prisma } from "../lib/db";
import { seedDemo } from "../lib/bootstrap";

seedDemo()
  .then(async (result) => {
    console.log("Seeded", result.recommendation.action, result.recommendation.origin, result.recommendation.tonnes);
    await prisma.$disconnect();
  })
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
