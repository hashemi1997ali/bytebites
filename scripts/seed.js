import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import "dotenv/config";

const API_KEY = process.env.SPOONACULAR_API_KEY;
const DATABASE_URL = process.env.DATABASE_URL;

if (!API_KEY) throw new Error("SPOONACULAR_API_KEY is not set in .env");
if (!DATABASE_URL) throw new Error("DATABASE_URL is not set in .env");

const adapter = new PrismaNeon({ connectionString: DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const CATEGORIES = [
  "main course",
  "side dish",
  "dessert",
  "appetizer",
  "salad",
  "breakfast",
  "soup",
];

async function fetchRecipes(type, number = 20) {
  const url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&type=${encodeURIComponent(type)}&number=${number}&addRecipeInformation=true&fillIngredients=true`;
  const res = await fetch(url);
  if (!res.ok)
    throw new Error(`Spoonacular error: ${res.status} ${res.statusText}`);
  const data = await res.json();
  return data.results ?? [];
}

function mapRecipe(r, category) {
  const ingredients = r.extendedIngredients?.length
    ? JSON.stringify(r.extendedIngredients.map((i) => i.original))
    : null;

  return {
    externalId: r.id,
    title: r.title,
    image: r.image ?? "",
    summary: r.summary ?? null,
    instructions: r.instructions ?? null,
    ingredients,
    category: category.charAt(0).toUpperCase() + category.slice(1),
    cuisine: r.cuisines?.[0] ?? null,
    readyInMinutes: r.readyInMinutes ?? null,
    servings: r.servings ?? null,
    sourceUrl: r.sourceUrl ?? null,
    featured: false,
    vegan: r.vegan ?? false,
    vegetarian: r.vegetarian ?? false,
    glutenFree: r.glutenFree ?? false,
    dairyFree: r.dairyFree ?? false,
  };
}

async function seed() {
  console.log("Seeding database...");
  let total = 0;

  for (const category of CATEGORIES) {
    console.log(`  Fetching "${category}"...`);
    const recipes = await fetchRecipes(category, 20);

    for (const r of recipes) {
      await prisma.recipe.upsert({
        where: { externalId: r.id },
        update: mapRecipe(r, category),
        create: mapRecipe(r, category),
      });
      total++;
    }

    // avoid hitting rate limit
    await new Promise((res) => setTimeout(res, 500));
  }

  // mark first 12 as featured
  const first12 = await prisma.recipe.findMany({
    take: 12,
    orderBy: { id: "asc" },
  });
  for (const r of first12) {
    await prisma.recipe.update({
      where: { id: r.id },
      data: { featured: true },
    });
  }

  console.log(
    `Done — ${total} recipes seeded, ${first12.length} marked as featured.`,
  );
  await prisma.$disconnect();
}

seed().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
