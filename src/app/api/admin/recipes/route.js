import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/adminAuth";

function getTokenFromHeader(request) {
  const h =
    request.headers.get("authorization") ||
    request.headers.get("Authorization");
  if (!h) return null;
  const parts = h.split(" ");
  if (parts.length === 2 && parts[0] === "Bearer") return parts[1];
  return null;
}

function normalizeJsonList(input) {
  if (input == null || input === "") return null;
  if (Array.isArray(input)) return JSON.stringify(input.filter(Boolean));
  if (typeof input === "string") {
    try {
      const parsed = JSON.parse(input);
      if (Array.isArray(parsed)) return JSON.stringify(parsed.filter(Boolean));
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

export async function GET(request) {
  const token = getTokenFromHeader(request);
  if (!token || !verifyToken(token))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const url = new URL(request.url);
    const q = url.searchParams.get("q") || undefined;
    const category = url.searchParams.get("category") || undefined;
    const cuisine = url.searchParams.get("cuisine") || undefined;
    const diet = url.searchParams.get("diet") || undefined;
    const sort = url.searchParams.get("sort") || undefined;
    const page = url.searchParams.get("page") || "1";
    const limit = url.searchParams.get("limit") || "24";

    // reuse the server action for searching with pagination and global category/cuisine lists
    const actions = await import("@/actions/recipe");
    const [{ recipes, total, page: p, limit: l }, categories, cuisines] =
      await Promise.all([
        actions.searchRecipes({
          q,
          category,
          cuisine,
          diet,
          sort,
          page: Number(page),
          limit: Number(limit),
        }),
        actions.getCategories(),
        actions.getCuisines(),
      ]);

    return NextResponse.json({
      recipes,
      total,
      page: p,
      limit: l,
      categories,
      cuisines,
    });
  } catch (e) {
    console.error("GET /api/admin/recipes error:", e?.message || e);
    return NextResponse.json(
      { error: "Failed to fetch recipes" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  const token = getTokenFromHeader(request);
  if (!token || !verifyToken(token))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const data = {
      title: body.title || "Untitled",
      image: body.image || "",
      summary: body.summary || null,
      instructions: normalizeJsonList(body.instructions),
      ingredients: normalizeJsonList(body.ingredients),
      category: body.category || null,
      cuisine: body.cuisine || null,
      readyInMinutes: body.readyInMinutes ? Number(body.readyInMinutes) : null,
      servings: body.servings ? Number(body.servings) : null,
      sourceUrl: body.sourceUrl || null,
      externalId: body.externalId ? Number(body.externalId) : null,
      featured: !!body.featured,
      vegan: !!body.vegan,
      vegetarian: !!body.vegetarian,
      glutenFree: !!body.glutenFree,
      dairyFree: !!body.dairyFree,
      isPersonal: body.isPersonal !== undefined ? !!body.isPersonal : true,
    };

    const created = await prisma.recipe.create({ data });
    return NextResponse.json({ recipe: created });
  } catch (e) {
    console.error("POST /api/admin/recipes error:", e.message);
    let error = "Failed to create recipe";
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2002"
    ) {
      const target = Array.isArray(e.meta?.target)
        ? e.meta.target.join(", ")
        : String(e.meta?.target || "");
      const externalIdConstraint = /externalId|external_id/i;
      if (
        externalIdConstraint.test(target) ||
        externalIdConstraint.test(e.message)
      ) {
        error = "External ID must be unique";
      } else {
        error = "Unique constraint failed";
      }
    } else if (e instanceof Error) {
      error = e.message;
    }
    return NextResponse.json({ error }, { status: 400 });
  }
}

export async function PUT(request) {
  const token = getTokenFromHeader(request);
  if (!token || !verifyToken(token))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const url = new URL(request.url);
    const id = Number(url.searchParams.get("id"));
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    const body = await request.json();

    if ("title" in body && !body.title?.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }
    if ("image" in body && !body.image?.trim()) {
      return NextResponse.json(
        { error: "Image URL is required" },
        { status: 400 },
      );
    }

    const data = {};
    [
      "title",
      "image",
      "summary",
      "instructions",
      "ingredients",
      "category",
      "cuisine",
      "sourceUrl",
      "externalId",
      "isPersonal",
    ].forEach((k) => {
      if (k in body) {
        if (k === "ingredients" || k === "instructions") {
          data[k] = normalizeJsonList(body[k]);
        } else if (k === "externalId") {
          data[k] = body[k] ? Number(body[k]) : null;
        } else if (k === "isPersonal") {
          data[k] = !!body[k];
        } else {
          data[k] = body[k];
        }
      }
    });
    if ("readyInMinutes" in body)
      data.readyInMinutes = body.readyInMinutes
        ? Number(body.readyInMinutes)
        : null;
    if ("servings" in body)
      data.servings = body.servings ? Number(body.servings) : null;
    ["featured", "vegan", "vegetarian", "glutenFree", "dairyFree"].forEach(
      (k) => {
        if (k in body) data[k] = !!body[k];
      },
    );

    const updated = await prisma.recipe.update({ where: { id }, data });
    return NextResponse.json({ recipe: updated });
  } catch (e) {
    console.error("PUT /api/admin/recipes error:", e.message);
    let error = "Failed to update recipe";
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2002"
    ) {
      const target = Array.isArray(e.meta?.target)
        ? e.meta.target.join(", ")
        : String(e.meta?.target || "");
      const externalIdConstraint = /externalId|external_id/i;
      if (
        externalIdConstraint.test(target) ||
        externalIdConstraint.test(e.message)
      ) {
        error = "External ID must be unique";
      } else {
        error = "Unique constraint failed";
      }
    } else if (e instanceof Error) {
      error = e.message;
    }
    return NextResponse.json({ error }, { status: 400 });
  }
}

export async function DELETE(request) {
  const token = getTokenFromHeader(request);
  if (!token || !verifyToken(token))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const url = new URL(request.url);
    const id = Number(url.searchParams.get("id"));
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    await prisma.recipe.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("DELETE /api/admin/recipes error:", e.message);
    return NextResponse.json(
      { error: e.message || "Failed to delete recipe" },
      { status: 400 },
    );
  }
}
