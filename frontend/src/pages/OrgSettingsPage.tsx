import { useState, type ReactNode } from 'react';
import { Download, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';
import Toggle from '../components/ui/Toggle';
import ConfirmActionModal from '../components/dashboard/ConfirmActionModal';
import { useAuth } from '../contexts/AuthContext';
import { useOrgSettings } from '../hooks/useOrgSettings';

type SettingsSectionProps = {
  title: string;
  children: ReactNode;
  className?: string;
};

type SettingsRowProps = {
  label: string;
  children: ReactNode;
};

const SettingsSection = ({
  title,
  children,
  className = '',
}: SettingsSectionProps) => (
  <section
    className={`flex flex-col gap-6 bg-white shadow-card-shadow p-8 rounded-2xl ${className}`}
  >
    <h2 className="font-medium text-lg mb-2">{title}</h2>
    {children}
  </section>
);

const SettingsRow = ({ label, children }: SettingsRowProps) => (
  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
    <span className="text-text-muted text-sm">{label}</span>
    <div className="flex sm:justify-end">{children}</div>
  </div>
);

const AccountSection = ({
  orgName,
  isVerified,
}: {
  orgName: string;
  isVerified: boolean;
}) => (
  <SettingsSection title="Account">
    <SettingsRow label="Organization Name">
      <span>{orgName}</span>
    </SettingsRow>
    <SettingsRow label="Verification Status">
      <span>{isVerified ? 'Verified' : 'Pending review'}</span>
    </SettingsRow>
  </SettingsSection>
);

const PreferencesSection = () => (
  <SettingsSection title="Notifications">
    <SettingsRow label="Enable Notifications">
      <Toggle />
    </SettingsRow>
  </SettingsSection>
);

const PrivacyDataSection = ({
  isExporting,
  exportError,
  onExport,
}: {
  isExporting: boolean;
  exportError: Error | null;
  onExport: () => void;
}) => (
  <SettingsSection title="Privacy and Data">
    <SettingsRow label="Data Retention Period">
      <Select
        defaultValue="6 months"
        options={['1 month', '6 months', '1 year', 'Indefinite']}
      />
    </SettingsRow>
    <SettingsRow label="Download Organization Data">
      <Button size="sm" onClick={onExport} disabled={isExporting}>
        <Download className="w-4 h-4 mr-2" />
        {isExporting ? 'Exporting...' : 'Download Data'}
      </Button>
    </SettingsRow>
    {exportError && (
      <p className="text-sm text-red-500">
        {exportError.message || 'Failed to export organization data.'}
      </p>
    )}
  </SettingsSection>
);

const SecuritySection = () => (
  <SettingsSection title="Security">
    <SettingsRow label="Require Two-Factor Authentication">
      <Toggle />
    </SettingsRow>
  </SettingsSection>
);

const DangerZoneSection = ({
  onDeleteClick,
}: {
  onDeleteClick: () => void;
}) => (
  <section className="flex flex-col gap-6 bg-red-500/8 shadow-card-shadow p-8 rounded-2xl border-2 border-red-500">
    <h2 className="font-medium text-lg mb-2">Account Deletion</h2>
    <SettingsRow label="Delete Organization Account and Data">
      <Button
        size="sm"
        onClick={onDeleteClick}
        className="bg-red-600 hover:bg-red-700"
      >
        <Trash2 className="w-4 h-4 mr-2" />
        Delete Account
      </Button>
    </SettingsRow>
  </section>
);

const OrgSettingsPage = () => {
  const { org, logout } = useAuth();
  const navigate = useNavigate();
  const [isDeleteAccountOpen, setIsDeleteAccountOpen] = useState(false);

  const {
    exportOrganizationData,
    isExporting,
    exportError,
    deleteOrganization,
  } = useOrgSettings({
    orgId: org?.id,
    onDeleteSuccess: async () => {
      await logout();
      navigate('/');
    },
  });

  return (
    <main className="min-h-screen w-full flex flex-col p-6 items-center justify-center">
      <div className="w-full max-w-3xl flex flex-col justify-start mb-6">
        <h1 className="text-3xl font-semibold">Manage Settings</h1>
        <p className="mt-1 text-sm text-text-muted">
          Handle organization settings and preferences.
        </p>
      </div>

      <div className="flex flex-col gap-8 max-w-3xl w-full">
        <AccountSection
          orgName={org?.name ?? 'Unavailable'}
          isVerified={Boolean(org?.verified)}
        />
        <PreferencesSection />
        <PrivacyDataSection
          isExporting={isExporting}
          exportError={exportError}
          onExport={() => void exportOrganizationData()}
        />
        <SecuritySection />
        <DangerZoneSection onDeleteClick={() => setIsDeleteAccountOpen(true)} />
      </div>

      <ConfirmActionModal
        isOpen={isDeleteAccountOpen}
        onClose={() => setIsDeleteAccountOpen(false)}
        onConfirm={deleteOrganization}
        title="Delete Organization Account?"
        description="This will permanently remove the organization profile, team access, posts, verification records, and invited members who do not belong to another organization. This action cannot be undone."
        confirmText="Delete Organization"
        submittingText="Deleting..."
      />
    </main>
  );
};

export default OrgSettingsPage;
