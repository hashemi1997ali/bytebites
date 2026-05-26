'use client'

import { useState } from 'react'
import { addToCookbook, removeFromCookbook } from '@/actions/recipe'

export default function CookbookButton({ recipeId, initialInCookbook }) {
  const [inCookbook, setInCookbook] = useState(initialInCookbook)
  const [loading, setLoading] = useState(false)

  async function handleToggle() {
    setLoading(true)
    if (inCookbook) {
      await removeFromCookbook(recipeId)
      setInCookbook(false)
    } else {
      await addToCookbook(recipeId)
      setInCookbook(true)
    }
    setLoading(false)
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className="btn"
      style={{
        alignSelf: 'flex-start',
        background: inCookbook ? 'var(--olive)' : 'var(--terracotta)',
        marginTop: '0.5rem',
      }}
    >
      {loading
        ? '…'
        : inCookbook
        ? '✅ Saved to Cookbook'
        : '📖 Add to Cookbook'}
    </button>
  )
}