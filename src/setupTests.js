import { fetch, FormData, Headers, Request, Response } from 'undici';

Object.assign(globalThis, { fetch, FormData, Headers, Request, Response });

import '@testing-library/jest-dom/vitest';
import { beforeAll, afterEach, afterAll } from 'vitest';
import { server } from './mocks/server.js';
import { resetStudentsDb } from './mocks/handlers.js';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

afterEach(() => {
  resetStudentsDb();
  server.resetHandlers();
});

afterAll(() => server.close());
