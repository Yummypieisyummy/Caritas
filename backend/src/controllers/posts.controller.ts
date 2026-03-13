import * as postsService from '../services/posts.service';

export const createPost = async (req, res) => {
  const orgId = req.user.org_id;

  const createPostPayload = {
    ...req.body,
    org_id: orgId,
  };

  const post = await postsService.createPost(createPostPayload);
  res.status(201).json(post);
};

export const getPostById = async (req, res) => {
  const post = await postsService.getPostById(req.params.id);
  res.json(post);
};

export const listPosts = async (req, res) => {
  const orgId = req.user.org_id;
  // add post filters later
  const posts = await postsService.listPosts(orgId);
  res.json(posts);
};
