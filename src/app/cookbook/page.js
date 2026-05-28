"use client";

import { useEffect, useState } from "react";
import CookbookClient from "./CookbookClient";
import {
  loadCookbookEntries,
  removeCookbookEntry,
  updateCookbookNote,
  removeInvalidRecipes,
} from "@/lib/cookbookStorage";
import { validateRecipesExist } from "@/actions/recipe";

export default function CookbookPage() {
  const [entries, setEntries] = useState(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 24;

  useEffect(() => {
    async function initializeCookbook() {
      const loaded = loadCookbookEntries();
      if (loaded.length === 0) {
        setEntries([]);
        return;
      }

      // Validate that recipes still exist in the database
      const recipeIds = loaded.map((entry) => entry.recipeId);
      const validIds = await validateRecipesExist(recipeIds);

      // Remove invalid recipes from localStorage
      const validEntries = removeInvalidRecipes(validIds);
      setEntries(validEntries);
    }

    initializeCookbook();
  }, []);

  if (entries === undefined) {
    return (
      <main
        style={{
          maxWidth: "var(--maxw)",
          margin: "0 auto",
          padding: "3rem 1.5rem 5rem",
        }}
      >
        <p>Loading cookbook...</p>
      </main>
    );
  }

  const totalPages = Math.ceil(entries.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedEntries = entries.slice(startIndex, startIndex + pageSize);

  return (
    <main
      style={{
        maxWidth: "var(--maxw)",
        margin: "0 auto",
        padding: "3rem 1.5rem 5rem",
      }}
    >
      <h1
        style={{ fontSize: "clamp(2rem, 4vw, 3rem)", marginBottom: "0.4rem" }}
      >
        My Cookbook
      </h1>
      <p style={{ color: "var(--ink-soft)", marginBottom: "2.5rem" }}>
        {entries.length === 0
          ? "No recipes saved yet."
          : `${entries.length} saved recipes`}
      </p>

      {entries.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "5rem 0",
            color: "var(--ink-soft)",
          }}
        >
          <p style={{ fontSize: "3rem", marginBottom: "1rem" }}>📖</p>
          <p style={{ fontSize: "1.2rem", marginBottom: "1.5rem" }}>
            Your cookbook is still empty.
          </p>
          <a href="/recipes" className="btn">
            Discover recipes
          </a>
        </div>
      ) : (
        <>
          <CookbookClient
            entries={paginatedEntries}
            onRemove={(recipeId) => {
              const updated = removeCookbookEntry(recipeId);
              setEntries(updated);
              if (
                currentPage > Math.ceil(updated.length / pageSize) &&
                currentPage > 1
              ) {
                setCurrentPage(currentPage - 1);
              }
            }}
            onUpdateNote={(recipeId, notes) =>
              setEntries(updateCookbookNote(recipeId, notes))
            }
          />
          <div
            style={{
              display: "flex",
              gap: 8,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 20,
            }}
          >
            {currentPage > 1 ? (
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                className="btn pagination-btn"
              >
                ❮
              </button>
            ) : (
              <button className="btn pagination-btn" type="button" disabled>
                ❮
              </button>
            )}
            <span style={{ alignSelf: "center" }}>
              {currentPage} / {totalPages}
            </span>
            {currentPage < totalPages ? (
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                className="btn pagination-btn"
              >
                ❯
              </button>
            ) : (
              <button className="btn pagination-btn" type="button" disabled>
                ❯
              </button>
            )}
          </div>
        </>
      )}
    </main>
  );
}
