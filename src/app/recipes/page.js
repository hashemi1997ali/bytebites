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

      {/* Header */}
      <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '0.4rem' }}>
        Alle Rezepte
      </h1>
      <p style={{ color: 'var(--ink-soft)', marginBottom: '2.5rem' }}>
        {recipes.length} Rezepte gefunden
      </p>

      {/* Filter-Form */}
      <form method="GET" style={{
        display: 'flex', flexWrap: 'wrap', gap: '0.75rem',
        marginBottom: '2.5rem',
        padding: '1.5rem',
        background: 'var(--card)',
        borderRadius: 'var(--radius)',
        border: '1px solid var(--line)',
        boxShadow: 'var(--shadow)',
      }}>
        {/* Suche */}
        <input
          type="text"
          name="q"
          defaultValue={filters.q}
          placeholder="Rezept suchen…"
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

        {/* Kategorie */}
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
          <option value="">Alle Kategorien</option>
          {categories.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* Küche */}
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
          <option value="">Alle Küchen</option>
          {cuisines.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* Diät */}
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
          <option value="">Alle Diäten</option>
          <option value="vegan">🌱 Vegan</option>
          <option value="vegetarian">🥗 Vegetarisch</option>
          <option value="glutenFree">🌾 Glutenfrei</option>
          <option value="dairyFree">🥛 Laktosefrei</option>
        </select>

        {/* Sortierung */}
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
          <option value="">Neueste zuerst</option>
          <option value="quickest">⏱ Schnellste zuerst</option>
          <option value="az">A → Z</option>
        </select>

        {/* Buttons */}
        <button type="submit" className="btn">Suchen</button>
        <a href="/recipes" className="btn" style={{
          background: 'transparent',
          color: 'var(--ink-soft)',
          border: '1px solid var(--line)',
        }}>
          Zurücksetzen
        </a>
      </form>

      {/* Aktive Filter anzeigen */}
      {(filters.q || filters.category || filters.cuisine || filters.diet) && (
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          {filters.q        && <span className="diet-tag">🔍 „{filters.q}"</span>}
          {filters.category && <span className="diet-tag">📂 {filters.category}</span>}
          {filters.cuisine  && <span className="diet-tag">🌍 {filters.cuisine}</span>}
          {filters.diet     && <span className="diet-tag">✅ {filters.diet}</span>}
        </div>
      )}

      {/* Ergebnis-Grid */}
      {recipes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--ink-soft)' }}>
          <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Keine Rezepte gefunden.</p>
          <a href="/recipes" className="btn">Filter zurücksetzen</a>
        </div>
      ) : (
        <div className="card-grid">
          {recipes.map(r => <RecipeCard key={r.id} recipe={r} />)}
        </div>
      )}

    </main>
  )
}