import { registerHandler } from '../utils';
import { postHandlers } from './post';
import { userHandlers } from './user';

export const mockHandlers = [postHandlers, userHandlers];

export const handlers = mockHandlers.flatMap((mockHandler) =>
  registerHandler(
    mockHandler.handlers.map((handler) => ({
      ...handler,
      preset: handler.presets[0],
    }))
  )
);
