import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import OrgSettingsPage from '../pages/OrgSettingsPage';

const mocks = vi.hoisted(() => ({
  logout: vi.fn(),
  navigate: vi.fn(),
  exportOrganizationData: vi.fn(),
  deleteOrganization: vi.fn(),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => mocks.navigate,
}));

vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    org: { id: 'org-123', name: 'Habitat Restore', verified: true },
    logout: mocks.logout,
  }),
}));

vi.mock('../hooks/useOrgSettings', () => ({
  useOrgSettings: () => ({
    exportOrganizationData: mocks.exportOrganizationData,
    isExporting: false,
    exportError: null,
    deleteOrganization: mocks.deleteOrganization,
    isDeleting: false,
  }),
}));

vi.mock('../components/ui/Button', () => ({
  default: ({ children, onClick, disabled }: any) => (
    <button onClick={onClick} disabled={disabled}>
      {children}
    </button>
  ),
}));

vi.mock('../components/ui/Toggle', () => ({
  default: () => <div data-testid="toggle" />,
}));

vi.mock('../components/ui/Select', () => ({
  default: ({ defaultValue }: any) => (
    <select data-testid="select" defaultValue={defaultValue}>
      <option>1 month</option>
      <option>6 months</option>
      <option>1 year</option>
      <option>Indefinite</option>
    </select>
  ),
}));

vi.mock('../components/dashboard/ConfirmActionModal', () => ({
  default: ({ isOpen, onClose, onConfirm, title, confirmText }: any) =>
    isOpen ? (
      <div role="dialog">
        <h3>{title}</h3>
        <button onClick={onConfirm}>{confirmText}</button>
        <button onClick={onClose}>Close</button>
      </div>
    ) : null,
}));

describe('OrgSettingsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders page headings', () => {
    render(<OrgSettingsPage />);

    expect(screen.getByText('Manage Settings')).toBeInTheDocument();
    expect(
      screen.getByText('Handle organization settings and preferences.'),
    ).toBeInTheDocument();
  });

  test('renders account information from auth context', () => {
    render(<OrgSettingsPage />);

    expect(screen.getByText('Organization Name')).toBeInTheDocument();
    expect(screen.getByText('Habitat Restore')).toBeInTheDocument();
    expect(screen.getByText('Verification Status')).toBeInTheDocument();
    expect(screen.getByText('Verified')).toBeInTheDocument();
  });

  test('renders toggle components', () => {
    render(<OrgSettingsPage />);

    expect(screen.getAllByTestId('toggle')).toHaveLength(2);
  });

  test('renders select component with default value', () => {
    render(<OrgSettingsPage />);

    expect(screen.getByTestId('select')).toBeInTheDocument();
  });

  test('downloads organization data', () => {
    render(<OrgSettingsPage />);

    fireEvent.click(screen.getByText('Download Data'));

    expect(mocks.exportOrganizationData).toHaveBeenCalledTimes(1);
  });

  test('opens delete account modal and confirms deletion', () => {
    render(<OrgSettingsPage />);

    fireEvent.click(screen.getByText('Delete Account'));
    expect(
      screen.getByText('Delete Organization Account?'),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText('Delete Organization'));

    expect(mocks.deleteOrganization).toHaveBeenCalledTimes(1);
  });

  test('closes modal when close clicked', () => {
    render(<OrgSettingsPage />);

    fireEvent.click(screen.getByText('Delete Account'));
    fireEvent.click(screen.getByText('Close'));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
