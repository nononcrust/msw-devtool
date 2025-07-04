'use client';

import { Suspense } from '@suspensive/react';
import { type SetupWorker, setupWorker } from 'msw/browser';
import { useCallback, useEffect, useRef, useState } from 'react';
import { z } from 'zod/v4';
import { createContextFactory } from '@/lib/context';
import { mockHandlers } from '../handlers';
import { type MockHandler, matchHandler, registerHandler } from '../utils';

const STORAGE_KEY = 'enabledHandlerIds';

type EnabledHandler = z.infer<typeof EnabledHandler>;
const EnabledHandler = z.object({
  method: z.string(),
  path: z.string(),
  preset: z.string(),
});

type HandlerConfig = z.infer<typeof HandlerConfig>;
const HandlerConfig = z.object({
  enabledHandlers: z.array(EnabledHandler),
});

const defaultHandlerConfig: HandlerConfig = {
  enabledHandlers: [],
};

export const DevOnlyMSWProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  if (process.env.NODE_ENV !== 'development') {
    return <>{children}</>;
  }

  return (
    <Suspense clientOnly>
      <MSWProvider>{children}</MSWProvider>
    </Suspense>
  );
};

export const MSWProvider = ({ children }: { children: React.ReactNode }) => {
  const getInitialHandlerConfig = () => {
    try {
      const storedValue = window.localStorage.getItem(STORAGE_KEY);

      if (!storedValue) {
        return defaultHandlerConfig;
      }

      return HandlerConfig.parse(JSON.parse(storedValue));
    } catch {
      return defaultHandlerConfig;
    }
  };

  const initialHandlerConfig = getInitialHandlerConfig();

  const [currentWorker, setCurrentWorker] = useState<SetupWorker | null>(null);

  const [handlerConfig, setHandlerConfig] =
    useState<HandlerConfig>(initialHandlerConfig);

  const getEnabledHttpHandlers = useCallback(
    (enabledHandlers: EnabledHandler[]) => {
      const allHandlers = mockHandlers.flatMap(
        (handlerGroup) => handlerGroup.handlers
      );

      const filteredHandlers = allHandlers
        .filter((handler) => {
          return enabledHandlers.some((enabledHandler) =>
            matchHandler(enabledHandler, handler)
          );
        })
        .map((handler) => {
          const usedPresetLabel = enabledHandlers.find((enabledHandler) =>
            matchHandler(enabledHandler, handler)
          )?.preset;

          const enabledPreset =
            handler.presets.find(
              (preset) => preset.label === usedPresetLabel
            ) ?? handler.presets[0];

          return {
            ...handler,
            preset: enabledPreset,
          };
        });

      return registerHandler(filteredHandlers);
    },
    []
  );

  const isMountedRef = useRef(false);
  useEffect(() => {
    if (isMountedRef.current) {
      return;
    }

    const startWorker = async () => {
      const enabledHttpHandlers = getEnabledHttpHandlers(
        handlerConfig.enabledHandlers
      );

      const worker = setupWorker(...enabledHttpHandlers);

      await worker.start({
        onUnhandledRequest: 'bypass',
      });

      setCurrentWorker(worker);
    };

    startWorker();

    isMountedRef.current = true;
  }, [getEnabledHttpHandlers, handlerConfig.enabledHandlers]);

  const updateEnabledHandlers = (enabledHandlers: EnabledHandler[]) => {
    if (currentWorker === null) {
      throw new Error('Worker가 초기화되기 전에 실행할 수 없습니다.');
    }

    const newConfig: HandlerConfig = {
      ...handlerConfig,
      enabledHandlers,
    };

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig));

    const enabledWorkerHandlers = getEnabledHttpHandlers(enabledHandlers);

    setHandlerConfig(newConfig);

    currentWorker.resetHandlers(...enabledWorkerHandlers);
  };

  const toggleHandlerEnabled = (handler: MockHandler) => {
    if (
      handlerConfig.enabledHandlers.some((enabledHandler) =>
        matchHandler(enabledHandler, handler)
      )
    ) {
      updateEnabledHandlers(
        handlerConfig.enabledHandlers.filter((h) => !matchHandler(h, handler))
      );
    } else {
      const matchedHandler = mockHandlers
        .flatMap((handlerGroup) => handlerGroup.handlers)
        .find((h) => {
          return matchHandler(handler, h);
        });

      if (!matchedHandler) {
        throw new Error(
          `해당하는 핸들러를 찾을 수 없습니다: ${handler.method} ${handler.path}`
        );
      }

      updateEnabledHandlers([
        ...handlerConfig.enabledHandlers,
        { ...handler, preset: handler.presets[0].label },
      ]);
    }
  };

  const changePreset = (handler: EnabledHandler) => {
    const updatedHandlers = handlerConfig.enabledHandlers.map((h) => {
      if (matchHandler(h, handler)) {
        return { ...h, preset: handler.preset };
      }
      return h;
    });

    updateEnabledHandlers(updatedHandlers);
  };

  if (currentWorker === null) {
    return null;
  }

  return (
    <MSWProviderContext
      value={{
        handlerConfig,
        toggleHandlerEnabled,
        changePreset,
      }}
    >
      {children}
    </MSWProviderContext>
  );
};

type MSWProviderContextValue = {
  handlerConfig: HandlerConfig;
  toggleHandlerEnabled: (handler: MockHandler) => void;
  changePreset: (handler: EnabledHandler) => void;
};

const [MSWProviderContext, useMSWProviderContext] =
  createContextFactory<MSWProviderContextValue>('MSWProvider');

export { useMSWProviderContext };
