import { render, screen } from '@testing-library/react';
import App from 'D:\\7 sem\\7 sem\\FSD\\project\\frontend1\\src\\App.css';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
