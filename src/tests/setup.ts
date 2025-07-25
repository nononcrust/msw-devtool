import { server } from '../mocks/server';
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';

import { afterAll, afterEach, beforeAll } from 'vitest';

beforeAll(() => {
  server.listen();
});

afterEach(() => {
  server.resetHandlers();
  cleanup();
});

afterAll(() => server.close());
