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
