const STORAGE_KEY = "bytebites_cookbook";

export function loadCookbookEntries() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCookbookEntries(entries) {
  if (typeof window === "undefined") return entries;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // ignore
  }
  return entries;
}

export function isRecipeInCookbook(recipeId) {
  return loadCookbookEntries().some((entry) => entry.recipeId === recipeId);
}

export function addCookbookEntry(entry) {
  const entries = loadCookbookEntries();
  if (entries.some((item) => item.recipeId === entry.recipeId)) return entries;
  entries.unshift(entry);
  return saveCookbookEntries(entries);
}

export function removeCookbookEntry(recipeId) {
  const entries = loadCookbookEntries().filter(
    (entry) => entry.recipeId !== recipeId,
  );
  return saveCookbookEntries(entries);
}

export function updateCookbookNote(recipeId, notes) {
  const entries = loadCookbookEntries().map((entry) =>
    entry.recipeId === recipeId ? { ...entry, notes } : entry,
  );
  return saveCookbookEntries(entries);
}

export function createCookbookEntry(recipe) {
  return {
    recipeId: recipe.id,
    notes: "",
    recipe: {
      id: recipe.id,
      title: recipe.title,
      image: recipe.image || "",
      category: recipe.category || "",
      cuisine: recipe.cuisine || null,
      readyInMinutes: recipe.readyInMinutes || null,
      servings: recipe.servings || null,
      vegan: !!recipe.vegan,
      vegetarian: !!recipe.vegetarian,
      glutenFree: !!recipe.glutenFree,
      dairyFree: !!recipe.dairyFree,
    },
  };
}

export function removeInvalidRecipes(validRecipeIds) {
  const entries = loadCookbookEntries();
  const validSet = new Set(validRecipeIds);
  const filtered = entries.filter((entry) => validSet.has(entry.recipeId));
  return saveCookbookEntries(filtered);
}
