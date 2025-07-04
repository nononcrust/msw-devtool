'use client';

import { ErrorBoundary, Suspense } from '@suspensive/react';
import { PostList } from '@/features/post/components/post-list';
import { MSWDevtool } from '@/mocks/components/devtool';

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
