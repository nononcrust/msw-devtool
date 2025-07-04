'use client';

import { ErrorBoundary, Suspense } from '@suspensive/react';
import { MSWDevtool } from '@/mocks/components/devtool';
import { usePostList } from '@/services/post';

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

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
};
