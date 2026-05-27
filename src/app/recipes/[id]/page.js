import { getRecipeById, getSimilar, isInCookbook } from "@/actions/recipe";
import RecipeCard from "@/app/components/RecipeCard";
import CookbookButton from "@/app/components/CookbookButton";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function RecipePage({ params }) {
  const { id: rawId } = await params;
  const id = parseInt(rawId);
  const recipe = await getRecipeById(id);
  if (!recipe) notFound();

  const [similar, inCookbook] = await Promise.all([
    getSimilar(recipe.category, id, 4),
    isInCookbook(id),
  ]);

  let ingredients = [];
  try {
    ingredients = recipe.ingredients ? JSON.parse(recipe.ingredients) : [];
  } catch {
    ingredients = [];
  }

  return (
    <main
      style={{
        maxWidth: "var(--maxw)",
        margin: "0 auto",
        padding: "2.5rem 1.5rem 5rem",
      }}
    >
      <Link
        href="/recipes"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.4rem",
          color: "var(--ink-soft)",
          fontSize: "0.9rem",
          marginBottom: "2rem",
          transition: "color 0.18s",
        }}
      >
        ← All Recipes
      </Link>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "3rem",
          marginBottom: "3rem",
          alignItems: "start",
        }}
      >
        <div
          style={{
            borderRadius: "var(--radius)",
            overflow: "hidden",
            boxShadow: "var(--shadow-h)",
          }}
        >
          <img
            src={
              recipe.image ||
              "https://placehold.co/600x450/efe5d6/6b5f56?text=No+Image"
            }
            alt={recipe.title}
            style={{
              width: "100%",
              height: "100%",
              minHeight: "320px",
              maxHeight: "520px",
              objectFit: "cover",
            }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {recipe.category && (
            <span className="recipe-card__cat">{recipe.category}</span>
          )}
          <h1
            style={{
              fontSize: "clamp(1.8rem, 3vw, 2.8rem)",
              color: "var(--ink)",
            }}
          >
            {recipe.title}
          </h1>

          <div
            style={{
              display: "flex",
              gap: "1rem",
              flexWrap: "wrap",
              marginTop: "0.5rem",
            }}
          >
            {recipe.readyInMinutes && (
              <span
                style={{
                  background: "var(--cream-deep)",
                  borderRadius: "var(--radius-s)",
                  padding: "0.5rem 1rem",
                  fontSize: "0.9rem",
                  color: "var(--ink-soft)",
                }}
              >
                ⏱ {recipe.readyInMinutes} min
              </span>
            )}
            {recipe.servings && (
              <span
                style={{
                  background: "var(--cream-deep)",
                  borderRadius: "var(--radius-s)",
                  padding: "0.5rem 1rem",
                  fontSize: "0.9rem",
                  color: "var(--ink-soft)",
                }}
              >
                🍽 {recipe.servings} servings
              </span>
            )}
            {recipe.cuisine && (
              <span
                style={{
                  background: "var(--cream-deep)",
                  borderRadius: "var(--radius-s)",
                  padding: "0.5rem 1rem",
                  fontSize: "0.9rem",
                  color: "var(--ink-soft)",
                }}
              >
                🌍 {recipe.cuisine}
              </span>
            )}
          </div>

          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {recipe.vegan && <span className="diet-tag">🌱 Vegan</span>}
            {recipe.vegetarian && (
              <span className="diet-tag">🥗 Vegetarian</span>
            )}
            {recipe.glutenFree && (
              <span className="diet-tag">🌾 Gluten Free</span>
            )}
            {recipe.dairyFree && (
              <span className="diet-tag">🥛 Dairy Free</span>
            )}
          </div>

          <CookbookButton recipeId={id} initialInCookbook={inCookbook} />
        </div>
      </div>

      {recipe.summary && (
        <div
          style={{
            marginBottom: "3rem",
          }}
        >
          <h2 style={{ fontSize: "1.5rem", marginBottom: "1.2rem" }}>
            Summary
          </h2>
          <div
            style={{
              color: "var(--ink-soft)",
              lineHeight: 1.75,
              overflowWrap: "break-word",
              fontSize: "0.97rem",
            }}
            dangerouslySetInnerHTML={{
              __html: recipe.summary.replace(/<[^>]*>/g, ""),
            }}
          />
        </div>
      )}

      {ingredients.length > 0 && (
        <div
          style={{
            marginBottom: "3rem",
          }}
        >
          <h2 style={{ fontSize: "1.5rem", marginBottom: "1.2rem" }}>
            Ingredients
          </h2>
          <ul
            style={{
              listStyle: "none",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "0.8rem 1.2rem",
              padding: 0,
            }}
          >
            {ingredients.map((ing, i) => (
              <li
                key={i}
                style={{
                  padding: "0.6rem 0",
                  borderBottom: "1px solid var(--line)",
                  fontSize: "0.95rem",
                  color: "var(--ink-soft)",
                }}
              >
                {ing}
              </li>
            ))}
          </ul>
        </div>
      )}

      {similar.length > 0 && (
        <section>
          <h2 style={{ fontSize: "1.8rem", marginBottom: "0.4rem" }}>
            You might also like
          </h2>
          <p style={{ color: "var(--ink-soft)", marginBottom: "1.8rem" }}>
            More recipes from the same category.
          </p>
          <div className="card-grid">
            {similar.map((r) => (
              <RecipeCard key={r.id} recipe={r} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
