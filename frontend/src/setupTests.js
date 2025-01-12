import '@testing-library/jest-dom';
import { server } from './mocks/server';

// Add TextEncoder and TextDecoder polyfills
const { TextEncoder, TextDecoder } = require('node:util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock WebSocket
class WebSocketMock {
  constructor(url) {
    this.url = url;
    this.readyState = WebSocket.CONNECTING;
  }
  send(data) {}
  close() {}
}
global.WebSocket = WebSocketMock;
WebSocket.CONNECTING = 0;
WebSocket.OPEN = 1;
WebSocket.CLOSING = 2;
WebSocket.CLOSED = 3;

beforeAll(() => {
  // Enable API mocking before tests
  server.listen();
});

afterEach(() => {
  // Reset any runtime request handlers we may add during the tests
  server.resetHandlers();
  // Clear localStorage mock
  localStorage.clear();
  jest.clearAllMocks();
});

afterAll(() => {
  // Clean up after the tests are finished
  server.close();
}); 