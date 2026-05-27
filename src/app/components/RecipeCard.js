import Link from "next/link";

export default function RecipeCard({ recipe }) {
  return (
    <Link href={`/recipes/${recipe.id}`} className="recipe-card">
      <div className="recipe-card__img-wrap">
        <img
          src={
            recipe.image ||
            "https://placehold.co/400x300/efe5d6/6b5f56?text=No+Image"
          }
          alt={recipe.title}
        />
      </div>
      <div className="recipe-card__body">
        {recipe.category && (
          <span className="recipe-card__cat">{recipe.category}</span>
        )}
        <h3 className="recipe-card__title">{recipe.title}</h3>
        <div className="recipe-card__meta">
          {recipe.readyInMinutes && <span>⏱ {recipe.readyInMinutes} min</span>}
          {recipe.servings && <span>🍽 {recipe.servings} servings</span>}
        </div>
      </div>
    </Link>
  );
}
