'use server'

import { prisma } from '@/lib/prisma'

export async function getFeatured(limit = 12) {
  return prisma.recipe.findMany({
    where: { featured: true, isPersonal: false },
    take: limit,
    orderBy: { createdAt: 'desc' },
  })
}

export async function searchRecipes(filters = {}) {
  const { q, category, cuisine, sort, diet } = filters
  return prisma.recipe.findMany({
    where: {
      isPersonal: false,
      ...(q        ? { title:    { contains: q,        mode: 'insensitive' } } : {}),
      ...(category ? { category: { equals:   category, mode: 'insensitive' } } : {}),
      ...(cuisine  ? { cuisine:  { equals:   cuisine,  mode: 'insensitive' } } : {}),
      ...(diet === 'vegan'      ? { vegan:      true } : {}),
      ...(diet === 'vegetarian' ? { vegetarian: true } : {}),
      ...(diet === 'glutenFree' ? { glutenFree: true } : {}),
      ...(diet === 'dairyFree'  ? { dairyFree:  true } : {}),
    },
    orderBy:
      sort === 'quickest' ? { readyInMinutes: 'asc' }
      : sort === 'az'     ? { title: 'asc' }
      :                     { createdAt: 'desc' },
    take: 50,
  })
}

export async function getRecipeById(id) {
  return prisma.recipe.findUnique({ where: { id } })
}

export async function getCategories() {
  const rows = await prisma.recipe.findMany({
    select: { category: true },
    distinct: ['category'],
    where: { category: { not: null }, isPersonal: false },
    orderBy: { category: 'asc' },
  })
  return rows.map(r => r.category).filter(Boolean)
}

export async function getCuisines() {
  const rows = await prisma.recipe.findMany({
    select: { cuisine: true },
    distinct: ['cuisine'],
    where: { cuisine: { not: null }, isPersonal: false },
    orderBy: { cuisine: 'asc' },
  })
  return rows.map(r => r.cuisine).filter(Boolean)
}

export async function getSimilar(category, excludeId, limit = 4) {
  return prisma.recipe.findMany({
    where: {
      id: { not: excludeId },
      isPersonal: false,
      ...(category ? { category: { equals: category, mode: 'insensitive' } } : {}),
    },
    take: limit,
    orderBy: { createdAt: 'desc' },
  })
}
// ============================================
// Kochbuch (CookbookEntry) — neue Funktionen
// ============================================

export async function getCookbook() {
  return prisma.cookbookEntry.findMany({
    include: { recipe: true },
    orderBy: { createdAt: 'desc' },
  })
}

export async function addToCookbook(recipeId) {
  return prisma.cookbookEntry.upsert({
    where:  { recipeId },
    update: {},
    create: { recipeId },
  })
}

export async function removeFromCookbook(recipeId) {
  return prisma.cookbookEntry.delete({
    where: { recipeId },
  })
}

export async function updateNote(recipeId, notes) {
  return prisma.cookbookEntry.update({
    where: { recipeId },
    data:  { notes },
  })
}

export async function isInCookbook(recipeId) {
  const entry = await prisma.cookbookEntry.findUnique({
    where: { recipeId },
  })
  return !!entry
}