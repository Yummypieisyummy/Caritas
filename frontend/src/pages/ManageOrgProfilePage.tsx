import { useMemo, useState, type ChangeEvent } from 'react';
import { Camera, CheckCircle2, FileText, Save, Upload } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuth } from '../contexts/AuthContext';
import { submitOrganizationVerificationRequest } from '../services/org.api';

const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

const ManageOrgProfilePage = () => {
  const { org } = useAuth();
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [pfpFile, setPfpFile] = useState<File | null>(null);
  const [bannerUrl, setBannerUrl] = useState(org?.banner_url ?? '');
  const [pfpUrl, setPfpUrl] = useState(org?.pfp_url ?? '');
  const [about, setAbout] = useState(org?.about ?? '');
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [isVerificationPending, setIsVerificationPending] = useState(false);

  const isVerified = org?.verified === true;

  const canSubmitVerification = useMemo(
    () =>
      Boolean(
        !isVerified &&
          !isVerificationPending &&
          bannerUrl &&
          pfpUrl &&
          about.trim() &&
          documentFile,
      ),
    [about, bannerUrl, documentFile, isVerificationPending, isVerified, pfpUrl],
  );

  const submitVerificationMutation = useMutation({
    mutationFn: async () => {
      if (!org?.id || !documentFile) {
        throw new Error('Organization and verification document are required.');
      }

      const fileDataUrl = await readFileAsDataUrl(documentFile);

      return submitOrganizationVerificationRequest(org.id, {
        type: '501c3_or_equivalent',
        fileName: documentFile.name,
        mimeType: documentFile.type,
        size: documentFile.size,
        dataUrl: fileDataUrl,
        submittedAt: new Date().toISOString(),
      });
    },
    onSuccess: () => {
      setIsVerificationPending(true);
    },
  });

  const handleFileChange =
    (
      setFile: (file: File | null) => void,
      setUrl?: (url: string) => void,
    ) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0] ?? null;
      setFile(file);

      if (setUrl) {
        setUrl(
          file
            ? typeof URL.createObjectURL === 'function'
              ? URL.createObjectURL(file)
              : file.name
            : '',
        );
      }
    };

  return (
    <main className="min-h-screen w-full flex p-6 flex-col items-center justify-center">
      <div className="w-full max-w-5xl flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-semibold">Edit Organization Profile</h1>
          <p className="mt-1 text-sm text-text-muted">
            Manage your organization's public profile and verification.
          </p>
        </div>

        <div className="flex gap-4">
          <Button variant="secondary">Cancel</Button>
          <Button variant="primary">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <div className="flex w-full max-w-5xl flex-col gap-8">
        <section className="bg-white rounded-2xl p-8 shadow-card-shadow">
          <div className="mb-8">
            <h2 className="font-medium text-xl">Public Profile Details</h2>
            <p className="text-sm text-text-muted mt-1">
              Update the branding and story shown on your public profile.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-8">
            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Banner Image</label>
                <div className="relative w-full h-32 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 hover:border-accent-green transition-colors flex flex-col items-center justify-center cursor-pointer group">
                  <Upload
                    data-testid="cover-upload-icon"
                    className="text-text-muted/60 group-hover:text-accent-green mb-1"
                    size={20}
                  />
                  <span className="text-xs text-text-muted font-medium">
                    {bannerFile ? bannerFile.name : 'Upload Banner'}
                  </span>
                  <input
                    data-testid="cover-upload"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleFileChange(setBannerFile, setBannerUrl)}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="block text-sm font-medium">Profile Image</label>
                <div className="flex items-start gap-4">
                  <div className="relative h-24 w-24 bg-gray-100 rounded-full border-2 border-dashed border-gray-300 hover:border-accent-green transition-colors flex items-center justify-center cursor-pointer group shrink-0">
                    <Camera
                      className="text-text-muted/60 group-hover:text-accent-green"
                      size={24}
                    />
                    <input
                      data-testid="logo-upload"
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleFileChange(setPfpFile, setPfpUrl)}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                  <p className="text-xs text-text-muted mt-2">
                    {pfpFile ? pfpFile.name : 'Recommended: 400x400px JPG or PNG.'}
                  </p>
                </div>
              </div>
            </div>

            <form className="space-y-5">
              <Input
                id="orgName"
                label="Organization Name"
                placeholder="e.g. Habitat for Humanity"
                defaultValue={org?.name ?? ''}
                size="sm"
                variant="secondary"
              />
              <div className="w-full flex flex-col gap-2">
                <label htmlFor="about" className="text-sm font-medium">
                  About
                </label>
                <textarea
                  id="about"
                  rows={6}
                  value={about}
                  onChange={(event) => setAbout(event.target.value)}
                  className="bg-gray-50 outline-none transition-all duration-200 placeholder:text-text-muted border border-filter-stroke rounded-xl hover:border-accent-green/50 focus:border-accent-green focus:ring-2 focus:ring-accent-green/10 px-3 py-2 placeholder:text-sm text-sm resize-none"
                  placeholder="Tell volunteers about your mission..."
                />
              </div>
            </form>
          </div>
        </section>

        {!isVerified && (
          <section className="bg-white rounded-2xl p-8 shadow-card-shadow">
            <div className="mb-6">
              <h2 className="font-medium text-xl">Verification Documents</h2>
              <p className="text-sm text-text-muted mt-1">
                Upload your 501(c)(3) determination letter or equivalent
                documentation for admin review.
              </p>
            </div>

            {isVerificationPending ? (
              <div className="flex items-start gap-3 rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-emerald-900">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                <div>
                  <h3 className="font-semibold">Verification Pending</h3>
                  <p className="mt-1 text-sm">
                    Your documents have been submitted. Full dashboard features
                    will unlock once an admin approves your organization.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                <label className="relative flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center transition-colors hover:border-accent-green">
                  <FileText className="mb-2 h-6 w-6 text-text-muted/70" />
                  <span className="text-sm font-medium">
                    {documentFile
                      ? documentFile.name
                      : 'Upload 501(c)(3) or equivalent document'}
                  </span>
                  <span className="mt-1 text-xs text-text-muted">
                    PDF, PNG, or JPG accepted.
                  </span>
                  <input
                    data-testid="verification-document-upload"
                    type="file"
                    accept="application/pdf,image/png,image/jpeg"
                    onChange={handleFileChange(setDocumentFile)}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </label>

                {submitVerificationMutation.error && (
                  <p className="text-sm text-red-500">
                    {(submitVerificationMutation.error as Error).message ||
                      'Failed to submit verification documents.'}
                  </p>
                )}

                <div className="flex justify-end">
                  <Button
                    variant="primary"
                    onClick={() => void submitVerificationMutation.mutateAsync()}
                    disabled={
                      !canSubmitVerification ||
                      submitVerificationMutation.isPending
                    }
                  >
                    {submitVerificationMutation.isPending
                      ? 'Submitting...'
                      : 'Submit for Verification'}
                  </Button>
                </div>
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
};

export default ManageOrgProfilePage;
