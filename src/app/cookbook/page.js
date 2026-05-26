import { getCookbook } from '@/actions/recipe'
import CookbookClient from './CookbookClient'

export const dynamic = 'force-dynamic'

export default async function CookbookPage() {
  const entries = await getCookbook()

  return (
    <main style={{ maxWidth: 'var(--maxw)', margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>
      <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '0.4rem' }}>
        Mein Kochbuch
      </h1>
      <p style={{ color: 'var(--ink-soft)', marginBottom: '2.5rem' }}>
        {entries.length === 0
          ? 'Noch keine Rezepte gespeichert.'
          : `${entries.length} gespeicherte Rezepte`}
      </p>

      {entries.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--ink-soft)' }}>
          <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>📖</p>
          <p style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>
            Dein Kochbuch ist noch leer.
          </p>
          <a href="/recipes" className="btn">Rezepte entdecken</a>
        </div>
      ) : (
        <CookbookClient entries={entries} />
      )}
    </main>
  )
}