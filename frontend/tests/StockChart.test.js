import React from 'react';
import { render, screen } from '@testing-library/react';
import StockChart from '../src/components/StockChart';

test('renders StockChart component', () => {
  const data = [{ date: '2023-01-01', close: 100 }];
  render(<StockChart data={data} />);
  expect(screen.getByRole('img')).toBeInTheDocument();
});
