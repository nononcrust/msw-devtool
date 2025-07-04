import { api } from "@/lib/api";
import { useSuspenseQuery } from "@tanstack/react-query";
import { z } from "zod/v4";

const User = z.object({
  id: z.string(),
  name: z.string(),
});

const GetUserListResponse = z.array(User);

export const userApi = {
  getUserList: async () => {
    const response = await api.get("users").json();
    return GetUserListResponse.parse(response);
  },
  getUserById: async (id: string) => {
    const response = await api.get(`users/${id}`).json();
    return User.parse(response);
  },
};

export const useUserList = () => {
  return useSuspenseQuery({
    queryKey: ["users"],
    queryFn: userApi.getUserList,
  });
};

export const useUserDetail = (id: string) => {
  return useSuspenseQuery({
    queryKey: ["user", id],
    queryFn: () => userApi.getUserById(id),
  });
};
