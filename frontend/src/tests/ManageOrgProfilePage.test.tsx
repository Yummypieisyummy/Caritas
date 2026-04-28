import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, test, expect, vi } from 'vitest';
import ManageOrgProfilePage from '../pages/ManageOrgProfilePage';
import '@testing-library/jest-dom';

const mocks = vi.hoisted(() => ({
  org: { id: 'org-123', name: 'Habitat Restore', verified: true },
  mutateAsync: vi.fn(),
  useOrgProfile: vi.fn(),
}));

vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    org: mocks.org,
  }),
}));

vi.mock('../hooks/useOrgProfile', () => ({
  useOrgProfile: (...args: unknown[]) => mocks.useOrgProfile(...args),
}));

vi.mock('../hooks/useOrgSettings', () => ({
  useUpdateOrgProfile: () => ({
    mutateAsync: mocks.mutateAsync,
    isPending: false,
    isSuccess: false,
    error: null,
  }),
}));

const profileData = {
  organization: {
    id: 'org-123',
    name: 'Habitat Restore',
    verified: true,
    about: 'We provide community support and volunteer programs.',
    pfp_url: 'https://example.org/logo.png',
    banner_url: 'https://example.org/banner.png',
    email: 'admin@habitat.org',
    contact_info: {
      phone: '555-555-5555',
      public_email: 'volunteer@habitat.org',
    },
  },
  activePosts: [],
};

const renderPage = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <ManageOrgProfilePage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
};

beforeEach(() => {
  vi.clearAllMocks();
  mocks.org = { id: 'org-123', name: 'Habitat Restore', verified: true };
  mocks.mutateAsync.mockResolvedValue(profileData.organization);
  mocks.useOrgProfile.mockReturnValue({
    data: profileData,
    isLoading: false,
    isError: false,
  });
});

test('renders the profile editing form with current organization details', () => {
  renderPage();

  expect(
    screen.getByRole('heading', { name: 'Edit Organization Profile' }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole('heading', { name: 'Public Profile Details' }),
  ).toBeInTheDocument();
  expect(screen.getByLabelText('About')).toHaveValue(
    profileData.organization.about,
  );
  expect(screen.getByLabelText('Public Phone')).toHaveValue('555-555-5555');
  expect(screen.getByLabelText('Public Email')).toHaveValue(
    'volunteer@habitat.org',
  );
  expect(
    screen.getByRole('link', { name: /view public profile/i }),
  ).toHaveAttribute('href', '/organization/org-123');
});

test('shows a spinner while the organization profile loads', () => {
  mocks.useOrgProfile.mockReturnValue({
    data: undefined,
    isLoading: true,
    isError: false,
  });

  renderPage();

  expect(document.querySelector('.animate-spin')).toBeInTheDocument();
});

test('saves organization profile details', async () => {
  renderPage();

  fireEvent.click(screen.getByRole('button', { name: /save changes/i }));

  await waitFor(() => {
    expect(mocks.mutateAsync).toHaveBeenCalledWith({
      about: profileData.organization.about,
      contact_info: {
        phone: '555-555-5555',
        public_email: 'volunteer@habitat.org',
      },
      pfp_url: 'https://example.org/logo.png',
      banner_url: 'https://example.org/banner.png',
    });
  });
});

test('saves edited public text details', async () => {
  renderPage();

  fireEvent.change(screen.getByLabelText('About'), {
    target: {
      value:
        'We build neighborhood support programs with volunteers every week.',
    },
  });
  fireEvent.change(screen.getByLabelText('Public Phone'), {
    target: { value: '(555) 111-2222' },
  });
  fireEvent.change(screen.getByLabelText('Public Email'), {
    target: { value: 'HELLO@HABITAT.ORG' },
  });
  fireEvent.click(screen.getByRole('button', { name: /save changes/i }));

  await waitFor(() => {
    expect(mocks.mutateAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        about:
          'We build neighborhood support programs with volunteers every week.',
        contact_info: {
          phone: '(555) 111-2222',
          public_email: 'hello@habitat.org',
        },
      }),
    );
  });
});

test('allows optional profile image URLs to be blank', async () => {
  mocks.useOrgProfile.mockReturnValue({
    data: {
      ...profileData,
      organization: {
        ...profileData.organization,
        pfp_url: '',
        banner_url: '',
      },
    },
    isLoading: false,
    isError: false,
  });

  renderPage();

  fireEvent.click(screen.getByRole('button', { name: /save changes/i }));

  await waitFor(() => {
    expect(mocks.mutateAsync).toHaveBeenCalledWith({
      about: profileData.organization.about,
      contact_info: {
        phone: '555-555-5555',
        public_email: 'volunteer@habitat.org',
      },
      pfp_url: undefined,
      banner_url: undefined,
    });
  });
});

test('converts uploaded profile images to values the backend can store', async () => {
  renderPage();

  fireEvent.change(screen.getByTestId('logo-upload'), {
    target: {
      files: [new File(['logo'], 'logo.png', { type: 'image/png' })],
    },
  });
  fireEvent.change(screen.getByTestId('cover-upload'), {
    target: {
      files: [new File(['banner'], 'banner.webp', { type: 'image/webp' })],
    },
  });
  fireEvent.click(screen.getByRole('button', { name: /save changes/i }));

  await waitFor(() => {
    expect(mocks.mutateAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        pfp_url: expect.stringMatching(/^data:image\/png;base64,/),
        banner_url: expect.stringMatching(/^data:image\/webp;base64,/),
      }),
    );
  });
});

test('resets unsaved changes when cancel is clicked', async () => {
  renderPage();

  fireEvent.input(screen.getByLabelText('Public Phone'), {
    target: { value: '555-111-2222' },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

  await waitFor(() => expect(mocks.mutateAsync).not.toHaveBeenCalled());
});

test('renders an error state when the organization profile cannot load', () => {
  mocks.useOrgProfile.mockReturnValue({
    data: undefined,
    isLoading: false,
    isError: true,
  });

  renderPage();

  expect(screen.getByText('Profile unavailable')).toBeInTheDocument();
});
