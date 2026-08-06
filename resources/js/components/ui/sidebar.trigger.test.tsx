import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { SidebarProvider, SidebarTrigger } from './sidebar';

vi.mock('@/hooks/use-mobile', () => ({
  default: () => false,
}));

describe('SidebarTrigger', () => {
  it('renders a visible toggle control and persists collapsed state', () => {
    render(
      <SidebarProvider defaultOpen>
        <SidebarTrigger />
      </SidebarProvider>
    );

    const trigger = screen.getByRole('button', { name: /toggle sidebar/i });
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveAttribute('data-sidebar', 'trigger');

    fireEvent.click(trigger);

    expect(document.cookie).toMatch(/sidebar_state=false/);
  });
});
