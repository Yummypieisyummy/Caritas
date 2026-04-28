import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import OrganizationProfilePage from '../pages/OrganizationProfilePage';
import { PostResponse } from '../types/posts';

const mockUseOrgProfile = vi.hoisted(() => vi.fn());

vi.mock('../hooks/useOrgProfile', async () => {
  const actual = await vi.importActual('../hooks/useOrgProfile');
  return {
    ...actual,
    useOrgProfile: mockUseOrgProfile,
  };
});

vi.mock('../components/ui/Spinner', () => ({
  default: () => <div data-testid="spinner" />,
}));

const samplePost: PostResponse = {
  id: 'post-1',
  org_id: 'org-123',
  org_name: 'Habitat Restore',
  post_type: 'volunteer_request',
  event_type: 'one-time',
  title: 'Stock and sort donations',
  description: 'Help keep the donation center organized.',
  additional_details: 'Wear comfortable shoes.',
  location: '123 Main St',
  latitude: null,
  longitude: null,
  requirements: ['Orientation Needed'],
  date_start: '2026-05-10',
  date_end: null,
  days_of_week: null,
  contact_email: 'volunteer@habitat.org',
  interested: 4,
  status: 'active',
  contact_phone: '555-555-5555',
  created_at: '2026-04-01T00:00:00.000Z',
};

const orgProfileData = {
  organization: {
    id: 'org-123',
    name: 'Habitat Restore',
    verified: true,
    pfp_url: null,
    banner_url: null,
    email: 'info@habitat.org',
    about: 'Habitat Restore supports affordable housing projects.',
    contact_info: {
      address: '123 Main St',
      phone: '555-555-5555',
      email: 'contact@habitat.org',
      website: 'habitat.org',
      hours: 'Saturdays, 10AM-2PM',
    },
  },
  activePosts: [samplePost],
};

const renderPage = (paramId = 'org-123') =>
  render(
    <MemoryRouter initialEntries={[`/organization/${paramId}`]}>
      <Routes>
        <Route path="/organization/:id" element={<OrganizationProfilePage />} />
      </Routes>
    </MemoryRouter>,
  );

describe('OrganizationProfilePage', () => {
  beforeEach(() => {
    mockUseOrgProfile.mockReturnValue({
      data: orgProfileData,
      isLoading: false,
      isError: false,
    });
  });

  test('fetches profile data with the organization id from the route', () => {
    renderPage('org-123');

    expect(mockUseOrgProfile).toHaveBeenCalledWith('org-123');
  });

  test('shows a spinner while loading', () => {
    mockUseOrgProfile.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    });

    renderPage();

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  test('renders organization profile details', () => {
    renderPage();

    expect(screen.getByText('Habitat Restore')).toBeInTheDocument();
    expect(screen.getByText(/supports affordable housing/)).toBeInTheDocument();
    expect(screen.getAllByText('123 Main St').length).toBeGreaterThan(0);
    expect(screen.getAllByText('555-555-5555').length).toBeGreaterThan(0);
    expect(screen.getByText('contact@habitat.org')).toBeInTheDocument();
  });

  test('formats website links without a protocol', () => {
    renderPage();

    expect(screen.getByRole('link', { name: /habitat.org/ })).toHaveAttribute(
      'href',
      'https://habitat.org',
    );
  });

  test('renders active posts with compact filters', () => {
    renderPage();

    expect(screen.getByText('Active Posts')).toBeInTheDocument();
    expect(screen.getByText('Stock and sort donations')).toBeInTheDocument();
    expect(
      screen.getByRole('combobox', { name: 'Filter by post type' }),
    ).toBeInTheDocument();
  });

  test('expands post details', () => {
    renderPage();

    fireEvent.click(screen.getByRole('button', { name: /show more/i }));

    expect(screen.getByText('Wear comfortable shoes.')).toBeInTheDocument();
    expect(screen.getByText(/volunteer@habitat.org/)).toBeInTheDocument();
  });

  test('handles failed profile loading gracefully', () => {
    mockUseOrgProfile.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    });

    renderPage();

    expect(screen.getByText('Organization unavailable')).toBeInTheDocument();
    expect(screen.getByText('Back to Directory')).toBeInTheDocument();
  });
});
