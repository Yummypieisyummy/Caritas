import Button from '../components/ui/Button';
import Select from '../components/ui/Select';
import Toggle from '../components/ui/Toggle';
import ConfirmActionModal from '../components/dashboard/ConfirmActionModal';
import { useState } from 'react';

const OrgSettingsPage = () => {
  // const [enableNotifications, setEnableNotifications] = useState(true);
  const [isDeleteDataOpen, setIsDeleteDataOpen] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [isDeleteAccountOpen, setIsDeleteAccountOpen] = useState(false);

  const handleDeleteOrgData = () => {
    console.log('delete data test');
  };

  const handleDeleteAccount = () => {
    console.log('delete org account test');
  };

  const handleResetPassword = () => {
    console.log('reset password test');
  };

  return (
    <main className="min-h-screen w-full flex flex-col p-6 items-center justify-center">
      <div className="w-full max-w-3xl flex flex-col justify-start mb-6">
        <h1 className="text-3xl font-semibold">Manage Settings</h1>
        <p className="mt-1 text-sm text-text-muted">
          Handle Organization Settings and Preferences
        </p>
      </div>

      <div className="flex flex-col gap-8 max-w-3xl w-full">
        <section className="flex flex-col gap-6 bg-white shadow-card-shadow p-8 rounded-2xl">
          <h2 className="font-medium text-lg mb-2">Account</h2>
          <div className="flex justify-between items-center">
            <span className="text-text-muted text-sm">Organization Name</span>
            <span>Habitat Restore</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-text-muted text-sm">Email</span>
            <span>habitatrestore@gmal.com</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-text-muted text-sm">Member Since</span>
            <span>Feb 29, 2026</span>
          </div>
        </section>

        <section className="flex flex-col gap-6 bg-white shadow-card-shadow p-8 rounded-2xl">
          <h2 className="font-medium text-lg mb-2">Notifications</h2>
          <div className="flex justify-between items-center h-6">
            <span className="text-text-muted text-sm">
              Enable Notifications
            </span>
            {/* <label className="relative inline-block w-13 h-7">
              <input
                type="checkbox"
                checked={enableNotifications}
                onChange={() => setEnableNotifications((prev) => !prev)}
                className="peer sr-only"
              />
              <span className="absolute inset-0 cursor-pointer bg-gray-300 rounded-full duration-300 peer-checked:bg-accent-green before:content-[''] before:absolute before:w-5 before:h-5 before:bottom-1 before:left-1 before:rounded-full before:bg-white before:duration-300 peer-checked:before:translate-x-6" />
            </label> */}
            <Toggle />
          </div>
        </section>

        <section className="flex flex-col gap-6 bg-white shadow-card-shadow p-8 rounded-2xl">
          <h2 className="font-medium text-lg mb-2">Privacy and Data</h2>
          <div className="flex justify-between items-center h-6 mb-2">
            <span className="text-text-muted text-sm">
              Data Retention Period
            </span>
            <Select
              defaultValue="6 months"
              options={['1 month', '6 months', '1 year', 'Indefinite']}
            ></Select>
          </div>
          <div className="flex justify-between items-center h-6">
            <span className="text-text-muted text-sm">
              Delete Organization Data
            </span>
            <Button size="sm" onClick={() => setIsDeleteDataOpen(true)}>
              Delete Org Data
            </Button>
          </div>
        </section>

        <section className="flex flex-col gap-6 bg-white shadow-card-shadow p-8 rounded-2xl">
          <h2 className="font-medium text-lg mb-2">Security</h2>
          <div className="flex justify-between items-center h-6">
            <span className="text-text-muted text-sm">
              Reset Organization Password
            </span>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsResetOpen(true)}
            >
              Reset Password
            </Button>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-text-muted text-sm">
              Require Two-Factor Authentication
            </span>
            <Toggle />
          </div>
        </section>

        <section className="flex flex-col gap-6 bg-red-500/8 shadow-card-shadow p-8 rounded-2xl border-2 border-red-500">
          <h2 className="font-medium text-lg mb-2">ACCOUNT & DATA DELETION</h2>
          <div className="flex justify-between items-center h-6">
            <span className="text-text-muted text-sm">
              Delete Organization Account & Data
            </span>
            <Button size="sm" onClick={() => setIsDeleteAccountOpen(true)}>
              Delete Account
            </Button>
          </div>
        </section>
      </div>

      {/* --- Modals for confirmation settings --- */}

      {/* Delete data cofirmation */}
      <ConfirmActionModal
        isOpen={isDeleteDataOpen}
        onClose={() => setIsDeleteDataOpen(false)}
        onConfirm={handleDeleteOrgData}
        title="Delete Organization Data?"
        description="This will permanently remove stored organization data. This action cannot be undone."
        confirmText="Delete Data"
      />

      {/* Reset password cofirmation */}
      <ConfirmActionModal
        isOpen={isResetOpen}
        onClose={() => setIsResetOpen(false)}
        onConfirm={handleResetPassword}
        title="Reset Organization Password?"
        description="A password reset link will be sent to the organization email."
        confirmText="Send Reset Link"
      />

      {/* Delete account cofirmation */}
      <ConfirmActionModal
        isOpen={isDeleteAccountOpen}
        onClose={() => setIsDeleteAccountOpen(false)}
        onConfirm={handleDeleteAccount}
        title="Delete Organization Account?"
        description="This will permanently remove stored organization and account data. This action cannot be undone."
        confirmText="Delete Organization"
      />
    </main>
  );
};

export default OrgSettingsPage;
