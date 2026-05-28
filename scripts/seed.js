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

async function fetchRecipeInfo(id) {
  const url = `https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}&includeNutrition=false`;
  const res = await fetch(url);
  if (!res.ok)
    throw new Error(`Spoonacular error: ${res.status} ${res.statusText}`);
  return await res.json();
}

async function fetchRecipes(type, number = 20) {
  const url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&type=${encodeURIComponent(type)}&number=${number}&fillIngredients=true`;
  const res = await fetch(url);
  if (!res.ok)
    throw new Error(`Spoonacular error: ${res.status} ${res.statusText}`);
  const data = await res.json();
  const recipes = [];
  for (const result of data.results ?? []) {
    const info = await fetchRecipeInfo(result.id);
    recipes.push(info);
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  return recipes;
}

function extractInstructions(recipe) {
  if (Array.isArray(recipe.analyzedInstructions)) {
    const steps = [];
    for (const block of recipe.analyzedInstructions) {
      if (typeof block === "string" && block.trim()) {
        steps.push(block.trim());
      }
      if (Array.isArray(block?.steps) && block.steps.length > 0) {
        steps.push(
          ...block.steps
            .map((step) =>
              typeof step === "string" ? step.trim() : step?.step?.trim(),
            )
            .filter(Boolean),
        );
      }
    }
    if (steps.length) return steps;
  }

  if (typeof recipe.instructions === "string" && recipe.instructions.trim()) {
    const lines = recipe.instructions
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
    return lines.length ? lines : [recipe.instructions.trim()];
  }

  return null;
}

function mapRecipe(r, category) {
  const ingredients = r.extendedIngredients?.length
    ? JSON.stringify(r.extendedIngredients.map((i) => i.original))
    : null;
  const instructions = extractInstructions(r);

  return {
    externalId: r.id,
    title: r.title,
    image: r.image ?? "",
    summary: r.summary ?? null,
    instructions: instructions ? JSON.stringify(instructions) : null,
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
