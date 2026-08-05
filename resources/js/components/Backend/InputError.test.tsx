import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import InputError from './InputError';

describe('InputError', () => {
  it('renders the message prop', () => {
    render(<InputError message="Title is required" />);
    expect(screen.getByText('Title is required')).toBeInTheDocument();
  });

  it('renders children when message prop is omitted', () => {
    render(<InputError>Subtitle is required</InputError>);
    expect(screen.getByText('Subtitle is required')).toBeInTheDocument();
  });

  it('renders nothing when both message and children are empty', () => {
    const { container } = render(<InputError />);
    expect(container).toBeEmptyDOMElement();
  });
});
