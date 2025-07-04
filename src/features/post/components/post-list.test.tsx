import { screen } from '@testing-library/react';
import { server } from '@/mocks/server';
import { renderWithProviders } from '@/tests/utils';
import { PostList } from './post-list';

describe('PostList', () => {
  test('게시글 목록을 정상적으로 렌더링해야 합니다.', async () => {
    renderWithProviders(<PostList />);

    const postList = await screen.findByTestId('post-list');

    expect(postList).toBeInTheDocument();
  });

  test('게시글이 목록이 비었을 때, 빈 목록 UI가 표시되야 합니다.', async () => {
    server.applyMock({
      method: 'GET',
      path: '/posts',
      preset: '빈 목록',
    });

    renderWithProviders(<PostList />);

    const emptyText = await screen.findByText('게시글이 없습니다.');

    expect(emptyText).toBeInTheDocument();
  });
});
