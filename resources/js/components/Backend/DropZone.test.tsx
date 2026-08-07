import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import DropZone from './DropZone';

describe('DropZone', () => {
  it('clears the preview when Remove is clicked', () => {
    const onValueChange = vi.fn();

    render(
      <DropZone
        defaultValue="https://example.com/preview.jpg"
        onValueChange={onValueChange}
      />
    );

    expect(screen.getByAltText('Upload preview')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Remove image' }));

    expect(onValueChange).toHaveBeenCalledWith(null);
  });

  it('shows upload progress from Inertia progress events', () => {
    render(
      <DropZone
        defaultValue="https://example.com/preview.jpg"
        progress={{ percentage: 42 }}
      />
    );

    expect(screen.getByText('Uploading…')).toBeInTheDocument();
    expect(screen.getByText('42%')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute(
      'aria-valuenow',
      '42'
    );
  });

  it('shows a pending progress bar after a file is selected while uploading', () => {
    const file = new File(['image-bytes'], 'photo.png', { type: 'image/png' });

    render(<DropZone uploading onValueChange={vi.fn()} />);

    const input = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;

    fireEvent.change(input, { target: { files: [file] } });

    expect(screen.getByText('Uploading…')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute(
      'aria-valuenow',
      '0'
    );
  });
});
