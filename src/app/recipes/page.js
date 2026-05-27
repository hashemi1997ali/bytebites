import { searchRecipes, getCategories, getCuisines } from "@/actions/recipe";
import RecipeCard from "@/app/components/RecipeCard";
import RecipeSearchForm from "@/app/components/RecipeSearchForm";

export const dynamic = "force-dynamic";

export default async function RecipesPage({ searchParams }) {
  const sp = await searchParams;
  const filters = {
    q: sp.q || "",
    category: sp.category || "",
    cuisine: sp.cuisine || "",
    diet: sp.diet || "",
    sort: sp.sort || "",
  };

  const pageNum = Number(sp.page) || 1;
  const limit = 24;
  const [searchResult, categories, cuisines] = await Promise.all([
    searchRecipes({ ...filters, page: pageNum, limit }),
    getCategories(),
    getCuisines(),
  ]);
  const recipes = searchResult.recipes;
  const total = searchResult.total;
  const currentPage = searchResult.page;
  const totalPages = Math.ceil(total / searchResult.limit);

  return (
    <main
      style={{
        maxWidth: "var(--maxw)",
        margin: "0 auto",
        padding: "3rem 1.5rem 5rem",
      }}
    >
      <h1
        style={{ fontSize: "clamp(2rem, 4vw, 3rem)", marginBottom: "0.4rem" }}
      >
        All Recipes
      </h1>
      <p style={{ color: "var(--ink-soft)", marginBottom: "2.5rem" }}>
        {total} recipes found
      </p>

      <RecipeSearchForm
        mode="server"
        filters={filters}
        categories={categories}
        cuisines={cuisines}
      />

      {(filters.q || filters.category || filters.cuisine || filters.diet) && (
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            flexWrap: "wrap",
            marginBottom: "1.5rem",
          }}
        >
          {filters.q && <span className="diet-tag">🔍 "{filters.q}"</span>}
          {filters.category && (
            <span className="diet-tag">📂 {filters.category}</span>
          )}
          {filters.cuisine && (
            <span className="diet-tag">🌍 {filters.cuisine}</span>
          )}
          {filters.diet && <span className="diet-tag">✅ {filters.diet}</span>}
        </div>
      )}

      {recipes.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "4rem 0",
            color: "var(--ink-soft)",
          }}
        >
          <p style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>
            No recipes found.
          </p>
          <a href="/recipes" className="btn">
            Reset filters
          </a>
        </div>
      ) : (
        <>
          <div className="card-grid">
            {recipes.map((r) => (
              <RecipeCard key={r.id} recipe={r} />
            ))}
          </div>
          <div
            style={{
              display: "flex",
              gap: 8,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 20,
            }}
          >
            {currentPage > 1 ? (
              <a
                href={`?${new URLSearchParams({ ...filters, page: String(currentPage - 1) }).toString()}`}
                className="btn pagination-btn"
              >
                ❮
              </a>
            ) : (
              <button className="btn pagination-btn" type="button" disabled>
                ❮
              </button>
            )}
            <span style={{ alignSelf: "center" }}>
              {currentPage} / {totalPages}
            </span>
            {currentPage < totalPages ? (
              <a
                href={`?${new URLSearchParams({ ...filters, page: String(currentPage + 1) }).toString()}`}
                className="btn pagination-btn"
              >
                ❯
              </a>
            ) : (
              <button className="btn pagination-btn" type="button" disabled>
                ❯
              </button>
            )}
          </div>
        </>
      )}
    </main>
  );
}
