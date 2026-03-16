import { createContext, use, ReactNode, useState } from 'react';
import { PostRequest, PostResponse } from '../types/posts';
import * as postsServices from '../services/posts.api';

type PostsContextValue = {
  orgPosts: PostResponse[];
  publicPosts: PostResponse[];
  createPost: (data: PostRequest) => Promise<PostResponse>;
  getOrgPosts: () => Promise<PostResponse[]>;
  getPublicPosts: () => Promise<PostResponse[]>;
  updatePostStatus: (
    postId: string,
    newStatus: 'active' | 'closed',
  ) => Promise<PostResponse>;
  deletePost: (postId: string) => Promise<void>;
};

const PostsContext = createContext<PostsContextValue | undefined>(undefined);

export const PostsProvider = ({ children }: { children: ReactNode }) => {
  const [orgPosts, setOrgPosts] = useState<PostResponse[]>([]);
  const [publicPosts, setPublicPosts] = useState<PostResponse[]>([]);

  const createPost = async (data: PostRequest) => {
    const newPost = await postsServices.createPostRequest(data);
    setOrgPosts((prev) => [...prev, newPost]);
    return newPost;
  };

  const getOrgPosts = async () => {
    const posts = await postsServices.getOrgPostsRequest();
    setOrgPosts(posts);
    return posts;
  };

  const getPublicPosts = async () => {
    const posts = await postsServices.getPublicPostsRequest();
    setPublicPosts(posts);
    return posts;
  };

  const updatePostStatus = async (
    postId: string,
    newStatus: 'active' | 'closed',
  ) => {
    // Update UI first
    setOrgPosts((prev) =>
      prev.map((post) =>
        post.id === postId ? { ...post, status: newStatus } : post,
      ),
    );

    const updatedPost = await postsServices.updatePostStatusRequest(
      postId,
      newStatus,
    );

    // Check DB response is accurate
    setOrgPosts((prev) =>
      prev.map((post) => (post.id === postId ? updatedPost : post)),
    );

    return updatedPost;
  };

  const deletePost = async (postId: string) => {
    await postsServices.deletePostRequest(postId);
    setOrgPosts((prev) => prev.filter((post) => post.id !== postId));
  };

  return (
    <PostsContext
      value={{
        orgPosts,
        publicPosts,
        createPost,
        getOrgPosts,
        getPublicPosts,
        updatePostStatus,
        deletePost,
      }}
    >
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
