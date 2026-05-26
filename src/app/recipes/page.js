import { searchRecipes, getCategories, getCuisines } from '@/actions/recipe'
import RecipeCard from '@/app/components/RecipeCard'

export const dynamic = 'force-dynamic'

export default async function RecipesPage({ searchParams }) {
  const sp = await searchParams
  const filters = {
    q:        sp.q        || '',
    category: sp.category || '',
    cuisine:  sp.cuisine  || '',
    diet:     sp.diet     || '',
    sort:     sp.sort     || '',
  }

  const [recipes, categories, cuisines] = await Promise.all([
    searchRecipes(filters),
    getCategories(),
    getCuisines(),
  ])

  return (
    <main style={{ maxWidth: 'var(--maxw)', margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>

      <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '0.4rem' }}>
        All Recipes
      </h1>
      <p style={{ color: 'var(--ink-soft)', marginBottom: '2.5rem' }}>
        {recipes.length} recipes found
      </p>

      <form method="GET" style={{
        display: 'flex', flexWrap: 'wrap', gap: '0.75rem',
        marginBottom: '2.5rem',
        padding: '1.5rem',
        background: 'var(--card)',
        borderRadius: 'var(--radius)',
        border: '1px solid var(--line)',
        boxShadow: 'var(--shadow)',
      }}>
        <input
          type="text"
          name="q"
          defaultValue={filters.q}
          placeholder="Search recipes…"
          style={{
            flex: '1 1 220px',
            padding: '0.65rem 1rem',
            borderRadius: 'var(--radius-s)',
            border: '1px solid var(--line)',
            background: 'var(--cream)',
            fontFamily: 'var(--font-body)',
            fontSize: '0.95rem',
            color: 'var(--ink)',
            outline: 'none',
          }}
        />

        <select name="category" defaultValue={filters.category} style={{
          padding: '0.65rem 1rem',
          borderRadius: 'var(--radius-s)',
          border: '1px solid var(--line)',
          background: 'var(--cream)',
          fontFamily: 'var(--font-body)',
          fontSize: '0.95rem',
          color: 'var(--ink)',
          cursor: 'pointer',
        }}>
          <option value="">All Categories</option>
          {categories.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select name="cuisine" defaultValue={filters.cuisine} style={{
          padding: '0.65rem 1rem',
          borderRadius: 'var(--radius-s)',
          border: '1px solid var(--line)',
          background: 'var(--cream)',
          fontFamily: 'var(--font-body)',
          fontSize: '0.95rem',
          color: 'var(--ink)',
          cursor: 'pointer',
        }}>
          <option value="">All Cuisines</option>
          {cuisines.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select name="diet" defaultValue={filters.diet} style={{
          padding: '0.65rem 1rem',
          borderRadius: 'var(--radius-s)',
          border: '1px solid var(--line)',
          background: 'var(--cream)',
          fontFamily: 'var(--font-body)',
          fontSize: '0.95rem',
          color: 'var(--ink)',
          cursor: 'pointer',
        }}>
          <option value="">All Diets</option>
          <option value="vegan">🌱 Vegan</option>
          <option value="vegetarian">🥗 Vegetarian</option>
          <option value="glutenFree">🌾 Gluten Free</option>
          <option value="dairyFree">🥛 Dairy Free</option>
        </select>

        <select name="sort" defaultValue={filters.sort} style={{
          padding: '0.65rem 1rem',
          borderRadius: 'var(--radius-s)',
          border: '1px solid var(--line)',
          background: 'var(--cream)',
          fontFamily: 'var(--font-body)',
          fontSize: '0.95rem',
          color: 'var(--ink)',
          cursor: 'pointer',
        }}>
          <option value="">Newest first</option>
          <option value="quickest">⏱ Quickest first</option>
          <option value="az">A → Z</option>
        </select>

        <button type="submit" className="btn">Search</button>
        <a href="/recipes" className="btn" style={{
          background: 'transparent',
          color: 'var(--ink-soft)',
          border: '1px solid var(--line)',
        }}>
          Reset
        </a>
      </form>

      {(filters.q || filters.category || filters.cuisine || filters.diet) && (
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          {filters.q        && <span className="diet-tag">🔍 "{filters.q}"</span>}
          {filters.category && <span className="diet-tag">📂 {filters.category}</span>}
          {filters.cuisine  && <span className="diet-tag">🌍 {filters.cuisine}</span>}
          {filters.diet     && <span className="diet-tag">✅ {filters.diet}</span>}
        </div>
      )}

      {recipes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--ink-soft)' }}>
          <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>No recipes found.</p>
          <a href="/recipes" className="btn">Reset filters</a>
        </div>
      ) : (
        <div className="card-grid">
          {recipes.map(r => <RecipeCard key={r.id} recipe={r} />)}
        </div>
      )}

    </main>
  )
}