import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, expect, test, vi } from 'vitest';
import DashboradSidebar from '../components/layout/DashboradSidebar';
import '@testing-library/jest-dom';

const mocks = vi.hoisted(() => ({
  org: { id: 'org-123', name: 'Habitat Restore', verified: true },
  logout: vi.fn(),
}));

vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    org: mocks.org,
    logout: mocks.logout,
  }),
}));

beforeEach(() => {
  vi.clearAllMocks();
  mocks.org = { id: 'org-123', name: 'Habitat Restore', verified: true };
});

test('links to the current organization public profile', () => {
  render(
    <MemoryRouter>
      <DashboradSidebar />
    </MemoryRouter>,
  );

  expect(
    screen.getByRole('link', { name: /view public profile/i }),
  ).toHaveAttribute('href', '/organization/org-123');
});
