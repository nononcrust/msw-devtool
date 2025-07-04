import { useSuspenseQuery } from '@tanstack/react-query';
import { z } from 'zod/v4';
import { api } from '@/lib/api';

const User = z.object({
  id: z.string(),
  name: z.string(),
});

const GetUserListResponse = z.array(User);

export const userApi = {
  getUserList: async () => {
    const response = await api.get('users');
    return GetUserListResponse.parse(response.data);
  },
  getUserById: async (id: string) => {
    const response = await api.get(`users/${id}`);
    return User.parse(response.data);
  },
};

export const useUserList = () => {
  return useSuspenseQuery({
    queryKey: ['users'],
    queryFn: userApi.getUserList,
  });
};

export const useUserDetail = (id: string) => {
  return useSuspenseQuery({
    queryKey: ['user', id],
    queryFn: () => userApi.getUserById(id),
  });
};
