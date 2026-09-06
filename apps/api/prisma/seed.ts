import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const categories = ['Hatch', 'Sedan', 'SUV', 'Minivan', 'Picape'];

const locations = [
  {
    name: 'Aeroporto de Congonhas',
    address: 'Avenida Washington Luís, s/n',
    city: 'São Paulo',
    state: 'SP',
  },
  {
    name: 'Centro de Curitiba',
    address: 'Rua Marechal Deodoro, 630',
    city: 'Curitiba',
    state: 'PR',
  },
  {
    name: 'Orla de Salvador',
    address: 'Avenida Oceânica, 409',
    city: 'Salvador',
    state: 'BA',
  },
];

const vehicles = [
  {
    brand: 'Fiat',
    model: 'Argo',
    year: 2023,
    licensePlate: 'ABC1D23',
    dailyRate: 150,
    imageUrl: null,
    transmission: 'MANUAL',
    categoryName: 'Hatch',
  },
  {
    brand: 'Chevrolet',
    model: 'Onix',
    year: 2024,
    licensePlate: 'DEF2E34',
    dailyRate: 160,
    imageUrl: null,
    transmission: 'AUTOMATIC',
    categoryName: 'Hatch',
  },
  {
    brand: 'Jeep',
    model: 'Compass',
    year: 2024,
    licensePlate: 'GHI3F45',
    dailyRate: 320,
    imageUrl: null,
    transmission: 'AUTOMATIC',
    categoryName: 'SUV',
  },
];

async function main() {
  for (const name of categories) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  for (const location of locations) {
    const { name, ...data } = location;

    await prisma.location.upsert({
      where: { name },
      update: data,
      create: location,
    });
  }

  for (const { categoryName, ...vehicle } of vehicles) {
    const category = await prisma.category.findUniqueOrThrow({
      where: { name: categoryName },
    });

    await prisma.vehicle.upsert({
      where: { licensePlate: vehicle.licensePlate },
      update: { ...vehicle, categoryId: category.id },
      create: { ...vehicle, categoryId: category.id },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
