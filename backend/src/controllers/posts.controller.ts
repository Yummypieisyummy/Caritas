import { Request, Response } from 'express';
import * as postsService from '../services/posts.service';
import { AuthPayload } from '../types/auth';

type RequestWithUser = Request & {
  user: AuthPayload;
};

type PostQueryFilters = {
  post_type?: string;
  event_type?: string;
  searchQuery?: string;
  daysNeeded?: string[];
  requirements?: string[];
  userLat?: number;
  userLng?: number;
  maxDistanceMiles?: number;
};

const POST_TYPES = [
  'volunteer_request',
  'volunteer_offer',
  'item_request',
  'item_offer',
] as const;

const EVENT_TYPES = ['one-time', 'recurring'] as const;

function singleQueryValue(value: unknown): string | undefined {
  if (Array.isArray(value)) {
    return value[0] ? String(value[0]) : undefined;
  }

  return value ? String(value) : undefined;
}

function parseStringList(value: unknown): string[] | undefined {
  if (!value) {
    return undefined;
  }

  const values = Array.isArray(value) ? value : [value];
  const parsedValues = values
    .flatMap((item) => String(item).split(','))
    .map((item) => item.trim())
    .filter(Boolean)
    .filter((item, index, items) => items.indexOf(item) === index);

  return parsedValues.length ? parsedValues : undefined;
}

function parseNumber(
  value: unknown,
  options: { min?: number; max?: number } = {},
): number | undefined {
  const singleValue = singleQueryValue(value);

  if (!singleValue) {
    return undefined;
  }

  const parsed = Number(singleValue);
  if (!Number.isFinite(parsed)) {
    return undefined;
  }

  if (options.min !== undefined && parsed < options.min) {
    return undefined;
  }

  if (options.max !== undefined && parsed > options.max) {
    return undefined;
  }

  return parsed;
}

function parseEnumValue<T extends readonly string[]>(
  value: unknown,
  allowedValues: T,
): T[number] | undefined {
  const singleValue = singleQueryValue(value);

  return singleValue && (allowedValues as readonly string[]).includes(singleValue)
    ? (singleValue as T[number])
    : undefined;
}

function getPostFilters(query: Request['query']): PostQueryFilters {
  return {
    post_type: parseEnumValue(query.post_type, POST_TYPES),
    event_type: parseEnumValue(query.event_type, EVENT_TYPES),
    searchQuery: singleQueryValue(query.searchQuery),
    daysNeeded: parseStringList(query.daysNeeded),
    requirements: parseStringList(query.requirements),
    userLat: parseNumber(query.userLat, { min: -90, max: 90 }),
    userLng: parseNumber(query.userLng, { min: -180, max: 180 }),
    maxDistanceMiles: parseNumber(query.maxDistanceMiles, { min: 0 }),
  };
}

export const createPost = async (req: RequestWithUser, res: Response) => {
  const orgId = req.user.org_id;

  const createPostPayload = {
    ...req.body,
    org_id: orgId,
  };

  const post = await postsService.createPost(createPostPayload);
  res.status(201).json(post);
};

export const getPostById = async (req: Request, res: Response) => {
  const post = await postsService.getPostById(String(req.params.id));
  res.status(200).json(post);
};

export const getOrgPosts = async (req: RequestWithUser, res: Response) => {
  const orgId = req.user.org_id;
  const orgPosts = await postsService.listOrgPosts(
    orgId,
    getPostFilters(req.query),
  );
  res.status(200).json(orgPosts);
};

export const getPublicPosts = async (req: Request, res: Response) => {
  const posts = await postsService.listPublicPosts(getPostFilters(req.query));
  res.status(200).json(posts);
};

export const deletePostById = async (req: RequestWithUser, res: Response) => {
  const orgId = req.user.org_id;
  const postId = String(req.params.id);

  await postsService.deletePostById(orgId, postId);
  res.status(204).json({ message: 'Successful logout' });
};

export const updatePostStatus = async (
  req: RequestWithUser,
  res: Response,
) => {
  const orgId = req.user.org_id;
  const postId = String(req.params.id);
  const { status } = req.body;

  const post = await postsService.updatePostStatus(orgId, postId, status);
  res.status(200).json(post);
};
