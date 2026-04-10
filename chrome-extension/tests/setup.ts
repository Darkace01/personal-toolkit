import { vi } from 'vitest';

// Mock chrome APIs for testing
const chromeMock = {
  storage: {
    sync: {
      get: vi.fn(),
      set: vi.fn(),
    },
    local: {
      get: vi.fn(),
      set: vi.fn(),
    },
  },
  runtime: {
    onInstalled: { addListener: vi.fn() },
    onMessage: { addListener: vi.fn() },
    sendMessage: vi.fn(),
    openOptionsPage: vi.fn(),
  },
  tabs: {
    onUpdated: { addListener: vi.fn() },
    query: vi.fn(),
    sendMessage: vi.fn(),
  },
  scripting: {
    executeScript: vi.fn(),
    insertCSS: vi.fn(),
    removeCSS: vi.fn(),
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(global as Record<string, unknown>).chrome = chromeMock;
