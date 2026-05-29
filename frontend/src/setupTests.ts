// jest-dom adds custom jest matchers for asserting on DOM nodes.
import '@testing-library/jest-dom';

// React Router v7 uses TextEncoder/TextDecoder which jsdom doesn't expose globally.
// Polyfill them from the Node.js built-in util module.
import { TextEncoder, TextDecoder } from 'util';
(global as any).TextEncoder = TextEncoder;
(global as any).TextDecoder = TextDecoder;
