import { getFeatured } from '@/actions/recipe'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const recipes = await getFeatured(12)

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>ByteBites — Foundation</h1>
      <p style={{ color: '#666' }}>
        DB connected. {recipes.length} featured recipes ready.
      </p>
      <ul style={{ marginTop: '1rem' }}>
        {recipes.map(r => (
          <li key={r.id}>{r.title}</li>
        ))}
      </ul>
    </main>
  )
}
