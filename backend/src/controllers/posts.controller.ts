import * as postsService from "../services/posts.service";

export const createPost = async (req, res) => {
  const post = await postsService.createPost(req.body);
  res.status(201).json(post);
};

export const getPostById = async (req, res) => {
  const post = await postsService.getPostById(req.params.id);
  res.json(post);
};

export const listPosts = async (req, res) => {
  const posts = await postsService.listPosts(req.query);
  res.json(posts);
};
