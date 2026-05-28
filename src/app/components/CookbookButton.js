"use client";

import { useEffect, useState } from "react";
import {
  addCookbookEntry,
  isRecipeInCookbook,
  removeCookbookEntry,
  createCookbookEntry,
} from "@/lib/cookbookStorage";

export default function CookbookButton({ recipe }) {
  const [inCookbook, setInCookbook] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setInCookbook(isRecipeInCookbook(recipe.id));
  }, [recipe.id]);

  function handleToggle() {
    setLoading(true);
    if (inCookbook) {
      removeCookbookEntry(recipe.id);
      setInCookbook(false);
    } else {
      addCookbookEntry(createCookbookEntry(recipe));
      setInCookbook(true);
    }
    setLoading(false);
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className="btn"
      style={{
        alignSelf: "flex-start",
        background: inCookbook ? "var(--olive)" : "var(--terracotta)",
        marginTop: "0.5rem",
      }}
    >
      {loading
        ? "…"
        : inCookbook
          ? "✅ Saved to Cookbook"
          : "📖 Add to Cookbook"}
    </button>
  );
}
