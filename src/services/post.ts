import { useSuspenseQuery } from '@tanstack/react-query';
import z from 'zod/v4';
import { api } from '@/lib/api';

export type Post = z.infer<typeof Post>;
const Post = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
});

const GetPostListResponse = z.array(Post);

export const postApi = {
  getPosts: async () => {
    const response = await api.get('posts').json();
    return GetPostListResponse.parse(response);
  },
  getPostById: async (id: string) => {
    const response = await api.get(`posts/${id}`).json();
    return Post.parse(response);
  },
  getRecentPosts: async () => {
    const response = await api.get('posts/recent').json();
    return GetPostListResponse.parse(response);
  },
};

export const usePostList = () => {
  return useSuspenseQuery({
    queryKey: ['posts'],
    queryFn: postApi.getPosts,
  });
};

export const usePostDetail = (id: string) => {
  return useSuspenseQuery({
    queryKey: ['post', id],
    queryFn: () => postApi.getPostById(id),
  });
};

export const useRecentPostList = () => {
  return useSuspenseQuery({
    queryKey: ['recentPosts'],
    queryFn: postApi.getRecentPosts,
  });
};
