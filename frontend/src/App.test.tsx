import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// unfortunately i didnt have time this weekend to implement tests,
// but obviously a real application should strive to have full code
// coverage whether that be on the front or backend
test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
