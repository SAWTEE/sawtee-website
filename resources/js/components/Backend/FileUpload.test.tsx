import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import FileUpload from './FileUpload';

describe('FileUpload', () => {
  it('removes only the selected newly chosen file in multiple mode', () => {
    const onChange = vi.fn();
    const onRemove = vi.fn();
    const first = new File(['a'], 'one.pdf', { type: 'application/pdf' });
    const second = new File(['b'], 'two.pdf', { type: 'application/pdf' });

    render(
      <FileUpload
        multiple
        value={[first, second]}
        onChange={onChange}
        onRemove={onRemove}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Remove one.pdf' }));

    expect(onChange).toHaveBeenCalledWith([second]);
    expect(onRemove).not.toHaveBeenCalled();
    expect(screen.getByText('two.pdf')).toBeInTheDocument();
  });

  it('removes only the selected existing file on edit without clearing siblings', () => {
    const onChange = vi.fn();
    const onExistingChange = vi.fn();
    const onRemove = vi.fn();

    render(
      <FileUpload
        multiple
        existing={[
          { id: 1, name: 'kept.pdf', url: '/kept.pdf' },
          { id: 2, name: 'gone.pdf', url: '/gone.pdf' },
        ]}
        onChange={onChange}
        onExistingChange={onExistingChange}
        onRemove={onRemove}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Remove gone.pdf' }));

    expect(onExistingChange).toHaveBeenCalledWith([
      { id: 1, name: 'kept.pdf', url: '/kept.pdf' },
    ]);
    expect(onRemove).not.toHaveBeenCalled();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('clears all existing files when Remove all is clicked', () => {
    const onChange = vi.fn();
    const onExistingChange = vi.fn();
    const onRemove = vi.fn();

    render(
      <FileUpload
        multiple
        existing={[
          { id: 1, name: 'a.pdf' },
          { id: 2, name: 'b.pdf' },
        ]}
        onChange={onChange}
        onExistingChange={onExistingChange}
        onRemove={onRemove}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Remove' }));

    expect(onChange).toHaveBeenCalledWith(null);
    expect(onExistingChange).toHaveBeenCalledWith([]);
    expect(onRemove).toHaveBeenCalled();
  });
});
