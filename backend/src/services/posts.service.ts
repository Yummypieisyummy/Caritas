import { query } from "../config/db";

export async function createPost(data: any) {
  if (!data.title) {
    throw new Error("Post title is required");
  }

  const org = await query(
    `SELECT verified FROM organizations WHERE id = $1`,
    [data.org_id]
  );

  if (!org.rows.length) {
    throw new Error("Organization not found");
  }

  if (!org.rows[0].verified) {
    throw new Error("Organization is not verified");
  }

  const { rows } = await query(
    `
    INSERT INTO posts (
      org_id,
      type,
      title,
      short_description,
      long_description,
      location,
      date_start,
      date_end
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    RETURNING *
    `,
    [
      data.org_id,
      data.type,
      data.title,
      data.short_description,
      data.long_description,
      data.location,
      data.date_start,
      data.date_end,
    ]
  );

  return rows[0];
}

export async function getPostById(id: string) {
  const { rows } = await query(
    `SELECT * FROM posts WHERE id = $1`,
    [id]
  );

  if (!rows.length) {
    throw new Error("Post not found");
  }

  return rows[0];
}

// Changing how this functions
export async function listPosts(filters: any) {
  return NaN;
}
