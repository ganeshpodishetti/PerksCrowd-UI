import { describe, expect, it, jest } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import { fireEvent, render, screen } from '@testing-library/react';
import type { ImgHTMLAttributes } from 'react';
import type { Deal } from '@/shared/types';
import DealCard from '../DealCard';

jest.mock('../../DealDetail/DealDetail', () => ({
  __esModule: true,
  default: ({ trigger }: { trigger: any }) => <>{trigger}</>,
}));

jest.mock('next/image', () => ({
  __esModule: true,
  // eslint-disable-next-line @next/next/no-img-element
  default: (props: ImgHTMLAttributes<HTMLImageElement>) => <img {...props} alt={props.alt || ''} />,
}));

const baseDeal: Deal = {
  id: 'deal-1',
  title: 'Student Discount',
  description: 'Save on your order',
  discount: '20% OFF',
  isActive: true,
  url: 'https://example.com/deal',
  redeemType: 'Online',
  isUniversitySpecific: false,
  categoryName: 'Food',
  storeName: 'Store A',
};

describe('DealCard', () => {
  it('uses logoUrl first when both logoUrl and imageUrl are present', () => {
    render(
      <DealCard
        deal={{
          ...baseDeal,
          logoUrl: 'https://cdn.example.com/logo.png',
          imageUrl: 'https://cdn.example.com/image.png',
        }}
      />,
    );

    const image = screen.getByTestId('deal-card-image');
    expect(image).toHaveAttribute('src', 'https://cdn.example.com/logo.png');
  });

  it('falls back to imageUrl when logoUrl is missing', () => {
    render(
      <DealCard
        deal={{
          ...baseDeal,
          imageUrl: 'https://cdn.example.com/image.png',
        }}
      />,
    );

    const image = screen.getByTestId('deal-card-image');
    expect(image).toHaveAttribute('src', 'https://cdn.example.com/image.png');
  });

  it('shows first-letter fallback when image fails to load', () => {
    render(
      <DealCard
        deal={{
          ...baseDeal,
          logoUrl: 'https://cdn.example.com/broken.png',
        }}
      />,
    );

    fireEvent.error(screen.getByTestId('deal-card-image'));

    expect(screen.queryByTestId('deal-card-image')).not.toBeInTheDocument();
    expect(screen.getByTestId('deal-card-image-fallback')).toHaveTextContent('S');
  });
});


