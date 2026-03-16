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
  res.status(200).json(post);
};

export const getOrgPosts = async (req, res) => {
  const orgId = req.user.org_id;
  // add post filters later
  const orgPosts = await postsService.listOrgPosts(orgId);
  res.status(200).json(orgPosts);
};

export const getPublicPosts = async (req, res) => {
  // Filters here

  const posts = await postsService.listPublicPosts();
  res.status(200).json(posts);
};

export const deletePostById = async (req, res) => {
  const orgId = req.user.org_id;
  const postId = req.params.id;

  await postsService.deletePostById(orgId, postId);
  res.status(204).json({ message: 'Successful logout' });
};

export const updatePostStatus = async (req, res) => {
  const orgId = req.user.org_id;
  const postId = req.params.id;
  const { status } = req.body;

  const post = await postsService.updatePostStatus(orgId, postId, status);
  res.status(200).json(post);
};
