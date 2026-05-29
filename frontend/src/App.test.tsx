import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App';

const renderApp = () =>
  render(
    <Provider store={store}>
      <App />
    </Provider>,
  );

beforeEach(() => {
  // Suppress React Router / act() noise in test output
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('renders without crashing', () => {
  expect(() => renderApp()).not.toThrow();
});

test('renders Apna brand name in navbar', () => {
  renderApp();
  // Navbar renders the brand text "Apna" (case-insensitive)
  const brandEls = screen.getAllByText(/apna/i);
  expect(brandEls.length).toBeGreaterThan(0);
});

test('renders Candidate Login button for unauthenticated users', () => {
  renderApp();
  expect(screen.getByRole('button', { name: /candidate login/i })).toBeInTheDocument();
});

test('renders Employer Login link for unauthenticated users', () => {
  renderApp();
  expect(screen.getByRole('link', { name: /employer login/i })).toBeInTheDocument();
});

test('renders hero headline on home page', () => {
  renderApp();
  expect(screen.getByText(/your job search ends here/i)).toBeInTheDocument();
});
