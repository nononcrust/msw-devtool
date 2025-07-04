import { setupServer } from 'msw/node';
import { mockHandlers } from './handlers/index';
import {
  type createMockHandlerGroup,
  type MockHandler,
  type MockPreset,
  matchHandler,
  registerHandler,
} from './utils';

const createMockServer = <T extends readonly MockHandler[]>(
  mockHandlerGroups: ReturnType<typeof createMockHandlerGroup>[]
) => {
  const handlers = mockHandlerGroups.flatMap((mockHandler) =>
    registerHandler(
      mockHandler.handlers.map((handler) => ({
        ...handler,
        preset: handler.presets[0],
      }))
    )
  );

  const server = setupServer(...handlers);

  const applyMock = ({ method, path, preset }: UseMockParams<T>) => {
    const handlers = mockHandlerGroups.flatMap(
      (mockHandler) => mockHandler.handlers
    );

    const matchedHandler = handlers.find((handler) => {
      return matchHandler(handler, { method, path });
    });

    if (!matchedHandler) {
      throw new Error(`해당하는 핸들러를 찾을 수 없습니다: ${method} ${path}`);
    }

    const matchedPreset = matchedHandler.presets.find(
      (p) => p.label === preset
    );

    if (!matchedPreset) {
      throw new Error(
        `해당하는 프리셋을 찾을 수 없습니다: ${method} ${path} - ${preset}`
      );
    }

    server.use(
      ...registerHandler([
        {
          method: matchedHandler.method,
          path: matchedHandler.path,
          preset: matchedPreset,
        },
      ])
    );
  };

  const enhancedServer = Object.assign(server, {
    applyMock,
  });

  return enhancedServer;
};

export const server = createMockServer(mockHandlers);

type ExtractPresetLabels<T extends readonly MockPreset[]> = T[number]['label'];

type UseMockParams<T extends readonly MockHandler[]> = {
  [K in keyof T]: T[K] extends MockHandler<infer P>
    ? T[K]['presets'] extends readonly MockPreset[]
      ? {
          method: T[K]['method'];
          path: P;
          preset: ExtractPresetLabels<T[K]['presets']>;
        }
      : never
    : never;
}[number];

// server.applyMock({
//   method: 'GET',
//   path: '/posts',
//   preset: '기본 게시글 목록 조회',
// });
