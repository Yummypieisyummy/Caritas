import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { beforeEach, test, expect, vi } from 'vitest';
import ManageOrgProfilePage from '../pages/ManageOrgProfilePage';
import '@testing-library/jest-dom';

const mocks = vi.hoisted(() => ({
  org: { id: 'org-123', name: 'Habitat Restore', verified: false },
  submitVerification: vi.fn(),
}));

vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    org: mocks.org,
  }),
}));

vi.mock('../services/org.api', () => ({
  submitOrganizationVerificationRequest: (...args: unknown[]) =>
    mocks.submitVerification(...args),
}));

const renderPage = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <ManageOrgProfilePage />
    </QueryClientProvider>,
  );
};

beforeEach(() => {
  vi.clearAllMocks();
  mocks.org = { id: 'org-123', name: 'Habitat Restore', verified: false };
  mocks.submitVerification.mockResolvedValue({ id: 'verification-123' });
});

test('renders profile and verification sections for unverified orgs', () => {
  renderPage();

  expect(
    screen.getByRole('heading', { name: 'Edit Organization Profile' }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole('heading', { name: 'Public Profile Details' }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole('heading', { name: 'Verification Documents' }),
  ).toBeInTheDocument();
});

test('allows banner, profile image, and document uploads', () => {
  renderPage();

  const banner = new File(['banner'], 'banner.png', { type: 'image/png' });
  const logo = new File(['logo'], 'logo.jpg', { type: 'image/jpeg' });
  const document = new File(['document'], '501c3.pdf', {
    type: 'application/pdf',
  });

  const bannerInput = screen.getByTestId('cover-upload') as HTMLInputElement;
  const logoInput = screen.getByTestId('logo-upload') as HTMLInputElement;
  const documentInput = screen.getByTestId(
    'verification-document-upload',
  ) as HTMLInputElement;

  fireEvent.change(bannerInput, { target: { files: [banner] } });
  fireEvent.change(logoInput, { target: { files: [logo] } });
  fireEvent.change(documentInput, { target: { files: [document] } });

  expect(bannerInput.files?.[0]).toBe(banner);
  expect(logoInput.files?.[0]).toBe(logo);
  expect(documentInput.files?.[0]).toBe(document);
});

test('disables verification submit until profile and documents are complete', () => {
  renderPage();

  const submitButton = screen.getByRole('button', {
    name: 'Submit for Verification',
  });

  expect(submitButton).toBeDisabled();

  fireEvent.change(screen.getByTestId('cover-upload'), {
    target: { files: [new File(['banner'], 'banner.png')] },
  });
  fireEvent.change(screen.getByTestId('logo-upload'), {
    target: { files: [new File(['logo'], 'logo.png')] },
  });
  fireEvent.change(screen.getByLabelText('About'), {
    target: { value: 'We provide community support and volunteer programs.' },
  });
  fireEvent.change(screen.getByTestId('verification-document-upload'), {
    target: { files: [new File(['document'], '501c3.pdf')] },
  });

  expect(submitButton).not.toBeDisabled();
});

test('submits verification and shows pending state', async () => {
  renderPage();

  fireEvent.change(screen.getByTestId('cover-upload'), {
    target: { files: [new File(['banner'], 'banner.png')] },
  });
  fireEvent.change(screen.getByTestId('logo-upload'), {
    target: { files: [new File(['logo'], 'logo.png')] },
  });
  fireEvent.change(screen.getByLabelText('About'), {
    target: { value: 'We provide community support and volunteer programs.' },
  });
  fireEvent.change(screen.getByTestId('verification-document-upload'), {
    target: {
      files: [
        new File(['document'], '501c3.pdf', { type: 'application/pdf' }),
      ],
    },
  });

  fireEvent.click(
    screen.getByRole('button', { name: 'Submit for Verification' }),
  );

  await waitFor(() => {
    expect(mocks.submitVerification).toHaveBeenCalledWith(
      'org-123',
      expect.objectContaining({
        type: '501c3_or_equivalent',
        fileName: '501c3.pdf',
      }),
    );
  });

  expect(await screen.findByText('Verification Pending')).toBeInTheDocument();
  expect(
    screen.queryByRole('button', { name: 'Submit for Verification' }),
  ).not.toBeInTheDocument();
});

test('hides verification section for verified orgs', () => {
  mocks.org = { id: 'org-123', name: 'Habitat Restore', verified: true };

  renderPage();

  expect(
    screen.queryByRole('heading', { name: 'Verification Documents' }),
  ).not.toBeInTheDocument();
});
