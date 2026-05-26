'use client'

import { useState } from 'react'
import { updateNote, removeFromCookbook } from '@/actions/recipe'
import { useRouter } from 'next/navigation'

function CookbookCard({ entry }) {
  const router = useRouter()
  const [note, setNote] = useState(entry.notes || '')
  const [saving, setSaving] = useState(false)
  const [removing, setRemoving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSaveNote() {
    setSaving(true)
    await updateNote(entry.recipeId, note)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  async function handleRemove() {
    setRemoving(true)
    await removeFromCookbook(entry.recipeId)
    router.refresh()
  }

  return (
    <div style={{
      background: 'var(--card)',
      borderRadius: 'var(--radius)',
      border: '1px solid var(--line)',
      boxShadow: 'var(--shadow)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <a href={`/recipes/${entry.recipeId}`}>
        <div style={{ aspectRatio: '4/3', overflow: 'hidden', background: 'var(--cream-deep)' }}>
          <img
            src={entry.recipe.image || 'https://placehold.co/400x300/efe5d6/6b5f56?text=No+Image'}
            alt={entry.recipe.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
            onMouseEnter={e => e.target.style.transform = 'scale(1.06)'}
            onMouseLeave={e => e.target.style.transform = 'scale(1)'}
          />
        </div>
      </a>

      <div style={{ padding: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.8rem', flex: 1 }}>
        {entry.recipe.category && (
          <span className="recipe-card__cat">{entry.recipe.category}</span>
        )}
        <a href={`/recipes/${entry.recipeId}`}>
          <h3 className="recipe-card__title">{entry.recipe.title}</h3>
        </a>

        <div className="recipe-card__meta">
          {entry.recipe.readyInMinutes && <span>⏱ {entry.recipe.readyInMinutes} min</span>}
          {entry.recipe.servings && <span>🍽 {entry.recipe.servings} servings</span>}
        </div>

        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="Your note for this recipe…"
          rows={3}
          style={{
            width: '100%',
            padding: '0.65rem 0.8rem',
            borderRadius: 'var(--radius-s)',
            border: '1px solid var(--line)',
            background: 'var(--cream)',
            fontFamily: 'var(--font-body)',
            fontSize: '0.9rem',
            color: 'var(--ink)',
            resize: 'vertical',
            outline: 'none',
            marginTop: '0.4rem',
          }}
        />

        <div style={{ display: 'flex', gap: '0.6rem', marginTop: 'auto' }}>
          <button
            onClick={handleSaveNote}
            disabled={saving}
            className="btn"
            style={{ flex: 1, fontSize: '0.85rem', padding: '0.55rem 1rem' }}
          >
            {saving ? 'Saving…' : saved ? '✅ Saved!' : '💾 Save note'}
          </button>
          <button
            onClick={handleRemove}
            disabled={removing}
            style={{
              padding: '0.55rem 1rem',
              borderRadius: '50px',
              border: '1px solid var(--line)',
              background: 'transparent',
              color: removing ? 'var(--ink-soft)' : '#c0392b',
              fontFamily: 'var(--font-body)',
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.18s',
            }}
          >
            {removing ? '…' : '🗑'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function CookbookClient({ entries }) {
  return (
    <div className="card-grid">
      {entries.map(entry => (
        <CookbookCard key={entry.id} entry={entry} />
      ))}
    </div>
  )
}