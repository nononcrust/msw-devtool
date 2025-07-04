"use client";

import { MSWDevtool } from "@/mocks/components/devtool";
import { usePostDetail, usePostList, useRecentPostList } from "@/services/post";
import { ErrorBoundary, Suspense } from "@suspensive/react";

export default function Home() {
  return (
    <main>
      <MSWDevtool />
      <ErrorBoundary fallback={<div>에러가 발생했습니다.</div>}>
        <Suspense clientOnly>
          <PostList />
        </Suspense>
      </ErrorBoundary>
    </main>
  );
}

const PostList = () => {
  const { data: posts } = usePostList();
  const { data: recentPosts } = useRecentPostList();
  const { data: post } = usePostDetail("1");

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
};
