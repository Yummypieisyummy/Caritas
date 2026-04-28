import { Meilisearch } from 'meilisearch';
import { query } from './db';

const POSTS_INDEX = 'posts';

type PostDocument = {
  id: string;
  [key: string]: unknown;
  org_id?: string;
  post_type?: string;
  event_type?: string;
  title?: string;
  description?: string;
  additional_details?: string | null;
  location?: string;
  date_start?: string;
  date_end?: string | null;
  days_of_week?: string[] | null;
  requirements?: string[] | null;
  status?: string;
};

type SearchPostOptions = {
  status?: string;
};

const client = new Meilisearch({
  host: process.env.MEILISEARCH_URL ?? 'http://127.0.0.1:7700',
  apiKey: process.env.MEILISEARCH_AUTH,
});

const postsIndex = client.index<PostDocument>(POSTS_INDEX);
let initializationPromise: Promise<void> | null = null;

function toPostDocument(
  post: Partial<PostDocument> & { id: string },
): PostDocument {
  return {
    id: post.id,
    org_id: post.org_id,
    post_type: post.post_type,
    event_type: post.event_type,
    title: post.title,
    description: post.description,
    additional_details: post.additional_details,
    location: post.location,
    date_start: post.date_start,
    date_end: post.date_end,
    days_of_week: post.days_of_week,
    requirements: post.requirements,
    status: post.status,
  };
}

async function waitForTask(taskPromise: ReturnType<typeof postsIndex.addDocuments>) {
  const task = await taskPromise;
  await client.tasks.waitForTask(task.taskUid);
}

async function backfillPostsIndex() {
  const { rows } = await query<PostDocument>(`
    SELECT
      id,
      org_id,
      post_type,
      event_type,
      title,
      description,
      additional_details,
      location,
      date_start,
      date_end,
      days_of_week,
      requirements,
      status
    FROM posts
  `);

  if (rows.length) {
    await waitForTask(postsIndex.addDocuments(rows, { primaryKey: 'id' }));
  }
}

async function setupIndex() {
  try {
    await client.getIndex(POSTS_INDEX);
  } catch {
    const task = await client.createIndex(POSTS_INDEX, { primaryKey: 'id' });
    await client.tasks.waitForTask(task.taskUid);
  }

  await waitForTask(
    postsIndex.updateFilterableAttributes([
      'post_type',
      'status',
      'event_type',
      'org_id',
    ]),
  );

  await waitForTask(
    postsIndex.updateSearchableAttributes([
      'title',
      'description',
      'additional_details',
      'location',
      'requirements',
    ]),
  );

  await backfillPostsIndex();
}

export async function initializeSearchIndex() {
  initializationPromise ??= setupIndex().catch((error) => {
    initializationPromise = null;
    throw error;
  });

  return initializationPromise;
}

export async function addPostDocument(
  post: Partial<PostDocument> & { id: string },
) {
  await initializeSearchIndex();
  await waitForTask(
    postsIndex.addDocuments([toPostDocument(post)], { primaryKey: 'id' }),
  );
}

export async function updatePostDocument(
  post: Partial<PostDocument> & { id: string },
) {
  await initializeSearchIndex();
  await waitForTask(
    postsIndex.updateDocuments([toPostDocument(post)], { primaryKey: 'id' }),
  );
}

export async function deletePostDocument(id: string) {
  await initializeSearchIndex();
  const task = await postsIndex.deleteDocument(id);
  await client.tasks.waitForTask(task.taskUid);
}

export async function searchPostIds(
  searchQuery: string,
  options: SearchPostOptions = {},
): Promise<string[]> {
  await initializeSearchIndex();

  const results = await postsIndex.search(searchQuery, {
    attributesToRetrieve: ['id'],
    filter: options.status ? `status = "${options.status}"` : undefined,
  });

  return results.hits.map((hit: Pick<PostDocument, 'id'>) => hit.id);
}
