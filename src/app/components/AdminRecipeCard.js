import React from "react";
import Link from "next/link";

export default function AdminRecipeCard({ recipe, onEdit, onDelete }) {
  return (
    <Link href={`/recipes/${recipe.id}`}>
      <div className="recipe-card" style={{ cursor: "pointer" }}>
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
            {recipe.readyInMinutes && (
              <span>⏱ {recipe.readyInMinutes} min</span>
            )}
            {recipe.servings && <span>🍽 {recipe.servings} servings</span>}
          </div>
          <div style={{ marginTop: 8 }}>
            <button
              className="btn"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onEdit && onEdit(recipe);
              }}
            >
              Edit
            </button>
            <button
              className="btn btn--secondary"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete && onDelete(recipe.id);
              }}
              style={{ marginLeft: 8 }}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
