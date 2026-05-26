import { getFeatured } from '@/actions/recipe'
import RecipeCard from './components/RecipeCard'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const recipes = await getFeatured(12)

  return (
    <main>
      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, var(--cream-deep) 0%, var(--cream) 100%)',
        padding: '5rem 1.5rem 4rem',
        textAlign: 'center',
        borderBottom: '1px solid var(--line)',
      }}>
        <p style={{
          fontSize: '0.8rem',
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          fontWeight: 600,
          color: 'var(--terracotta)',
          marginBottom: '1rem',
        }}>
          Dein digitales Kochbuch
        </p>
        <h1 style={{ fontSize: 'clamp(2.8rem, 6vw, 5rem)', color: 'var(--ink)', marginBottom: '1.2rem' }}>
          Entdecke Rezepte,<br />
          <em style={{ fontStyle: 'italic', color: 'var(--terracotta)' }}>die begeistern.</em>
        </h1>
        <p style={{
          fontSize: '1.15rem',
          color: 'var(--ink-soft)',
          maxWidth: '520px',
          margin: '0 auto 2rem',
          lineHeight: 1.7,
        }}>
          Von schnellen Wochentags-Gerichten bis zu besonderen Momenten —
          finde, koche und speichere deine Favoriten.
        </p>
        <a href="/recipes" className="btn">Alle Rezepte entdecken</a>
      </section>

      {/* Featured Grid */}
      <section style={{ padding: '3.5rem 1.5rem 5rem', maxWidth: 'var(--maxw)', margin: '0 auto' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>Featured Rezepte</h2>
        <p style={{ color: 'var(--ink-soft)', marginBottom: '2rem' }}>
          Handverlesen — perfekt um loszulegen.
        </p>
        {recipes.length === 0 ? (
          <p style={{ color: 'var(--ink-soft)' }}>Keine Rezepte gefunden.</p>
        ) : (
          <div className="card-grid">
            {recipes.map(r => (
              <RecipeCard key={r.id} recipe={r} />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}