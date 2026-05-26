import { getRecipeById, getSimilar } from '@/actions/recipe'
import RecipeCard from '@/app/components/RecipeCard'
import { notFound } from 'next/navigation'

export default async function RecipePage({ params }) {
  const { id: rawId } = await params
  const id = parseInt(rawId)
  const recipe = await getRecipeById(id)
  if (!recipe) notFound()

  const similar = await getSimilar(recipe.category, id, 4)

  // Zutaten aus JSON parsen
  let ingredients = []
  try {
    ingredients = recipe.ingredients ? JSON.parse(recipe.ingredients) : []
  } catch {
    ingredients = []
  }

  return (
    <main style={{ maxWidth: 'var(--maxw)', margin: '0 auto', padding: '2.5rem 1.5rem 5rem' }}>

      {/* Zurück-Link */}
      <a href="/" style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
        color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '2rem',
        transition: 'color 0.18s',
      }}>
        ← Zurück
      </a>

      {/* Hero-Bereich */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '3rem',
        marginBottom: '3rem',
        alignItems: 'start',
      }}>
        {/* Bild */}
        <div style={{ borderRadius: 'var(--radius)', overflow: 'hidden', boxShadow: 'var(--shadow-h)' }}>
          <img
            src={recipe.image || 'https://placehold.co/600x450/efe5d6/6b5f56?text=No+Image'}
            alt={recipe.title}
            style={{ width: '100%', height: '420px', objectFit: 'cover' }}
          />
        </div>

        {/* Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {recipe.category && (
            <span className="recipe-card__cat">{recipe.category}</span>
          )}
          <h1 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', color: 'var(--ink)' }}>
            {recipe.title}
          </h1>

          {/* Meta-Badges */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
            {recipe.readyInMinutes && (
              <span style={{
                background: 'var(--cream-deep)', borderRadius: 'var(--radius-s)',
                padding: '0.5rem 1rem', fontSize: '0.9rem', color: 'var(--ink-soft)',
              }}>
                ⏱ {recipe.readyInMinutes} Minuten
              </span>
            )}
            {recipe.servings && (
              <span style={{
                background: 'var(--cream-deep)', borderRadius: 'var(--radius-s)',
                padding: '0.5rem 1rem', fontSize: '0.9rem', color: 'var(--ink-soft)',
              }}>
                🍽 {recipe.servings} Portionen
              </span>
            )}
            {recipe.cuisine && (
              <span style={{
                background: 'var(--cream-deep)', borderRadius: 'var(--radius-s)',
                padding: '0.5rem 1rem', fontSize: '0.9rem', color: 'var(--ink-soft)',
              }}>
                🌍 {recipe.cuisine}
              </span>
            )}
          </div>

          {/* Diät-Tags */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {recipe.vegan      && <span className="diet-tag">🌱 Vegan</span>}
            {recipe.vegetarian && <span className="diet-tag">🥗 Vegetarisch</span>}
            {recipe.glutenFree && <span className="diet-tag">🌾 Glutenfrei</span>}
            {recipe.dairyFree  && <span className="diet-tag">🥛 Laktosefrei</span>}
          </div>

          {/* Zusammenfassung */}
          {recipe.summary && (
            <div
              style={{ color: 'var(--ink-soft)', lineHeight: 1.75, fontSize: '0.97rem' }}
              dangerouslySetInnerHTML={{
                __html: recipe.summary.replace(/<[^>]*>/g, '').slice(0, 300) + '…'
              }}
            />
          )}

          <a href="/recipes" className="btn" style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }}>
            Alle Rezepte →
          </a>
        </div>
      </div>

      {/* Zutaten + Anleitung */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 2fr',
        gap: '3rem',
        marginBottom: '4rem',
      }}>
        {/* Zutaten */}
        {ingredients.length > 0 && (
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.2rem' }}>Zutaten</h2>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {ingredients.map((ing, i) => (
                <li key={i} style={{
                  padding: '0.6rem 0',
                  borderBottom: '1px solid var(--line)',
                  fontSize: '0.95rem',
                  color: 'var(--ink-soft)',
                }}>
                  {ing}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Anleitung */}
        {recipe.instructions && (
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.2rem' }}>Zubereitung</h2>
            <div
              style={{ color: 'var(--ink-soft)', lineHeight: 1.85, fontSize: '0.97rem' }}
              dangerouslySetInnerHTML={{ __html: recipe.instructions }}
            />
          </div>
        )}
      </div>

      {/* Ähnliche Rezepte */}
      {similar.length > 0 && (
        <section>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '0.4rem' }}>Das könnte dir auch schmecken</h2>
          <p style={{ color: 'var(--ink-soft)', marginBottom: '1.8rem' }}>Weitere Rezepte aus der gleichen Kategorie.</p>
          <div className="card-grid">
            {similar.map(r => <RecipeCard key={r.id} recipe={r} />)}
          </div>
        </section>
      )}

    </main>
  )
}