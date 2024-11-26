import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const seed = async () => {
  try {
    // Supprimer les données existantes (optionnel)
    // await prisma.asset.deleteMany();
    await prisma.categorie.deleteMany();
    await prisma.tags.deleteMany();


    const categorie3D = await prisma.categorie.create({
      data: { nom: 'Modélisation 3D' },
    });

    const categorieAnimation = await prisma.categorie.create({
      data: { nom: 'Animation 3D' },
    });

    const categorieGraphisme = await prisma.categorie.create({
      data: { nom: 'Graphisme' },
    });

    const categorieAudios = await prisma.categorie.create({
      data: { nom: 'Audios' },
    });

    const categorieDev = await prisma.categorie.create({
      data: { nom: 'Développement' },
    });

    // Créer des tags liés aux catégories
    const tag3DSkin = await prisma.tags.create({
      data: {
        nom: 'Skin',
        categorieId: categorie3D.id_categorie,
      },
    });

    const anime = await prisma.tags.create({
      data: {
        nom: 'Anime',
        categorieId: categorie3D.id_categorie,
      },
    }); 

    const vehicle = await prisma.tags.create({
      data: {
        nom: 'Vehicle',
        categorieId: categorie3D.id_categorie,
      },
    }); 


    console.log('Base de données seedée avec succès!');
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

seed();