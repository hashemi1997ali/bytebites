"use client";

import React, { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import RecipeSearchForm from "@/app/components/RecipeSearchForm";
import AdminRecipeCard from "@/app/components/AdminRecipeCard";

export default function AdminClient() {
  const [token, setToken] = useState(null);
  const [hydrated, setHydrated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState(null);
  const blankForm = {
    title: "",
    image: "",
    summary: "",
    instructions: "",
    ingredients: "",
    category: "",
    cuisine: "",
    readyInMinutes: "",
    servings: "",
    sourceUrl: "",
    featured: false,
    vegan: false,
    vegetarian: false,
    glutenFree: false,
    dairyFree: false,
    isPersonal: false,
  };
  const [modalForm, setModalForm] = useState(blankForm);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const filters = useMemo(
    () => ({
      q: searchParams.get("q") || "",
      category: searchParams.get("category") || "",
      cuisine: searchParams.get("cuisine") || "",
      diet: searchParams.get("diet") || "",
      sort: searchParams.get("sort") || "",
    }),
    [searchParams],
  );
  const currentPage = Number(searchParams.get("page") || "1");
  const PAGE_SIZE = 24;
  const [total, setTotal] = useState(null);
  const [categories, setCategories] = useState([]);
  const [cuisines, setCuisines] = useState([]);
  const [login, setLogin] = useState({ username: "", password: "" });

  function formatJsonListInput(value) {
    if (!value) return "";
    if (typeof value !== "string") return String(value);
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.join("\n");
    } catch {
      // ignore
    }
    return value;
  }

  function normalizeJsonList(input) {
    if (input == null || input === "") return null;
    if (Array.isArray(input)) return JSON.stringify(input.filter(Boolean));
    if (typeof input === "string") {
      try {
        const parsed = JSON.parse(input);
        if (Array.isArray(parsed))
          return JSON.stringify(parsed.filter(Boolean));
      } catch {
        const lines = input
          .split(/\r?\n|,/)
          .map((line) => line.trim())
          .filter(Boolean);
        return JSON.stringify(lines);
      }
    }
    return String(input);
  }

  useEffect(() => {
    if (token) fetchRecipes();
  }, [token, filters, currentPage]);

  useEffect(() => {
    const t =
      typeof window !== "undefined"
        ? localStorage.getItem("admin_token")
        : null;
    if (t) setToken(t);
    setHydrated(true);
  }, []);

  async function fetchRecipes() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.q) params.set("q", filters.q);
      if (filters.category) params.set("category", filters.category);
      if (filters.cuisine) params.set("cuisine", filters.cuisine);
      if (filters.diet) params.set("diet", filters.diet);
      if (filters.sort) params.set("sort", filters.sort);
      params.set("page", String(currentPage));
      params.set("limit", String(PAGE_SIZE));

      const res = await fetch(`/api/admin/recipes?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setRecipes(data.recipes || []);
        setTotal(data.total ?? (data.recipes || []).length);
        setCategories(data.categories || []);
        setCuisines(data.cuisines || []);
      } else {
        setRecipes([]);
        setTotal(0);
        setCategories([]);
        setCuisines([]);
      }
    } catch (err) {
      setRecipes([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }

  function navigateToPage(page) {
    const params = new URLSearchParams();
    if (filters.q) params.set("q", filters.q);
    if (filters.category) params.set("category", filters.category);
    if (filters.cuisine) params.set("cuisine", filters.cuisine);
    if (filters.diet) params.set("diet", filters.diet);
    if (filters.sort) params.set("sort", filters.sort);
    params.set("page", String(page));
    router.push(`${pathname}?${params.toString()}`);
  }

  async function handleLogin(e) {
    e.preventDefault();
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(login),
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem("admin_token", data.token);
      setToken(data.token);
    } else {
      alert("Login failed");
    }
  }

  // server-side filtered/paginated results are stored in `recipes` and `total`

  async function handleAdd(payload) {
    const res = await fetch("/api/admin/recipes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (data.recipe) {
      setIsModalOpen(false);
      setModalForm(blankForm);
      await fetchRecipes();
    } else {
      alert(`Create failed: ${data.error || "Failed to create recipe"}`);
    }
  }

  function openAddModal() {
    setEditingId(null);
    setModalForm(blankForm);
    setIsModalOpen(true);
  }

  function openEditModal(recipe) {
    setEditingId(recipe.id);
    setModalForm({
      ...recipe,
      ingredients: formatJsonListInput(recipe.ingredients),
      instructions: formatJsonListInput(recipe.instructions),
    });
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingId(null);
    setModalForm(blankForm);
  }

  async function handleModalSubmit(e) {
    e.preventDefault();
    const payload = {
      ...modalForm,
      ingredients: normalizeJsonList(modalForm.ingredients),
      instructions: normalizeJsonList(modalForm.instructions),
    };

    if (editingId) {
      await handleUpdate(editingId, payload);
    } else {
      await handleAdd(payload);
    }
  }

  async function handleUpdate(id, update) {
    const res = await fetch(`/api/admin/recipes?id=${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(update),
    });
    const data = await res.json();
    if (data.recipe) {
      closeModal();
      await fetchRecipes();
    } else {
      alert(`Update failed: ${data.error || "Failed to update recipe"}`);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete recipe?")) return;
    const res = await fetch(`/api/admin/recipes?id=${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data.ok) {
      await fetchRecipes();
    } else {
      alert("Delete failed");
    }
  }

  function logout() {
    localStorage.removeItem("admin_token");
    setToken(null);
    setRecipes([]);
  }

  if (!hydrated) {
    return (
      <div
        className="container admin-page"
        style={{
          maxWidth: "var(--maxw)",
          margin: "0 auto",
          padding: "3rem 1.5rem 5rem",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <div
      className="container admin-page"
      style={{
        maxWidth: "var(--maxw)",
        margin: "0 auto",
        padding: "3rem 1.5rem 5rem",
      }}
    >
      {!token ? (
        <form onSubmit={handleLogin} className="admin-login-form">
          <h2>Admin Login</h2>
          <div className="admin-form-group">
            <label className="admin-label">Username</label>
            <input
              className="admin-input"
              placeholder="Enter username"
              value={login.username}
              onChange={(e) => setLogin({ ...login, username: e.target.value })}
            />
          </div>
          <div className="admin-form-group">
            <label className="admin-label">Password</label>
            <input
              className="admin-input"
              placeholder="Enter password"
              type="password"
              value={login.password}
              onChange={(e) => setLogin({ ...login, password: e.target.value })}
            />
          </div>
          <button className="btn" type="submit">
            Login
          </button>
        </form>
      ) : (
        <div>
          <div className="admin-panel__header">
            <div>
              <h1
                style={{
                  fontSize: "clamp(2rem, 4vw, 3rem)",
                  marginBottom: "0.4rem",
                }}
              >
                Admin Recipes
              </h1>
              <p
                style={{
                  color: "var(--ink-soft)",
                }}
              >
                {total ?? 0} recipes found
              </p>
            </div>
            <button className="btn" onClick={logout}>
              Logout
            </button>
          </div>

          <RecipeSearchForm
            mode="server"
            filters={filters}
            categories={categories}
            cuisines={cuisines}
            resetHref="/admin"
          />

          {(filters.q ||
            filters.category ||
            filters.cuisine ||
            filters.diet) && (
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
              {filters.diet && (
                <span className="diet-tag">✅ {filters.diet}</span>
              )}
            </div>
          )}

          {loading || recipes === null ? (
            <div>Loading...</div>
          ) : (
            <>
              <div className="card-grid">
                {(recipes || []).map((r) => (
                  <AdminRecipeCard
                    key={r.id}
                    recipe={r}
                    onEdit={openEditModal}
                    onDelete={(id) => handleDelete(id)}
                  />
                ))}
              </div>

              {total !== null && total > PAGE_SIZE && (
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    justifyContent: "center",
                    marginTop: 20,
                  }}
                >
                  <button
                    className="btn pagination-btn"
                    type="button"
                    disabled={currentPage <= 1}
                    onClick={() => navigateToPage(currentPage - 1)}
                  >
                    ❮
                  </button>

                  <span style={{ alignSelf: "center" }}>
                    {currentPage} / {Math.ceil(total / PAGE_SIZE)}
                  </span>

                  <button
                    className="btn pagination-btn"
                    type="button"
                    disabled={currentPage >= Math.ceil(total / PAGE_SIZE)}
                    onClick={() => navigateToPage(currentPage + 1)}
                  >
                    ❯
                  </button>
                </div>
              )}
            </>
          )}
          <button
            className="btn"
            type="button"
            onClick={openAddModal}
            style={{
              position: "fixed",
              right: 24,
              bottom: 24,
              zIndex: 1000,
              padding: "0.9rem 1.2rem",
            }}
          >
            Add Recipe
          </button>
        </div>
      )}
      {isModalOpen && (
        <div className="admin-modal-overlay" onClick={closeModal}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal__header">
              <div>
                <h3>{editingId ? "Edit Recipe" : "Add Recipe"}</h3>
                <p className="admin-panel__subtitle">
                  {editingId
                    ? "Update any recipe field and save your changes."
                    : "Enter recipe details and create a new recipe."}
                </p>
              </div>
              <button
                className="admin-modal__close"
                type="button"
                onClick={closeModal}
              >
                ×
              </button>
            </div>

            <form className="admin-form" onSubmit={handleModalSubmit}>
              <div className="admin-form-grid">
                <div className="admin-form-group">
                  <label className="admin-label">Title</label>
                  <input
                    className="admin-input"
                    placeholder="Recipe title"
                    value={modalForm.title ?? ""}
                    onChange={(e) =>
                      setModalForm({ ...modalForm, title: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Image URL</label>
                  <input
                    className="admin-input"
                    placeholder="https://example.com/image.jpg"
                    value={modalForm.image ?? ""}
                    onChange={(e) =>
                      setModalForm({ ...modalForm, image: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="admin-form-grid">
                <div className="admin-form-group">
                  <label className="admin-label">Category</label>
                  <input
                    className="admin-input"
                    placeholder="e.g., Dessert, Main Course"
                    list="admin-category-options"
                    value={modalForm.category ?? ""}
                    onChange={(e) =>
                      setModalForm({ ...modalForm, category: e.target.value })
                    }
                  />
                  <datalist id="admin-category-options">
                    {categories.map((category) => (
                      <option key={category} value={category} />
                    ))}
                  </datalist>
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Cuisine</label>
                  <input
                    className="admin-input"
                    placeholder="e.g., Italian, Thai"
                    list="admin-cuisine-options"
                    value={modalForm.cuisine ?? ""}
                    onChange={(e) =>
                      setModalForm({ ...modalForm, cuisine: e.target.value })
                    }
                  />
                  <datalist id="admin-cuisine-options">
                    {cuisines.map((cuisine) => (
                      <option key={cuisine} value={cuisine} />
                    ))}
                  </datalist>
                </div>
              </div>

              <div className="admin-form-grid">
                <div className="admin-form-group">
                  <label className="admin-label">Ready in Minutes</label>
                  <input
                    className="admin-input"
                    type="number"
                    placeholder="e.g., 30"
                    value={modalForm.readyInMinutes ?? ""}
                    onChange={(e) =>
                      setModalForm({
                        ...modalForm,
                        readyInMinutes: e.target.value,
                      })
                    }
                    min="0"
                    required
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Servings</label>
                  <input
                    className="admin-input"
                    type="number"
                    placeholder="e.g., 4"
                    value={modalForm.servings ?? ""}
                    onChange={(e) =>
                      setModalForm({ ...modalForm, servings: e.target.value })
                    }
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Source URL</label>
                <input
                  className="admin-input"
                  placeholder="https://example.com/recipe"
                  value={modalForm.sourceUrl ?? ""}
                  onChange={(e) =>
                    setModalForm({ ...modalForm, sourceUrl: e.target.value })
                  }
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Summary</label>
                <textarea
                  className="admin-textarea"
                  placeholder="Brief description of the recipe"
                  rows={2}
                  value={modalForm.summary ?? ""}
                  onChange={(e) =>
                    setModalForm({ ...modalForm, summary: e.target.value })
                  }
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Ingredients</label>
                <textarea
                  className="admin-textarea"
                  placeholder="One per line or comma-separated"
                  rows={3}
                  value={modalForm.ingredients ?? ""}
                  onChange={(e) =>
                    setModalForm({ ...modalForm, ingredients: e.target.value })
                  }
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Instructions</label>
                <textarea
                  className="admin-textarea"
                  placeholder="One per line or comma-separated"
                  rows={4}
                  value={modalForm.instructions ?? ""}
                  onChange={(e) =>
                    setModalForm({ ...modalForm, instructions: e.target.value })
                  }
                />
              </div>

              <div className="admin-form-group">
                <p className="admin-label">Featured</p>
                <div className="admin-form-checkboxes">
                  <label>
                    <input
                      type="checkbox"
                      checked={modalForm.featured ?? false}
                      onChange={(e) =>
                        setModalForm({
                          ...modalForm,
                          featured: e.target.checked,
                        })
                      }
                    />
                    Featured
                  </label>
                </div>
              </div>

              <div className="admin-form-group">
                <p className="admin-label">Diets</p>
                <div className="admin-form-checkboxes">
                  <label>
                    <input
                      type="checkbox"
                      checked={modalForm.vegan}
                      onChange={(e) =>
                        setModalForm({ ...modalForm, vegan: e.target.checked })
                      }
                    />
                    Vegan
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={modalForm.vegetarian}
                      onChange={(e) =>
                        setModalForm({
                          ...modalForm,
                          vegetarian: e.target.checked,
                        })
                      }
                    />
                    Vegetarian
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={modalForm.glutenFree}
                      onChange={(e) =>
                        setModalForm({
                          ...modalForm,
                          glutenFree: e.target.checked,
                        })
                      }
                    />
                    Gluten-free
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={modalForm.dairyFree}
                      onChange={(e) =>
                        setModalForm({
                          ...modalForm,
                          dairyFree: e.target.checked,
                        })
                      }
                    />
                    Dairy-free
                  </label>
                </div>
              </div>

              <div className="admin-modal-actions">
                <button className="btn" type="submit">
                  {editingId ? "Save Changes" : "Create Recipe"}
                </button>
                <button
                  className="btn btn--secondary"
                  type="button"
                  onClick={closeModal}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
