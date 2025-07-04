import { HttpResponse, http, type JsonBodyType } from 'msw';

type NonEmptyArray<T> = [T, ...T[]];

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export type MockHandler<TPath extends string = string> = {
  method: HttpMethod;
  path: TPath;
  presets: NonEmptyArray<MockPreset>;
};

type RegisteredMockHandler<TPath extends string = string> = {
  method: HttpMethod;
  path: TPath;
  preset: MockPreset;
};

export type MockPreset<TResponse = JsonBodyType> = {
  label: string;
  status: number;
  response: TResponse;
};

type MockHandlerGroup = {
  baseUrl: string;
  handlers: MockHandler[];
};

export const matchHandler = (
  a: { method: string; path: string },
  b: { method: string; path: string }
) => {
  return a.method === b.method && a.path === b.path;
};

export const registerHandler = (handlers: RegisteredMockHandler[]) => {
  return handlers.map(({ method, path, preset }) => {
    return http[methodMap[method]](path, () => {
      return HttpResponse.json(preset.response, {
        status: preset.status,
      });
    });
  });
};

// type ExtractPresetLabels<T extends readonly MockPreset[]> = T[number]["label"];

// type UseMockParams<T extends readonly MockHandler[]> = {
//   [K in keyof T]: T[K] extends MockHandler<infer P>
//     ? T[K]["presets"] extends readonly MockPreset[]
//       ? {
//           method: T[K]["method"];
//           path: P;
//           preset: ExtractPresetLabels<T[K]["presets"]>;
//         }
//       : never
//     : never;
// }[number];

const resolveBaseUrl = (baseUrl: string, path: string) => {
  return path === '/' ? baseUrl : `${baseUrl}${path}`;
};

export const createMockHandlerGroup = <T extends NonEmptyArray<MockHandler>>(
  baseUrl: string,
  handlers: T
): MockHandlerGroup => {
  return {
    baseUrl,
    handlers: handlers.map((handler) => {
      return {
        ...handler,
        path: resolveBaseUrl(baseUrl, handler.path),
      };
    }),
    // useMock: ({ method, path, preset }: UseMockParams<T>) => {
    //   const matchedHandler = handlers.find((handler) => {
    //     return handler.method === method && handler.path === path;
    //   });

    //   if (!matchedHandler) {
    //     throw new Error(
    //       `해당하는 핸들러를 찾을 수 없습니다: ${method} ${path}`
    //     );
    //   }

    //   const matchedPreset = matchedHandler.presets.find(
    //     (p) => p.label === preset
    //   );

    //   if (!matchedPreset) {
    //     throw new Error(
    //       `해당하는 프리셋을 찾을 수 없습니다: ${method} ${path} - ${preset}`
    //     );
    //   }
    // },
  };
};

const methodMap: Record<HttpMethod, keyof typeof http> = {
  GET: 'get',
  POST: 'post',
  PUT: 'put',
  DELETE: 'delete',
};
