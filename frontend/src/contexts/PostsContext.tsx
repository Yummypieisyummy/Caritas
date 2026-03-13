import { createContext, use, ReactNode, useState } from 'react';
import { PostRequest, PostResponse } from '../types/posts';
import * as postsServices from '../services/posts.api';

type PostsContextValue = {
  posts: PostResponse[];
  createPost: (data: PostRequest) => Promise<PostResponse>;
  getPosts: () => Promise<PostResponse[]>;
};

const PostsContext = createContext<PostsContextValue | undefined>(undefined);

export const PostsProvider = ({ children }: { children: ReactNode }) => {
  const [posts, setPosts] = useState<PostResponse[]>([]);

  const createPost = async (data: PostRequest) => {
    const newPost = await postsServices.createPostRequest(data);
    setPosts((prev) => [...prev, newPost]);
    return newPost;
  };

  const getPosts = async () => {
    const fetchedPosts = await postsServices.getPostsRequest();
    setPosts(fetchedPosts);
    return posts;
  };

  return (
    <PostsContext value={{ posts, createPost, getPosts }}>
      {children}
    </PostsContext>
  );
};

export const usePosts = () => {
  const context = use(PostsContext);

  if (!context) {
    throw new Error('usePosts must be used within PostsProvider');
  }

  return context;
};
