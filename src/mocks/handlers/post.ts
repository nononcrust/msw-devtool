import { createMockHandlerGroup } from '../utils';

const mockPosts = [{ id: '1', title: '첫 번째 게시글', content: '내용 1' }];

export const postHandlers = createMockHandlerGroup('/posts', [
  {
    method: 'GET',
    path: '/',
    presets: [
      {
        label: '기본 게시글 목록 조회',
        status: 200,
        response: mockPosts,
      },
      {
        label: '빈 목록',
        status: 200,
        response: [],
      },
    ],
  },
  {
    method: 'GET',
    path: '/recent',
    presets: [
      {
        label: '최근 게시글 조회',
        status: 200,
        response: mockPosts,
      },
      {
        label: '빈 목록',
        status: 200,
        response: [],
      },
    ],
  },
  {
    method: 'GET',
    path: '/:id',
    presets: [
      {
        label: '게시글 상세',
        status: 200,
        response: mockPosts[0],
      },
    ],
  },
]);
