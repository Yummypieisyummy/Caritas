import { MeiliSearch } from "meilisearch";
import { db } from "./db";

const client = new MeiliSearch({
  host: process.env.MEILISEARCH_URL,
  apiKey: process.env.MEILISEARCH_AUTH,
});

// Function to create or update an index
async function setupIndex() {
  const index = await client.index("index_name");
  await index.addDocuments(await db.getDocuments());
}

// Function to search documents
async function searchDocuments(query: string) {
  const index = client.index("index_name");
  const searchResults = await index.search(query);
  return searchResults.hits;
}

setupIndex();
