import { createMockHandlerGroup } from '../utils';

const mockUsers = [{ id: '1', name: '손흥민' }];

export const userHandlers = createMockHandlerGroup('/users', [
  {
    method: 'GET',
    path: '/',
    presets: [
      {
        label: '유저 목록',
        status: 200,
        response: mockUsers,
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
        label: '유저 상세',
        status: 200,
        response: mockUsers[0],
      },
    ],
  },
]);
