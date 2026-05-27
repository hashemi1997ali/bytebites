"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function RecipeSearchForm({
  mode = "client",
  filters = {},
  setFilters,
  categories = [],
  cuisines = [],
  resetHref = "/recipes",
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [formState, setFormState] = useState(filters);

  useEffect(() => {
    setFormState(filters);
  }, [filters]);

  if (mode === "server") {
    function submitSearch(event) {
      event.preventDefault();
      const params = new URLSearchParams();
      if (formState.q) params.set("q", formState.q);
      if (formState.category) params.set("category", formState.category);
      if (formState.cuisine) params.set("cuisine", formState.cuisine);
      if (formState.diet) params.set("diet", formState.diet);
      if (formState.sort) params.set("sort", formState.sort);

      const destination = params.toString()
        ? `${resetHref || pathname}?${params.toString()}`
        : resetHref || pathname;
      router.push(destination);
    }

    function resetSearch() {
      router.push(resetHref || pathname);
    }

    return (
      <form className="search-form" onSubmit={submitSearch}>
        <div className="search-form__grid">
          <input
            className="admin-input search-form__input"
            name="q"
            value={formState.q || ""}
            onChange={(event) =>
              setFormState({ ...formState, q: event.target.value })
            }
            placeholder="Search recipes…"
          />
          <select
            className="admin-input search-form__input"
            name="category"
            value={formState.category || ""}
            onChange={(event) =>
              setFormState({ ...formState, category: event.target.value })
            }
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            className="admin-input search-form__input"
            name="cuisine"
            value={formState.cuisine || ""}
            onChange={(event) =>
              setFormState({ ...formState, cuisine: event.target.value })
            }
          >
            <option value="">All Cuisines</option>
            {cuisines.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            className="admin-input search-form__input"
            name="diet"
            value={formState.diet || ""}
            onChange={(event) =>
              setFormState({ ...formState, diet: event.target.value })
            }
          >
            <option value="">All Diets</option>
            <option value="vegan">🌱 Vegan</option>
            <option value="vegetarian">🥗 Vegetarian</option>
            <option value="glutenFree">🌾 Gluten Free</option>
            <option value="dairyFree">🥛 Dairy Free</option>
          </select>
          <select
            className="admin-input search-form__input"
            name="sort"
            value={formState.sort || ""}
            onChange={(event) =>
              setFormState({ ...formState, sort: event.target.value })
            }
          >
            <option value="">Newest first</option>
            <option value="quickest">⏱ Quickest first</option>
            <option value="az">A → Z</option>
          </select>
        </div>

        <div className="search-form__actions">
          <button type="submit" className="btn search-form__button">
            Search
          </button>
          <button
            type="button"
            className="btn btn--secondary search-form__button"
            onClick={resetSearch}
          >
            Reset
          </button>
        </div>
      </form>
    );
  }

  // client mode: controlled inputs
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="admin-form admin-form--add"
      style={{ marginBottom: 24 }}
    >
      <h3>Search Recipes</h3>
      <div className="admin-form-grid">
        <input
          className="admin-input"
          placeholder="Search recipes…"
          value={filters.q || ""}
          onChange={(e) => setFilters({ ...filters, q: e.target.value })}
          style={{ flex: "1 1 220px" }}
        />
        <select
          className="admin-input"
          value={filters.category || ""}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <div className="admin-form-grid">
        <select
          className="admin-input"
          value={filters.cuisine || ""}
          onChange={(e) => setFilters({ ...filters, cuisine: e.target.value })}
        >
          <option value="">All Cuisines</option>
          {cuisines.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          className="admin-input"
          value={filters.diet || ""}
          onChange={(e) => setFilters({ ...filters, diet: e.target.value })}
        >
          <option value="">All Diets</option>
          <option value="vegan">Vegan</option>
          <option value="vegetarian">Vegetarian</option>
          <option value="glutenFree">Gluten-free</option>
          <option value="dairyFree">Dairy-free</option>
        </select>
      </div>
      <div className="admin-form-grid">
        <select
          className="admin-input"
          value={filters.sort || ""}
          onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
        >
          <option value="">Newest first</option>
          <option value="quickest">Quickest first</option>
          <option value="az">A → Z</option>
        </select>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button
            className="btn"
            type="button"
            onClick={() =>
              setFilters({
                q: "",
                category: "",
                cuisine: "",
                diet: "",
                sort: "",
              })
            }
          >
            Reset
          </button>
        </div>
      </div>
    </form>
  );
}
